import asyncio
import asyncpg
import sys

async def check():
    url = "postgresql://postgres.jtpkznqerxzxkhufgojs:Akhilesh1234@@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
    print("Testing connection...")
    try:
        conn = await asyncpg.connect(url)
        print("Successfully connected!")
        await conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

asyncio.run(check())
