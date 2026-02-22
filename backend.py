from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import platform
import psutil
import datetime

app = FastAPI(title="ZDB API Example Backend")

# Enable CORS for the local HTML frontend testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/zdb_v1/status")
async def get_status():
    return {
        "status": "online",
        "version": "v6.0.0-beta",
        "environment": "ZDB Wrapper TUI",
        "system": platform.system(),
        "uptime_seconds": 3600,
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.get("/api/zdb_v1/devices")
async def get_devices():
    return {
        "devices": [
            {"serial": "emulator-5554", "state": "device", "model": "SDK gphone64", "connection": "USB"},
            {"serial": "192.168.1.104:5555", "state": "device", "model": "Pixel 7 Pro", "connection": "Wireless"},
            {"serial": "HT89R1A00512", "state": "fastboot", "model": "Unknown", "connection": "USB"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8080)
