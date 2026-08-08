import socket
try:
    s = socket.create_connection(("aws-1-ap-southeast-2.pooler.supabase.com", 6543), timeout=5)
    print("Port is open!")
    s.close()
except Exception as e:
    print(f"Failed to connect: {e}")
