import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from db import Base
from resources.models import ClubResource
import os

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite+aiosqlite:///./club.db")

engine = create_async_engine(DATABASE_URL, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

resources_data = [
    {
        "group_name": "Start here",
        "items": [
            {
                "title": "3Blue1Brown — Neural Networks",
                "description": "Four videos that make backpropagation visual before it becomes algebraic.",
                "type": "VIDEO",
                "url": "https://www.3blue1brown.com/topics/neural-networks"
            },
            {
                "title": "Neural Networks: Zero to Hero",
                "description": "Karpathy builds autograd, then a language model, from an empty file. Our language track follows this.",
                "type": "COURSE",
                "url": "https://karpathy.ai/zero-to-hero.html"
            },
            {
                "title": "Practical Deep Learning — fast.ai",
                "description": "Top-down: you train a working model in lesson one and learn why it worked in lesson six.",
                "type": "COURSE",
                "url": "https://course.fast.ai/"
            },
            {
                "title": "Deep Learning — Goodfellow, Bengio, Courville",
                "description": "The reference. Chapters 2–4 are the maths prerequisite for everything else on this page.",
                "type": "BOOK",
                "url": "https://www.deeplearningbook.org/"
            }
        ]
    },
    {
        "group_name": "Go deeper",
        "items": [
            {
                "title": "Hugging Face NLP Course",
                "description": "Transformers, tokenizers, and datasets as they're used in practice rather than in papers.",
                "type": "COURSE",
                "url": "https://huggingface.co/learn/nlp-course"
            },
            {
                "title": "Dive into Deep Learning",
                "description": "A textbook where every chapter is runnable. Good for filling a specific gap fast.",
                "type": "BOOK",
                "url": "https://d2l.ai/"
            },
            {
                "title": "Spinning Up in Deep RL",
                "description": "The clearest on-ramp to reinforcement learning, with reference implementations.",
                "type": "COURSE",
                "url": "https://spinningup.openai.com/"
            },
            {
                "title": "Stanford CS231n",
                "description": "Convolutional networks for visual recognition. Notes and assignments are public.",
                "type": "COURSE",
                "url": "https://cs231n.stanford.edu/"
            },
            {
                "title": "Distill",
                "description": "Archived but unmatched — interactive explanations of the ideas that are hardest to picture.",
                "type": "ESSAYS",
                "url": "https://distill.pub/"
            }
        ]
    },
    {
        "group_name": "Papers, data, and compute",
        "items": [
            {
                "title": "arXiv cs.LG",
                "description": "Where the reading group picks from each week. Skim titles on Mondays.",
                "type": "PAPERS",
                "url": "https://arxiv.org/list/cs.LG/recent"
            },
            {
                "title": "Papers with Code",
                "description": "Find the implementation before you commit to reproducing the method.",
                "type": "PAPERS",
                "url": "https://paperswithcode.com/"
            },
            {
                "title": "Kaggle",
                "description": "Free GPU notebooks and datasets. We enter one competition as a club each semester.",
                "type": "TOOLS",
                "url": "https://www.kaggle.com/"
            },
            {
                "title": "Google Colab",
                "description": "Enough GPU for every track exercise. Nobody needs their own hardware to start.",
                "type": "TOOLS",
                "url": "https://colab.research.google.com/"
            },
            {
                "title": "Hugging Face Datasets",
                "description": "First stop when a project needs data and you don't want to scrape it.",
                "type": "DATA",
                "url": "https://huggingface.co/datasets"
            }
        ]
    }
]

async def add_data():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        # Clear existing to avoid duplicates if run multiple times
        from sqlalchemy import text
        await session.execute(text("DELETE FROM club_resources"))

        order_counter = 0
        for group in resources_data:
            group_name = group["group_name"]
            for item in group["items"]:
                order_counter += 1
                res = ClubResource(
                    title=item["title"],
                    description=item["description"],
                    resource_type=item["type"],
                    url=item["url"],
                    group_name=group_name,
                    order_no=order_counter
                )
                session.add(res)
        
        await session.commit()
        print("Successfully added resources to the database!")

asyncio.run(add_data())
