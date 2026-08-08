import os
import logging
import asyncio
import httpx
import time
from contextlib import asynccontextmanager
from typing import Dict, Tuple

from fastapi import FastAPI, HTTPException, Request, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv
from datetime import datetime, timezone

# SQLAlchemy AsyncIO imports
from sqlalchemy import Column, Integer, String, Text, DateTime, select, desc, text

# ── Shared DB (engine + session factory + Base) ────────────────────────────
from db import Base, async_session, engine, get_db  # noqa: E402

# ── Auth module ────────────────────────────────────────────────────────────
from auth.config import settings as auth_settings
from auth.models import User  # registers User table with Base
from auth.routes import router as auth_router

# ── Events module ──────────────────────────────────────────────────────────
from events.models import ClubEvent   # registers the table with Base
from events.routes import router as events_router

# ── Forms module (Dynamic Event Form Builder) ──────────────────────────────
from forms.models import FormTemplate, FormField   # registers tables with Base
from forms.routes import router as forms_router

# ── Registrations module ───────────────────────────────────────────────────
from registrations.models import (
    EventRegistration, RegistrationResponse,
    Team, TeamMember, UploadedFile,
)
from registrations.routes import router as registrations_router

# ── Admin Dashboard module ─────────────────────────────────────────────────
from admin.routes import router as admin_router

# ── Members, Projects, Resources, Roadmaps ─────────────────────────────────
from members.models import ClubMember
from members.routes import router as members_router

from projects.models import ClubProject
from projects.routes import router as projects_router

from resources.models import ClubResource
from resources.routes import router as resources_router

from roadmaps.models import ClubRoadmap
from roadmaps.routes import router as roadmaps_router

# ── Tracks module ──────────────────────────────────────────────────────────
from tracks.models import ClubTrack
from tracks.routes import router as tracks_router

# ── Achievements module ────────────────────────────────────────────────────
from achievements.models import ClubAchievement
from achievements.routes import router as achievements_router

# ── Past Events module ─────────────────────────────────────────────────────
from past_events.models import PastEvent
from past_events.routes import router as past_events_router


load_dotenv()
logging.basicConfig(level=logging.INFO)

# --- RATE LIMITER STATE ---
CHAT_RATE_LIMITS: Dict[str, Tuple[int, float]] = {}
MAX_REQUESTS_PER_MINUTE = 10

# ── Startup/Shutdown Lifespan ──────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Validate auth configuration early so we fail fast.
    auth_settings.validate()
    
    # Auto-create all tables (idempotent).
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        logging.warning(f"Could not connect to database for table creation: {str(e)}")

    # Start the keep-alive background task
    task = asyncio.create_task(keep_alive_task())
    yield
    task.cancel()

# Disable interactive docs in production to avoid exposing the API schema publicly
_is_production = os.getenv("ENVIRONMENT") == "production"
app = FastAPI(
    title="AI Club DAU API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url=None if _is_production else "/docs",
    redoc_url=None if _is_production else "/redoc",
    openapi_url=None if _is_production else "/openapi.json",
)

# --- CORS SETUP ---
# Set ALLOWED_ORIGINS in your environment as a comma-separated list of allowed origins.
# In development without ALLOWED_ORIGINS set, only localhost origins are allowed.
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    origins = [orig.strip() for orig in allowed_origins_env.split(",") if orig.strip()]
else:
    origins = [
        "http://localhost:5173",
        "http://localhost:8080",
        "http://localhost:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=600,
)

# --- SERVE UPLOADS STATICALLY ---
uploads_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")



# ── Register routers ───────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(events_router)
app.include_router(forms_router)
app.include_router(registrations_router)
app.include_router(admin_router)
app.include_router(achievements_router)
app.include_router(members_router)
app.include_router(projects_router)
app.include_router(resources_router)
app.include_router(roadmaps_router)
app.include_router(tracks_router)
app.include_router(past_events_router)

# ── Stats Endpoint (Navbar) ────────────────────────────────────────────────
from sqlalchemy.future import select
from sqlalchemy import func

@app.get("/api/stats")
async def get_club_stats(db=Depends(get_db)):
    events_count = await db.scalar(select(func.count(ClubEvent.id)))
    projects_count = await db.scalar(select(func.count(ClubProject.id)))
    members_count = await db.scalar(select(func.count(ClubMember.id)))
    
    return {
        "events": events_count or 0,
        "projects": projects_count or 0,
        "members": members_count or 0,
    }


