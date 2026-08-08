import asyncio
import asyncpg

async def main():
    # Direct connection URL constructed from the pooler URL
    url = "postgresql://postgres.ynmoyvulnqseioqhjeyi:C5EZvM%2Byg55tRkL@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"
    print(f"Connecting to {url}...")
    try:
        conn = await asyncpg.connect(url)
        print("Success!")
        await conn.close()
    except Exception as e:
        print(f"Failed: {e}")

asyncio.run(main())
