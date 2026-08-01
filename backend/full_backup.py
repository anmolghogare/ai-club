"""
full_backup.py
--------------
Backs up EVERY table in the PostgreSQL database — including any legacy tables
that are not registered as SQLAlchemy ORM models.

Outputs: db_full_backup.json
"""

import os
import asyncio
import json
import datetime
from sqlalchemy import text
from db import engine

async def full_backup():
    backup_data = {}
    
    async with engine.connect() as conn:
        # 1. Discover ALL user tables in the public schema
        result = await conn.execute(text("""
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename;
        """))
        all_tables = [row[0] for row in result.fetchall()]
        
        print(f"Found {len(all_tables)} tables in the database:")
        for t in all_tables:
            print(f"  - {t}")
        
        print()
        
        # 2. Backup each table using raw SQL
        for table_name in all_tables:
            print(f"Backing up '{table_name}'...", end=" ")
            result = await conn.execute(text(f'SELECT * FROM "{table_name}"'))
            columns = list(result.keys())
            rows = result.fetchall()
            
            table_rows = []
            for row in rows:
                row_dict = {}
                for col, val in zip(columns, row):
                    # Serialize non-JSON-serializable types
                    if isinstance(val, (datetime.datetime, datetime.date, datetime.time)):
                        val = val.isoformat()
                    elif val is not None and not isinstance(val, (str, int, float, bool)):
                        val = str(val)
                    row_dict[col] = val
                table_rows.append(row_dict)
            
            backup_data[table_name] = table_rows
            print(f"{len(table_rows)} rows")
    
    # Write backup
    backup_file = "db_full_backup.json"
    with open(backup_file, "w", encoding="utf-8") as f:
        json.dump(backup_data, f, indent=2, default=str)
    
    print(f"\n✅ SUCCESS: Full backup written to {backup_file}")
    
    # Print summary
    print("\n--- BACKUP SUMMARY ---")
    total_rows = 0
    for table_name, rows in backup_data.items():
        print(f"  {table_name}: {len(rows)} rows")
        total_rows += len(rows)
    print(f"\nTotal: {len(backup_data)} tables, {total_rows} rows")

if __name__ == "__main__":
    asyncio.run(full_backup())
