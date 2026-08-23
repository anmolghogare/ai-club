import asyncio
import logging
from sqlalchemy import select, delete
from db import async_session, engine, Base
from auth.models import User
from weekly_veneza.models import WeeklyVenezaWeek, WeeklyVenezaResource

logging.basicConfig(level=logging.INFO)

async def reset_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Delete all existing weekly veneza data to ensure no dummy resources from main resources section remain
        await db.execute(delete(WeeklyVenezaResource))
        await db.execute(delete(WeeklyVenezaWeek))
        await db.commit()

        logging.info("Cleared old weekly veneza database entries.")

        # Create current week (Week 1) with user-provided resources only
        w1 = WeeklyVenezaWeek(
            week_number=1,
            title="Week 1: Python, Data Science & ML Fundamentals",
            description="Master Python basics, numerical computing with NumPy, data analysis with Pandas, and Machine Learning Specialization 1 by Andrew Ng.",
            is_current=True,
            status="current",
            order_no=1,
        )
        db.add(w1)
        await db.flush()

        r1 = WeeklyVenezaResource(
            week_id=w1.id,
            title="Python Basics",
            description="Complete Python tutorial covering data structures, control flow, functions, and core programming principles.",
            resource_type="VIDEO",
            url="https://youtu.be/rfscVS0vtbw?si=btlOx35YT9Pdne0X",
            est_minutes=120,
            order_no=1,
        )
        r2 = WeeklyVenezaResource(
            week_id=w1.id,
            title="NumPy",
            description="High-performance numerical computing in Python, multidimensional array manipulation, and vectorization.",
            resource_type="VIDEO",
            url="https://youtu.be/QUT1VHiLmmI?si=1wLSgS89McMWE-T2",
            est_minutes=90,
            order_no=2,
        )
        r3 = WeeklyVenezaResource(
            week_id=w1.id,
            title="Pandas",
            description="Comprehensive data analysis & manipulation library covering DataFrames, series, filtering, and data cleaning.",
            resource_type="COURSE",
            url="https://youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS&si=oPOnrY3KmCaUa9uL",
            est_minutes=180,
            order_no=3,
        )
        r4 = WeeklyVenezaResource(
            week_id=w1.id,
            title="Machine Learning Specialization - 1 (Andrew Ng)",
            description="Supervised Machine Learning: Regression and Classification by Stanford / DeepLearning.AI instructor Andrew Ng.",
            resource_type="COURSE",
            url="https://youtube.com/playlist?list=PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI&si=CQKlhHfzpvsKGd0V",
            est_minutes=360,
            order_no=4,
        )

        db.add_all([r1, r2, r3, r4])
        await db.commit()
        logging.info("Successfully reset Weekly Veneza DB with ONLY user-specified current week resources!")

if __name__ == "__main__":
    asyncio.run(reset_db())