# ── Startup ────────────────────────────────────────────────────────────────
async def keep_alive_task():
    """
    Pings the /health endpoint every 14 minutes and 50 seconds to prevent
    Render free tier from spinning down the instance.
    Pings /health (not /docs) so the API schema is never exposed just for keep-alive.
    """
    render_external_url = os.getenv("RENDER_EXTERNAL_URL", "https://ai-club-website-e9zk.onrender.com")
    url = f"{render_external_url}/health"
    while True:
        await asyncio.sleep(890)  # 14 minutes and 50 seconds
        try:
            async with httpx.AsyncClient() as client:
                await client.get(url, timeout=10)
                logging.info(f"Keep-alive ping sent to {url}")
        except asyncio.CancelledError:
            break
        except Exception as e:
            logging.error(f"Keep-alive ping failed: {e}")


# ── Gemini AI setup ────────────────────────────────────────────────────────
ai_client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# ---------------------------------------------------------------------------
# STATIC KNOWLEDGE BASE — mirrors everything displayed on the website
# ---------------------------------------------------------------------------
CLUB_KNOWLEDGE = """
=== AI CLUB DAU — COMPLETE KNOWLEDGE BASE ===

ABOUT THE CLUB:
AI Club DAU is the Artificial Intelligence and Machine Learning club at DAU (Dhirubhai Ambani Institute of Information and Communication Technology), Gandhinagar, Gujarat, India.
The club runs events, workshops, hackathons, and collaborative projects to help students explore AI/ML.

SOCIAL LINKS:
- Discord: https://discord.gg/yB3Huet5
- Instagram: https://www.instagram.com/aiclub_dau/
- GitHub: https://github.com/ai-club-dau
- LinkedIn: https://www.linkedin.com/company/ai-club-dau/

HOW TO JOIN:
Fill out the Join Form on the website with your name, email, branch, interest area, and reason for joining.

---

MEMBERS (Academic Year 2025-2026):

1. Saumya Shah — Member
   GitHub: https://github.com/saumyashah0510
   LinkedIn: https://www.linkedin.com/in/saumya-shah-5bb8602b4/
   Project: F1-Prediction-Hub — Full-stack Formula 1 site with live standings and ML-powered race predictions.
   Events: EDA Session, Linear Regression, Wearable AI

2. Sanket Agarwal — Member
   LinkedIn: https://www.linkedin.com/in/sanket-agarwal-2b606b3a3
   Interests: Problem-solving, competitive programming, AI applications.
   Events: Worldquant

3. Parth Garg — Member
   GitHub: https://github.com/gargparth2406-creator
   LinkedIn: https://www.linkedin.com/in/parth-garg-024b40379
   Events: Worldquant, Integration Bee, EDA Session, Intro To Python, Linear Regression, Wearable AI

4. Manal Patel — Extended Core Member
   GitHub: https://github.com/manalPatel2557
   LinkedIn: https://www.linkedin.com/in/manal-patel-a87b11382/
   Events: Worldquant, Integration Bee, EDA Session, Intro To Python, Linear Regression, Wearable AI

5. Makavana Axit — Member
   Events: EDA Session, Intro To Python, Linear Regression, Wearable AI

6. Kush Ashvinbhai Patel — Member
   GitHub: https://github.com/Kush5699
   LinkedIn: https://www.linkedin.com/in/kush-patel-6a074b258
   Project: ShelfMind-AI — Real-time computer-vision shelf monitoring for retail (product detection, planograms, OOS detection).
   Events: Linear Regression

7. Rushil Dangar — Member
   GitHub: https://github.com/Cybernyte-31
   LinkedIn: https://www.linkedin.com/in/rushil-dangar-42304632b
   Background: B.Tech ICT, interests in AI, Robotics, C/C++/Python.
   Events: Integration Bee, Intro To Python, Wearable AI

8. Aaditya Sarda — Core Member
   GitHub: https://github.com/Aadityasarda-25
   LinkedIn: https://www.linkedin.com/in/aaditya-sarda-426357371
   Quote: "Turning complex math, messy data, and a lot of curiosity into working AI systems."
   Events: Worldquant, Integration Bee, EDA Session, Intro To Python, Linear Regression, Wearable AI

9. Vasani Sahil Rajeshbhai — Member
   GitHub: https://github.com/sahil-vasani
   LinkedIn: https://www.linkedin.com/in/sahil-vasani/
   Projects: Renewable-Energy-Solar-and-Wind-Prediction, Electricity-Bill-Prediction-ML
   Events: Linear Regression, Wearable AI

---

PROJECTS:

1. F1-Prediction-Hub — by Saumya Shah
   Full-stack Formula 1 website with live standings, driver/team info, and ML-powered race predictions.
   Tags: Machine Learning, Full Stack, Data Science, Sports Analytics, Python
   GitHub: https://github.com/saumyashah0510/F1-Prediction-Hub

2. ShelfMind-AI — by Kush Ashvinbhai Patel
   End-to-end computer-vision retail intelligence app: monitors shelves, detects products, generates planograms, flags out-of-stock issues.
   Tags: Computer Vision, Object Detection, Retail AI, Deep Learning, OpenCV, Python
   GitHub: https://github.com/Kush5699/ShelfMind-AI

3. Renewable-Energy-Solar-and-Wind-Prediction — by Vasani Sahil Rajeshbhai
   Predicts optimal location and output for solar panels using sunlight data.
   Tags: Machine Learning, Renewable Energy, Regression, Data Science, Python
   GitHub: https://github.com/sahil-vasani/Renewable-Energy-Solar-and-Wind-Prediction

4. Electricity-Bill-Prediction-ML — by Vasani Sahil Rajeshbhai
   Forecasts next month's electricity bill based on historical usage patterns.
   Tags: Machine Learning, Regression, Forecasting, Energy, Python
   GitHub: https://github.com/sahil-vasani/Electricity-bill-prediction-ML

---

EVENTS (Academic Year 2025-2026):

Upcoming:
- GenAI Hackathon 2026 (April 5, 2026): 48-hour hackathon building with the latest generative AI APIs. Open to all branches. Prizes, mentors, and free pizza.

Past Events:
- AI Triathlon (Late 2025): Multi-stage club event combining coding challenges, model optimization, and rapid prototyping. 50+ participants.
- Transformers Deep-Dive Talk (Feb 10, 2026): Prof. Aryan Mehta covered attention mechanisms and the Transformer architecture. 80 attendees.
- EDA Session: Exploratory Data Analysis hands-on session.
- Linear Regression Workshop: Fundamentals of linear regression with code.
- Wearable AI: Session on AI in wearable devices.
- Worldquant: Participation in WorldQuant quantitative finance challenge.
- Integration Bee: Mathematics competition.
- Intro To Python: Beginner Python programming session.

Upcoming Workshops:
- Intro to PyTorch: Hands-on workshop on tensors, autograd, and building neural networks from scratch.

---

BLOG POSTS (by Jash Shah — https://medium.com/@jashshah780):

1. "Self-Host n8n for Free: Docker + ngrok Setup That Beats n8n Cloud"
   Run n8n locally with Docker, expose it publicly via ngrok, and integrate with Telegram, Gmail, Google Drive, Stripe — all for free.
   Read: https://medium.com/@jashshah780

2. "Mem0: Building AI Agents with Scalable Long-Term Memory"
   Mem0 solves LLM memory loss by extracting key facts from conversations and storing them as a knowledge graph using vector embeddings and Neo4j.
   Read: https://medium.com/@jashshah780

3. "Social Vault — Stop Hunting for Your Own Links Every Time You Fill a Form"
   A browser extension (available on Microsoft Edge Add-ons) that stores your personal links and lets you copy them with one click.
   Read: https://medium.com/@jashshah780

---

RESOURCES:
The club provides curated learning resources for AI/ML topics including Python, Deep Learning, Computer Vision, and NLP.

---

FREQUENTLY ASKED QUESTIONS:

Q: How do I join AI Club DAU?
A: Fill out the Join Form on the website at the bottom of the page. Provide your name, email, branch, area of interest, and reason for joining.

Q: Who can join?
A: Any DAU student interested in AI/ML can apply. All branches are welcome.

Q: What events does the club run?
A: The club runs hackathons, workshops, deep-dive talks, and competitions. Past events include AI Triathlon, EDA Sessions, Linear Regression workshops, Intro to Python, Wearable AI, and more.

Q: What projects has the club built?
A: Members have built F1-Prediction-Hub (ML + full-stack), ShelfMind-AI (computer vision for retail), Solar/Wind energy prediction models, and Electricity bill forecasting ML models.

Q: Who are the core members?
A: The club's core team includes Aaditya Sarda (Core Member) and Manal Patel (Extended Core Member), along with all other active members who contribute to events and projects.

Q: Where can I find the club on social media?
A: Discord: https://discord.gg/yB3Huet5 | Instagram: @aiclub_dau | GitHub: ai-club-dau | LinkedIn: AI Club DAU
"""

