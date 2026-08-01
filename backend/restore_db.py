import os
import asyncio
import json
import datetime
from sqlalchemy import text, insert, DateTime, Date, Time
from db import Base, engine

# Import all models to ensure they register on Base
from auth.models import User
from events.models import ClubEvent
from forms.models import FormTemplate, FormField
from registrations.models import EventRegistration, RegistrationResponse, Team, TeamMember, UploadedFile
from members.models import ClubMember, ClubProject

async def restore():
    backup_file = "db_full_backup.json"
    if not os.path.exists(backup_file):
        print(f"Error: Backup file {backup_file} not found!")
        return

    with open(backup_file, "r", encoding="utf-8") as f:
        backup_data = json.load(f)

    # 1. Create all tables if they don't exist
    print("Ensuring all tables exist in the new database...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with engine.connect() as conn:
        # 2. Delete existing data in reverse dependency order to avoid foreign key violations
        print("Cleaning up existing data in reverse dependency order...")
        for table in reversed(Base.metadata.sorted_tables):
            print(f" - Deleting all records from table '{table.name}'...")
            await conn.execute(table.delete())
        
        # Commit deletion
        await conn.commit()

        # 3. Insert records in dependency order
        print("\nRestoring records in dependency order...")
        for table in Base.metadata.sorted_tables:
            rows = backup_data.get(table.name, [])
            if not rows:
                print(f" - Table '{table.name}' is empty in backup.")
                continue

            print(f" - Inserting {len(rows)} rows into '{table.name}'...")
            
            # Convert ISO-formatted string datetimes/dates/times back to Python objects
            processed_rows = []
            for row in rows:
                row_dict = dict(row)
                for column in table.columns:
                    val = row_dict.get(column.name)
                    if val is not None:
                        # Convert to appropriate Python objects based on column type
                        if isinstance(column.type, DateTime):
                            try:
                                row_dict[column.name] = datetime.datetime.fromisoformat(val)
                            except (ValueError, TypeError):
                                pass
                        elif isinstance(column.type, Date):
                            try:
                                row_dict[column.name] = datetime.date.fromisoformat(val)
                            except (ValueError, TypeError):
                                pass
                        elif isinstance(column.type, Time):
                            try:
                                row_dict[column.name] = datetime.time.fromisoformat(val)
                            except (ValueError, TypeError):
                                pass
                processed_rows.append(row_dict)

            # Insert all rows
            await conn.execute(insert(table), processed_rows)
            await conn.commit()

        # 4. Update PostgreSQL sequence values so serial autoincrement works
        print("\nUpdating PostgreSQL sequences...")
        for table in Base.metadata.sorted_tables:
            # Check if 'id' column exists
            if 'id' in table.columns:
                print(f" - Setting sequence for '{table.name}'...")
                # pg_get_serial_sequence returns sequence name, e.g. public.users_id_seq
                seq_query = text(f"""
                    SELECT setval(
                        pg_get_serial_sequence('{table.name}', 'id'),
                        COALESCE(MAX(id), 1),
                        MAX(id) IS NOT NULL
                    ) FROM {table.name};
                """)
                await conn.execute(seq_query)
        await conn.commit()

    print("\nSUCCESS: Restore completed successfully!")

if __name__ == "__main__":
    asyncio.run(restore())
