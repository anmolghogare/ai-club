import asyncio
import asyncpg

async def check():
    url = "postgresql://postgres.jtpkznqerxzxkhufgojs:Aiclubdaiict@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
    print("Connecting...")
    try:
        conn = await asyncpg.connect(url, statement_cache_size=0)
        print("Connected!")
        await conn.execute("SELECT 1;")
        print("Query successful!")
        await conn.close()
    except Exception as e:
        print(f"Error: {e}")

asyncio.run(check())
