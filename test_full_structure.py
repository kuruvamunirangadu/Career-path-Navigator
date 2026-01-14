#!/usr/bin/env python3
"""Comprehensive test script to verify the entire Career App structure"""

import requests
import json
from typing import Dict, List, Any

BASE_URL = "http://127.0.0.1:8000"

def print_section(title):
    print(f"\n{'='*60}")
    print(f"  {title}")
    print('='*60)

def test_streams():
    print_section("TEST: Get Streams for Class 10")
    try:
        r = requests.get(f"{BASE_URL}/streams?class=10")
        data = r.json()
        print(f"Status: {r.status_code}")
        streams = data.get('streams', [])
        print(f"Found {len(streams)} streams:")
        for s in streams:
            print(f"  - {s.get('id')}: {s.get('display_name')}")
        return streams
    except Exception as e:
        print(f"ERROR: {e}")
        return []

def test_variants_for_stream(stream_id: str):
    print_section(f"TEST: Get Variants for {stream_id}")
    try:
        r = requests.get(f"{BASE_URL}/variants?stream={stream_id}")
        data = r.json()
        print(f"Status: {r.status_code}")
        variants = data.get('variants', [])
        print(f"Found {len(variants)} variants:")
        for v in variants:
            print(f"  - {v.get('id')}: {v.get('display_name')}")
        return variants
    except Exception as e:
        print(f"ERROR: {e}")
        return []

def test_paths_for_variant(variant_id: str):
    print_section(f"TEST: Get Paths for {variant_id}")
    try:
        r = requests.get(f"{BASE_URL}/paths?variant={variant_id}")
        data = r.json()
        print(f"Status: {r.status_code}")
        paths = data.get('paths', [])
        print(f"Found {len(paths)} paths (course -> careers):")
        for p in paths:
            course = p.get('course', {})
            careers = p.get('careers', [])
            print(f"\n  Course: {course.get('id')} - {course.get('display_name')}")
            print(f"    Careers ({len(careers)}):")
            for c in careers:
                print(f"      - {c.get('id')}: {c.get('display_name')}")
        return paths
    except Exception as e:
        print(f"ERROR: {e}")
        return []

def test_explain_career(career_id: str):
    print_section(f"TEST: Explain Career {career_id}")
    try:
        r = requests.get(f"{BASE_URL}/ai/explain?career={career_id}")
        data = r.json()
        print(f"Status: {r.status_code}")
        if 'error' in data:
            print(f"ERROR in response: {data['error']}")
            return False
        print(f"Career ID: {data.get('career_id')}")
        print(f"Why Path: {data.get('why')}")
        print(f"What to Study: {data.get('what_to_study')}")
        print(f"Skills: {data.get('skills')}")
        print(f"Roadmap: {json.dumps(data.get('roadmap'), indent=2)}")
        return True
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_stream_detail(stream_id: str):
    print_section(f"TEST: Get Stream Detail {stream_id}")
    try:
        clean_id = stream_id.replace('stream:', '')
        r = requests.get(f"{BASE_URL}/stream/{clean_id}")
        data = r.json()
        print(f"Status: {r.status_code}")
        stream = data.get('stream', {})
        print(f"ID: {stream.get('id')}")
        print(f"Name: {stream.get('display_name')}")
        print(f"Description: {stream.get('short_description')}")
        print(f"Attributes: {json.dumps(stream.get('attributes'), indent=2)}")
        return True
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def main():
    print("\n" + "="*60)
    print("  CAREER APP COMPREHENSIVE STRUCTURE TEST")
    print("="*60)
    
    # Test 1: Get all streams
    streams = test_streams()
    if not streams:
        print("FAILED: No streams found!")
        return
    
    # Test 2: For each stream, get variants
    all_variants = []
    for stream in streams[:2]:  # Test first 2 streams
        variants = test_variants_for_stream(stream.get('id'))
        all_variants.extend(variants)
    
    # Test 3: For selected variants, get paths
    test_variants = ['bipc', 'mpc', 'hec']
    for var in test_variants:
        paths = test_paths_for_variant(var)
        
        # Test 4: For each path, test explain endpoint
        if paths:
            for path in paths[:1]:  # Test first path
                careers = path.get('careers', [])
                if careers:
                    career_id = careers[0].get('id')
                    test_explain_career(career_id)
    
    # Test 5: Test stream detail endpoint
    for stream in streams[:2]:
        test_stream_detail(stream.get('id'))
    
    print_section("TEST SUMMARY")
    print("✅ All critical tests completed")
    print("Check the output above for any ERROR messages")

if __name__ == '__main__':
    main()
