from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2

app = FastAPI()

# Allow the frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PostgreSQL connection
conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="landslide_db",
    user="postgres",
    password="Hari@2007"
)


# Home
@app.get("/")
def home():
    return {
        "message": "Landslide Monitoring System Backend is running"
    }


# Locations
@app.get("/locations")
def get_locations():

    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            location_id,
            location_name,
            district,
            state,
            latitude,
            longitude,
            elevation
        FROM locations
        ORDER BY location_id;
    """)

    rows = cursor.fetchall()

    cursor.close()

    return {
        "locations": rows
    }


# Dashboard
@app.get("/dashboard")
def dashboard():

    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM locations;")
    location_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM landslide_history;")
    landslide_count = cursor.fetchone()[0]

    cursor.execute(
        "SELECT COUNT(*) FROM alerts WHERE is_active = TRUE;"
    )
    active_alerts = cursor.fetchone()[0]

    cursor.close()

    return {
        "locations": location_count,
        "historical_landslides": landslide_count,
        "active_alerts": active_alerts
    }


# Rainfall
@app.get("/rainfall")
def get_rainfall():

    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            rainfall_id,
            location_id,
            recorded_at,
            rainfall_mm,
            rainfall_24h_mm,
            rainfall_7day_mm
        FROM rainfall_data
        ORDER BY recorded_at DESC;
    """)

    rows = cursor.fetchall()

    cursor.close()

    return {
        "rainfall": rows
    }


# Alerts
@app.get("/alerts")
def get_alerts():

    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            alert_id,
            location_id,
            prediction_id,
            alert_level,
            alert_message,
            created_at,
            is_active
        FROM alerts
        ORDER BY created_at DESC;
    """)

    rows = cursor.fetchall()

    cursor.close()

    return {
        "alerts": rows
    }
@app.get("/soil-moisture")
def get_soil_moisture():

    cursor = conn.cursor()

    cursor.execute("""
        SELECT
            soil_moisture_id,
            location_id,
            recorded_at,
            moisture_percent,
            soil_temperature,
            soil_type
        FROM soil_moisture_data
        ORDER BY recorded_at DESC;
    """)

    rows = cursor.fetchall()

    cursor.close()

    return {
        "soil_moisture": rows
    }