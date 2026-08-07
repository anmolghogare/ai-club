import asyncio
from db import async_session, engine
from achievements.models import ClubAchievement
from sqlalchemy import text

async def main():
    try:
        async with engine.begin() as conn:
            # check if table exists
            res = await conn.execute(text("SELECT to_regclass('club_achievements')"))
            print("Table exists:", res.scalar())
    except Exception as e:
        print("Error:", e)

asyncio.run(main())
