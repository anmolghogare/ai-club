import os
import json
import asyncio
from sqlalchemy import text, insert
from db import engine, Base
from datetime import datetime, date, time

import events.models
import auth.models
import forms.models
import registrations.models
import members.models

BACKUP_FILE = "db_full_backup.json"

def try_parse(val):
    if not isinstance(val, str):
        return val
    
    # Try datetime with timezone
    try:
        return datetime.fromisoformat(val.replace("Z", "+00:00"))
    except ValueError:
        pass
        
    # Try date
    try:
        return date.fromisoformat(val)
    except ValueError:
        pass
        
    # Try time
    try:
        v = val
        if len(v) == 5:
            v += ":00"
        return time.fromisoformat(v)
    except ValueError:
        pass
        
    return val

async def restore_full():
    if not os.path.exists(BACKUP_FILE):
        print(f"Backup file {BACKUP_FILE} not found!")
        return
    with open(BACKUP_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            await conn.execute(table.delete())

        for table in Base.metadata.sorted_tables:
            rows = data.get(table.name, [])
            if not rows:
                continue
            
            for row in rows:
                for key in row:
                    row[key] = try_parse(row[key])
                        
            await conn.execute(insert(table), rows)

        for table in Base.metadata.sorted_tables:
            if "id" in [c.name for c in table.columns]:
                seq_sql = text(f"SELECT setval(pg_get_serial_sequence('{table.name}', 'id'), COALESCE(MAX(id),1), MAX(id) IS NOT NULL) FROM \"{table.name}\"")
                await conn.execute(seq_sql)

    print("Full restore completed successfully!")

if __name__ == "__main__":
    asyncio.run(restore_full())