# --- DATA MODELS ---
class ChatRequest(BaseModel):
    message: str


# ── AI Chatbot ─────────────────────────────────────────────────────────────
@app.post("/api/club-chat")
async def club_chat(request: ChatRequest, http_request: Request):
    # ── Rate Limiting ──────────────────────────────────────────────────────
    client_ip = http_request.client.host if http_request.client else "unknown"
    now = time.time()
    
    # Clean up old records periodically (simple approach for this dict)
    if len(CHAT_RATE_LIMITS) > 1000:
        keys_to_delete = [k for k, v in CHAT_RATE_LIMITS.items() if now - v[1] > 60]
        for k in keys_to_delete:
            del CHAT_RATE_LIMITS[k]

    count, start_time = CHAT_RATE_LIMITS.get(client_ip, (0, now))
    if now - start_time > 60:
        # Reset window
        count = 1
        start_time = now
    else:
        count += 1

    CHAT_RATE_LIMITS[client_ip] = (count, start_time)

    if count > MAX_REQUESTS_PER_MINUTE:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again in a minute."
        )

    try:
        dynamic_context = ""
        try:
            async with async_session() as session:
                result = await session.execute(
                    select(ClubEvent).order_by(desc(ClubEvent.event_date)).limit(1)
                )
                latest_event = result.scalars().first()
                if latest_event:
                    dynamic_context = f"""
LATEST EVENT FROM DATABASE:
- Name: {latest_event.title}
- Date: {latest_event.event_date.isoformat() if hasattr(latest_event.event_date, 'isoformat') else latest_event.event_date}
- Description: {latest_event.description}
- Category: {latest_event.category}
- Venue: {latest_event.venue}
"""
        except Exception as db_e:
            logging.warning(f"Could not fetch dynamic context from DB: {str(db_e)}")
            # Continue without dynamic context

        system_prompt = f"""You are NeuralNode, the official AI assistant of AI Club DAU — a friendly, knowledgeable, and enthusiastic chatbot embedded on the club's website.

Your job is to help visitors learn about the club — its members, projects, events, blogs, how to join, and anything else related to AI Club DAU.

RULES:
- Be warm, concise, and helpful. Use a conversational but professional tone.
- Only answer questions related to AI Club DAU, its members, projects, events, AI/ML topics, or the website content.
- If asked something completely unrelated (e.g., unrelated coding questions, personal advice), politely redirect: "I'm best at answering questions about AI Club DAU! Ask me about our members, projects, events, or how to join."
- When listing members, projects, or events, be specific and accurate — use ONLY the data below.
- If you don't know something, say so honestly rather than making up information.
- Format responses clearly. Use short paragraphs or bullet points where helpful.
- Always encourage visitors to join the club or explore the website!

{CLUB_KNOWLEDGE}
{dynamic_context}
"""

        api_key = os.getenv("GOOGLE_API_KEY", "")
        if not api_key or api_key == "your_gemini_api_key_here":
            return {"reply": "I am currently running in offline mode because the Gemini API key is missing. Please add a valid `GOOGLE_API_KEY` to the `backend/.env` file to chat with me!"}

        response = ai_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"{system_prompt}\n\nUser question: {request.message}"
        )

        return {"reply": response.text}

    except Exception as e:
        logging.error(f"CRITICAL CHAT ERROR: {str(e)}", exc_info=True)
        return {"reply": "I'm having trouble connecting to my AI brain right now (invalid API key or quota exceeded). Please check the backend logs or verify the Gemini API key."}


# Used only for local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
