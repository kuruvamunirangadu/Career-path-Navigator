#!/usr/bin/env python3
import requests
import json

API_BASE = "http://127.0.0.1:8000"

# Test explain endpoint for registered_nurse
print("Testing /ai/explain?career=career:registered_nurse...")
r = requests.get(f"{API_BASE}/ai/explain?career=career:registered_nurse")
print(f"Status: {r.status_code}\n")
data = r.json()
print(json.dumps(data, indent=2))
