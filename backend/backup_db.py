import os
import asyncio
import json
import datetime
from sqlalchemy import select
from db import Base, engine

# Import all models to ensure they register on Base
from auth.models import User
from events.models import ClubEvent
from forms.models import FormTemplate, FormField
from registrations.models import EventRegistration, RegistrationResponse, Team, TeamMember, UploadedFile
from members.models import ClubMember, ClubProject

async def backup():
    backup_data = {}
    
    # Base.metadata.sorted_tables lists tables in dependency order.
    print("Discovered tables in dependency order:")
    for table in Base.metadata.sorted_tables:
        print(f" - {table.name}")
        
    async with engine.connect() as conn:
        for table in Base.metadata.sorted_tables:
            print(f"Backing up table '{table.name}'...")
            stmt = select(table)
            result = await conn.execute(stmt)
            rows = result.mappings().all()
            
            table_rows = []
            for row in rows:
                # Convert RowMapping to a standard dictionary
                row_dict = dict(row)
                table_rows.append(row_dict)
                
            backup_data[table.name] = table_rows
            print(f"Backed up {len(table_rows)} rows from '{table.name}'.")
            
    # Custom serializer to handle date, time, and datetime objects
    def custom_serializer(obj):
        if isinstance(obj, (datetime.datetime, datetime.date, datetime.time)):
            return obj.isoformat()
        raise TypeError(f"Type {type(obj)} is not JSON serializable")
        
    backup_file = "db_backup.json"
    with open(backup_file, "w", encoding="utf-8") as f:
        json.dump(backup_data, f, default=custom_serializer, indent=2)
        
    print(f"\nSUCCESS: Backup successfully written to {backup_file}")

if __name__ == "__main__":
    asyncio.run(backup())
