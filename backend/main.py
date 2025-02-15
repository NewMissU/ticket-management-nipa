from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, constr
from typing import Literal

from dotenv import load_dotenv
import os

import psycopg2
import psycopg2.extras

load_dotenv()

#Database connection parameter
DB_USER = os.getenv("DB_USER") # ดึงข้อมูลจาก .env มาใช้งาน
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST", "localhost")  # ค่าเริ่มต้นคือ localhost
DB_PORT = os.getenv("DB_PORT", "5433")

print("Username : " , DB_USER)
print("Password : " , DB_PASSWORD)
print("DatabaseName : " , DB_NAME)
print("Host : " , DB_HOST)
print("Port : " , DB_PORT)

#connect to the PostgreSQL database
def get_db_connection():
    try:
        conn = psycopg2.connect(
            dbname = DB_NAME,
            user = DB_USER,
            password = DB_PASSWORD,
            host = DB_HOST,
            port = DB_PORT,
        )
        print("✅ Connected to the database successfully!") # ถ้าเชื่อมต่อสำเร็จจะแสดงข้อความนี้
        return conn
    except Exception as e:
        print("❌ Failed to connect to the database!")
        print("ERROR : ", e)
        return None

# ทดสอบการเชื่อมต่อ
# conn = get_db_connection()
# if conn:
#     conn.close() # ปิดการเชื่อมต่อหลังเชื่อมสำเร็จ

create_table_query = """
                    CREATE TABLE IF NOT EXISTS tickets (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    description TEXT NOT NULL,
                    contact_info VARCHAR(255) NOT NULL,
                    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'resolved', 'rejected')) DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    """
                    
conn = get_db_connection()
if conn: # ถ้าเชื่อมต่อสำเร็จ
    with conn.cursor() as cur: # สร้าง cursor
        cur.execute(create_table_query) # สร้างตารางถ้ายังไม่มี
    conn.commit() # ยืนยันการเปลี่ยนแปลง
    conn.close() # ปิดการเชื่อมต่อ


# * API
app = FastAPI()

#* เปิดใช้งาน CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# * pydantic model
class Ticket(BaseModel):
    title: constr(max_length=255)
    description: str
    contact_info: constr(max_length=255) 
    status: Literal['pending', 'accepted', 'resolved', 'rejected'] = 'pending'
    
# *-------------- API ----------------

@app.get('/tickets')
def get_all_tickets():
    conn = get_db_connection()
    if conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            query = "SELECT * FROM tickets ORDER BY updated_at DESC" # ค้นหาทุก ticket และเรียงลำดับตาม updated_at
            cur.execute(query)
            tickets = cur.fetchall()
        conn.close()
        
        # เช็คว่าไม่พบตั๋วใด ๆ
        if not tickets:  # ถ้า tickets เป็น list ว่าง
            raise HTTPException(status_code=404, detail="No tickets found")
        
        print("Tickets : ", tickets)
        return tickets
    # คืน HTTP 500 error ถ้าการเชื่อมต่อฐานข้อมูลไม่สำเร็จ
    raise HTTPException(status_code=500, detail="Database connection failed")

@app.get('/tickets/{status}')
def get_all_tickets_by_status(status: str):
    valid_statuses = ['pending', 'accepted', 'resolved', 'rejected']
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status value")
    conn = get_db_connection()
    if conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            query = "SELECT * FROM tickets WHERE status = %s ORDER BY updated_at DESC" # ค้นหาเฉพาะ ticket ที่มี status เป็น pending
            cur.execute(query, (status,))
            tickets = cur.fetchall()
        conn.close()
        
        # เช็คว่าไม่พบตั๋วใด ๆ
        if not tickets:  # ถ้า tickets เป็น list ว่าง
            raise HTTPException(status_code=404, detail="No tickets found")
        
        print("Tickets : ", tickets)
        return tickets
    # คืน HTTP 500 error ถ้าการเชื่อมต่อฐานข้อมูลไม่สำเร็จ
    raise HTTPException(status_code=500, detail="Database connection failed")

@app.post('/tickets')
def create_new_ticket(ticket: Ticket): # * รับข้อมูลจาก body และแปลงเป็น Ticket object (pydantic)
    if not ticket.title or not ticket.description or not ticket.contact_info:
        raise HTTPException(status_code=400, detail="Missing required fields (title, description, or contact_info)")
    conn = get_db_connection()
    if conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            query = """INSERT INTO tickets (title, description, contact_info) VALUES (%s, %s, %s) 
            RETURNING id, title, description, contact_info, status, created_at, updated_at;"""
            
            cur.execute(query, (ticket.title, ticket.description, ticket.contact_info))
            new_created_ticket = cur.fetchone()
        
        print(new_created_ticket)
        conn.commit()
        conn.close()
        return {"message": "Ticket created successfully",
                "data": new_created_ticket} # คืนข้อมูลที่สร้างเรียบร้อย 
    # คืน HTTP 500 error ถ้าการเชื่อมต่อฐานข้อมูลไม่สำเร็จ
    raise HTTPException(status_code=500, detail="Database connection failed")

@app.put('/tickets/{ticket_id}') # * รับ parameter ชื่อ ticket_id
def update_ticket(ticket_id: int, ticket: Ticket): # * รับข้อมูลจาก body และแปลงเป็น Ticket object (pydantic)
    if not ticket.title or not ticket.description or not ticket.contact_info:
        raise HTTPException(status_code=400, detail="Missing required fields (title, description, or contact_info)")
    if ticket.status not in ['pending','accepted', 'resolved', 'rejected']:
        raise HTTPException(status_code=400, detail="Invalid status value")
    conn = get_db_connection()
    if conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            
            query = "SELECT * FROM tickets WHERE id = %s"
            
            cur.execute(query, (ticket_id,))
            existing_ticket = cur.fetchone()
            
            if not existing_ticket:
                raise HTTPException(status_code=404, detail="No tickets found")
            
            query = """
                UPDATE tickets 
                SET title = %s, description = %s, contact_info = %s, status = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, title, description, contact_info, status, created_at, updated_at;
            """
            cur.execute(query, (ticket.title, ticket.description, ticket.contact_info, ticket.status, ticket_id))
            updated_ticket = cur.fetchone()

        conn.commit()
        conn.close()
        print(updated_ticket)
        return {"message": "Ticket status updated successfully",
                "data": updated_ticket} # คืนข้อมูลที่อัพเดทเรียบร้อย
    raise HTTPException(status_code=500, detail="Database connection failed")


    


    
    


