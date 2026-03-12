#Lines 1-11 written by Emma Wikingstad

import sqlite3

DB_PATH = "CalcuraV1.db"

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
