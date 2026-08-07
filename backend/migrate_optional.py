import asyncio
import asyncpg
import os

async def migrate():
    # Use the known working pooler connection
    url = "postgresql://postgres.jtpkznqerxzxkhufgojs:Aiclubdaiict@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres"
    
    print("Connecting to database...")
    try:
        conn = await asyncpg.connect(url, statement_cache_size=0)
        print("Connected! Running ALTER TABLE statements...")
        
        # 1. club_achievements
        print("Altering club_achievements...")
        await conn.execute("ALTER TABLE club_achievements ALTER COLUMN title DROP NOT NULL;")
        await conn.execute("ALTER TABLE club_achievements ALTER COLUMN student DROP NOT NULL;")
        await conn.execute("ALTER TABLE club_achievements ALTER COLUMN description DROP NOT NULL;")
        await conn.execute("ALTER TABLE club_achievements ALTER COLUMN category DROP NOT NULL;")
        await conn.execute("ALTER TABLE club_achievements ALTER COLUMN icon DROP NOT NULL;")
        try:
            await conn.execute("ALTER TABLE club_achievements ADD COLUMN image_url VARCHAR(500);")
            print("Added image_url to club_achievements")
        except asyncpg.exceptions.DuplicateColumnError:
            print("image_url already exists in club_achievements")

        # 2. club_events
        print("Altering club_events...")
        await conn.execute("ALTER TABLE club_events ALTER COLUMN title DROP NOT NULL;")
        await conn.execute("ALTER TABLE club_events ALTER COLUMN description DROP NOT NULL;")
        await conn.execute("ALTER TABLE club_events ALTER COLUMN category DROP NOT NULL;")
        await conn.execute("ALTER TABLE club_events ALTER COLUMN event_type DROP NOT NULL;")
        await conn.execute("ALTER TABLE club_events ALTER COLUMN status DROP NOT NULL;")

        # 3. club_projects
        print("Altering club_projects...")
        await conn.execute("ALTER TABLE club_projects ALTER COLUMN title DROP NOT NULL;")
        await conn.execute("ALTER TABLE club_projects ALTER COLUMN author DROP NOT NULL;")
        await conn.execute("ALTER TABLE club_projects ALTER COLUMN description DROP NOT NULL;")
        await conn.execute("ALTER TABLE club_projects ALTER COLUMN github_link DROP NOT NULL;")

        # 4. club_members
        print("Altering club_members...")
        await conn.execute("ALTER TABLE club_members ALTER COLUMN name DROP NOT NULL;")
        await conn.execute("ALTER TABLE club_members ALTER COLUMN role DROP NOT NULL;")

        # 5. club_resources
        print("Altering club_resources...")
        # if the table exists
        try:
            await conn.execute("ALTER TABLE club_resources ALTER COLUMN title DROP NOT NULL;")
            await conn.execute("ALTER TABLE club_resources ALTER COLUMN description DROP NOT NULL;")
            await conn.execute("ALTER TABLE club_resources ALTER COLUMN url DROP NOT NULL;")
            await conn.execute("ALTER TABLE club_resources ALTER COLUMN category DROP NOT NULL;")
        except asyncpg.exceptions.UndefinedTableError:
            print("club_resources table does not exist, skipping.")

        print("Migration complete!")
        await conn.close()
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    asyncio.run(migrate())
