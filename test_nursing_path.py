#!/usr/bin/env python3
import requests
import json

API_BASE = "http://127.0.0.1:8000"

# Test paths for bipc variant (which includes nursing)
print("Testing /paths?variant=bipc...")
r = requests.get(f"{API_BASE}/paths?variant=bipc")
print(f"Status: {r.status_code}")
data = r.json()

paths = data.get('paths', [])
print(f"\nFound {len(paths)} paths\n")

# Find nursing course
for p in paths:
    course = p.get('course', {})
    if 'nursing' in course.get('id', '').lower() or 'nursing' in course.get('display_name', '').lower():
        print(f"Course: {course.get('id')} - {course.get('display_name')}")
        careers = p.get('careers', [])
        print(f"Careers count: {len(careers)}")
        for c in careers:
            print(f"  - {c.get('id')}: {c.get('display_name')}")
            if not c.get('why_path'):
                print(f"    ⚠️  Missing why_path!")
        print()
