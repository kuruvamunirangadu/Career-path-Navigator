#!/usr/bin/env python3
"""Auto-complete missing detailed attributes for careers"""

import json
import os

# Load the careers file
careers_file = 'career-data/careers.json'

with open(careers_file, 'r', encoding='utf-8') as f:
    careers = json.load(f)

# Default template for missing attributes
def get_default_details(career):
    display_name = career.get('display_name', '')
    course_ids = career.get('attributes', {}).get('course_ids', [])
    courses_text = ', '.join([cid.replace('course:', '').replace('_', ' ').title() for cid in course_ids])
    
    return {
        'why_path': f"{display_name} is a professional role that typically requires specialized education and training in related fields.",
        'what_to_study': f"Relevant courses: {courses_text}" if courses_text else "See course requirements for details.",
        'roadmap': {
            'short_term': 'Complete relevant educational foundation',
            'mid_term': 'Obtain degree/certification in the field',
            'long_term': 'Professional practice, specialization, and career advancement'
        }
    }

# Update careers with missing attributes
updated_count = 0
for career in careers:
    if not career.get('why_path'):
        defaults = get_default_details(career)
        career['why_path'] = defaults['why_path']
        career['what_to_study'] = defaults['what_to_study']
        career['roadmap'] = defaults['roadmap']
        
        # Also add short_description if missing
        if not career.get('short_description'):
            career['short_description'] = f"Pursue a career as a {career.get('display_name', 'professional')} with relevant education and experience"
        
        updated_count += 1

print(f"Updated {updated_count} careers with missing detailed attributes")

# Save the updated file
with open(careers_file, 'w', encoding='utf-8') as f:
    json.dump(careers, f, indent=2, ensure_ascii=False)

print(f"Successfully saved updated careers.json")
