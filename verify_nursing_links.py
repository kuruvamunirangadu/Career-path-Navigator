#!/usr/bin/env python3
"""Verify all necessary links exist for B.Sc Nursing"""

import json
import os

BASE = 'career-data'

# Load all files
with open(os.path.join(BASE, 'courses.json')) as f:
    courses = json.load(f)

with open(os.path.join(BASE, 'careers.json')) as f:
    careers = json.load(f)

with open(os.path.join(BASE, 'mappings', 'graph_edges.json')) as f:
    edges = json.load(f)

print("="*60)
print("VERIFYING B.Sc NURSING DATA LINKAGE")
print("="*60)

# Find nursing course
nursing_course = None
for c in courses:
    if c['id'] == 'course:nursing':
        nursing_course = c
        break

if nursing_course:
    print(f"\n✅ Found Nursing Course: {nursing_course['id']}")
    print(f"   Name: {nursing_course.get('display_name')}")
else:
    print("\n❌ Nursing course not found!")
    exit(1)

# Find registered_nurse career
registered_nurse = None
for c in careers:
    if c['id'] == 'career:registered_nurse':
        registered_nurse = c
        break

if registered_nurse:
    print(f"\n✅ Found Registered Nurse Career: {registered_nurse['id']}")
    print(f"   Name: {registered_nurse.get('display_name')}")
    print(f"   Has why_path: {'why_path' in registered_nurse}")
    print(f"   Has what_to_study: {'what_to_study' in registered_nurse}")
    print(f"   Has roadmap: {'roadmap' in registered_nurse}")
else:
    print("\n❌ Registered nurse career not found!")
    exit(1)

# Check if course_to_career edge exists
course_to_career_edge = None
for e in edges:
    if e.get('from') == 'course:nursing' and e.get('type') == 'course_to_career':
        course_to_career_edge = e
        print(f"\n✅ Found course_to_career edge: {e}")
        break

if not course_to_career_edge:
    print("\n❌ course_to_career edge NOT found for nursing!")
    print("   Looking for edges from course:nursing...")
    for e in edges:
        if e.get('from') == 'course:nursing':
            print(f"   Found: {e}")
else:
    print(f"   Target career: {course_to_career_edge.get('to')}")

# Check bipc variant connection
bipc_to_nursing = None
for e in edges:
    if e.get('from') == 'variant:bipc' and e.get('to') == 'course:nursing':
        bipc_to_nursing = e
        print(f"\n✅ Found variant_to_course edge: {e}")
        break

if not bipc_to_nursing:
    print("\n❌ variant_to_course edge NOT found for bipc->nursing!")

print("\n" + "="*60)
print("SUMMARY")
print("="*60)
if nursing_course and registered_nurse and course_to_career_edge and bipc_to_nursing:
    print("✅ ALL LINKS VERIFIED - Data structure is correct!")
else:
    print("❌ MISSING LINKS - Check above for issues")
