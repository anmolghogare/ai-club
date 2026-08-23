import asyncio
import logging
from sqlalchemy import select, delete
from db import async_session, engine, Base
from auth.models import User
from weekly_veneza.models import WeeklyVenezaWeek, WeeklyVenezaResource

logging.basicConfig(level=logging.INFO)

new_resources = [
    {
        "title": "Python Basics",
        "description": "Complete Python tutorial covering data structures, control flow, functions, and core programming principles.",
        "resource_type": "VIDEO",
        "url": "https://youtu.be/rfscVS0vtbw?si=btlOx35YT9Pdne0X",
        "est_minutes": 120,
        "order_no": 1,
    },
    {
        "title": "NumPy",
        "description": "High-performance numerical computing in Python, multidimensional array manipulation, and vectorization.",
        "resource_type": "VIDEO",
        "url": "https://youtu.be/QUT1VHiLmmI?si=1wLSgS89McMWE-T2",
        "est_minutes": 90,
        "order_no": 2,
    },
    {
        "title": "Pandas",
        "description": "Comprehensive data analysis & manipulation library covering DataFrames, series, filtering, and data cleaning.",
        "resource_type": "COURSE",
        "url": "https://youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS&si=oPOnrY3KmCaUa9uL",
        "est_minutes": 180,
        "order_no": 3,
    },
    {
        "title": "Machine Learning Specialization - 1 (Andrew Ng)",
        "description": "Supervised Machine Learning: Regression and Classification by Stanford / DeepLearning.AI instructor Andrew Ng.",
        "resource_type": "COURSE",
        "url": "https://youtube.com/playlist?list=PLkDaE6sCZn6FNC6YRfRQc_FbeQrF8BwGI&si=CQKlhHfzpvsKGd0V",
        "est_minutes": 360,
        "order_no": 4,
    },
]

async def update_resources():
    async with async_session() as db:
        # Find current active week
        result = await db.execute(
            select(WeeklyVenezaWeek).where(WeeklyVenezaWeek.is_current == True)
        )
        current_week = result.scalar_one_or_none()

        if not current_week:
            # Fallback: get the first week or create one
            result_all = await db.execute(
                select(WeeklyVenezaWeek).order_by(WeeklyVenezaWeek.week_number.asc())
            )
            current_week = result_all.scalars().first()

        if not current_week:
            current_week = WeeklyVenezaWeek(
                week_number=1,
                title="Week 1: Python, NumPy, Pandas & ML Fundamentals",
                description="Master Python basics, numerical computing with NumPy, data analysis with Pandas, and ML Specialization 1.",
                is_current=True,
                status="current",
                order_no=1
            )
            db.add(current_week)
            await db.flush()
        else:
            # Update title & description of current week to match the new focus
            current_week.title = f"Week {current_week.week_number}: Python, Data Science & ML Fundamentals"
            current_week.description = "Essential Python basics, NumPy array computing, Pandas data analysis, and Stanford's Machine Learning Specialization."
            current_week.is_current = True
            current_week.status = "current"

            # Remove previous resources for this current week
            await db.execute(
                delete(WeeklyVenezaResource).where(WeeklyVenezaResource.week_id == current_week.id)
            )

        # Add the 4 user-requested resources
        for item in new_resources:
            res = WeeklyVenezaResource(
                week_id=current_week.id,
                title=item["title"],
                description=item["description"],
                resource_type=item["resource_type"],
                url=item["url"],
                est_minutes=item["est_minutes"],
                order_no=item["order_no"]
            )
            db.add(res)

        await db.commit()
        logging.info(f"Successfully updated current week (Week {current_week.week_number}) resources in database!")

if __name__ == "__main__":
    asyncio.run(update_resources())
