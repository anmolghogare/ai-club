import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from db import Base
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite+aiosqlite:///./club.db")

engine = create_async_engine(DATABASE_URL, echo=False)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def seed_data():
    from tracks.models import ClubTrack
    from projects.models import ClubProject
    from members.models import ClubMember

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        # Check if already seeded
        from sqlalchemy import text
        result = await session.execute(text("SELECT count(id) FROM club_tracks"))
        count = result.scalar()
        if count > 0:
            print("Database already seeded.")
            return

        # Add Track
        t1 = ClubTrack(title="Foundations", description="Linear algebra you can actually use, gradients by hand...", audience="First years")
        session.add(t1)

        # Add Member
        m1 = ClubMember(name="John Doe", role="Member", photo="", description="A passionate member.", order_no=1)
        session.add(m1)
        
        await session.commit()
        await session.refresh(m1)

        # Add Project
        p1 = ClubProject(title="AI Digit Classifier", author="John Doe", author_id=m1.id, description="Built an MNIST classifier from scratch.", tags='["Machine Learning", "Computer Vision"]', github_link="https://github.com/")
        session.add(p1)

        await session.commit()
        print("Successfully seeded the database with test data!")

asyncio.run(seed_data())
