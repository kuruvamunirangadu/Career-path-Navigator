"""
Intent Classifier Module
Zero-hallucination design: Rule-based intent detection
"""

import re
from typing import Dict, Optional

# Fixed set of intents (closed world)
INTENTS = [
    "career_overview",
    "eligibility_check", 
    "career_steps",
    "exam_info",
    "roadmap",
    "stream_guidance",
    "course_info",
    "comparison",
    "general_guidance"
]


def normalize_query(query: str) -> str:
    """
    Normalize user query: lowercase, remove filler words
    """
    query = query.lower().strip()
    
    # Remove filler words
    filler_words = ['the', 'a', 'an', 'is', 'are', 'can', 'could', 'would', 'should', 'i', 'my']
    words = query.split()
    words = [w for w in words if w not in filler_words or w in ['i', 'can']]
    
    return ' '.join(words)


def classify_intent(query: str) -> Dict[str, any]:
    """
    Rule-based intent classification (Primary - no AI)
    Returns: {intent: str, entities: dict, confidence: float}
    """
    normalized = normalize_query(query)
    q = query.lower()
    
    # Extract entities
    entities = extract_entities(q)
    
    # Rule-based classification (DETERMINISTIC)
    
    # Eligibility checks
    if any(word in q for word in ['eligible', 'eligibility', 'qualify', 'requirement', 'without degree', 'need degree']):
        return {
            'intent': 'eligibility_check',
            'entities': entities,
            'confidence': 1.0
        }
    
    # Career steps / How to start / Want to be
    # Check if asking about becoming a specific career
    has_career_keyword = any(word in q for word in ['become', 'career', 'ca', 'engineer', 'doctor', 'lawyer', 'teacher', 'nurse', 'mbbs'])
    has_action_word = any(word in q for word in ['how', 'start', 'want', 'like', 'interested'])
    
    if has_career_keyword and has_action_word:
        return {
            'intent': 'career_steps',
            'entities': entities,
            'confidence': 1.0
        }
    
    # Also handle "I want to be X" pattern even without explicit action word
    if entities.get('career') and any(word in q for word in ['want', 'like', 'be ', 'interested in']):
        return {
            'intent': 'career_steps',
            'entities': entities,
            'confidence': 1.0
        }
    
    # Roadmap / Future planning
    if any(word in q for word in ['roadmap', 'path', 'future', 'progression', 'after']):
        return {
            'intent': 'roadmap',
            'entities': entities,
            'confidence': 0.9
        }
    
    # Stream guidance
    if any(word in q for word in ['stream', 'subject', 'class 10', 'class 12', 'pcm', 'pcb', 'commerce', 'arts']):
        return {
            'intent': 'stream_guidance',
            'entities': entities,
            'confidence': 1.0
        }
    
    # Exam information
    if any(word in q for word in ['exam', 'neet', 'jee', 'entrance', 'test', 'competitive']):
        return {
            'intent': 'exam_info',
            'entities': entities,
            'confidence': 0.9
        }
    
    # Course information
    if any(word in q for word in ['course', 'degree', 'b.tech', 'mbbs', 'b.com', 'mba']):
        return {
            'intent': 'course_info',
            'entities': entities,
            'confidence': 0.9
        }
    
    # Career overview
    if any(word in q for word in ['what is', 'tell me about', 'explain', 'overview']):
        return {
            'intent': 'career_overview',
            'entities': entities,
            'confidence': 0.8
        }
    
    # Comparison
    if any(word in q for word in ['vs', 'versus', 'compare', 'difference', 'better']):
        return {
            'intent': 'comparison',
            'entities': entities,
            'confidence': 0.9
        }
    
    # Default: General guidance
    return {
        'intent': 'general_guidance',
        'entities': entities,
        'confidence': 0.5
    }


def extract_entities(query: str) -> Dict[str, any]:
    """
    Extract key entities from query
    """
    entities = {
        'career': None,
        'stream': None,
        'class_level': None,
        'exam': None,
        'course': None
    }
    
    # Career detection - FIXED: Use word boundaries to avoid substring matches
    # Order matters: Check longer phrases first, then shorter keywords
    careers = [
        ('chartered accountant', 'chartered_accountant'),
        ('civil services', 'civil_services'),
        ('software engineer', 'software_engineer'),
        ('registered nurse', 'registered_nurse'),
        ('b.arch', 'barch_architecture'),
        ('barch', 'barch_architecture'),
        ('architect', 'barch_architecture'),
        ('architecture', 'barch_architecture'),
        ('mbbs', 'doctor'),
        ('doctor', 'doctor'),
        ('dentist', 'dentist'),
        ('bds', 'dentist'),
        ('pharmacist', 'pharmacist'),
        ('b.pharm', 'pharmacist'),
        ('bpharm', 'pharmacist'),
        ('engineer', 'software_engineer'),
        ('engineering', 'software_engineer'),
        ('lawyer', 'lawyer'),
        ('teacher', 'teacher'),
        ('ias', 'civil_services'),
        ('ca', 'chartered_accountant'),  # Put 'ca' last to avoid matching in 'accountant' or 'can'
        ('cs', 'company_secretary'),
        ('cma', 'cost_management_accountant'),
        ('nurse', 'registered_nurse')
    ]
    
    for keyword, career_id in careers:
        # Use word boundary matching to avoid false positives
        if re.search(r'\b' + re.escape(keyword) + r'\b', query):
            entities['career'] = career_id
            break
    
    # Stream detection
    streams = ['science', 'commerce', 'arts', 'pcm', 'pcb', 'mpc', 'bipc', 'pcmb']
    for stream in streams:
        if stream in query:
            entities['stream'] = stream
            break
    
    # Class level
    if 'class 10' in query or '10th' in query:
        entities['class_level'] = '10'
    elif 'class 12' in query or '12th' in query:
        entities['class_level'] = '12'
    
    # Exam detection
    exams = ['neet', 'jee', 'ca foundation', 'ca intermediate', 'upsc', 'ssc']
    for exam in exams:
        if exam in query:
            entities['exam'] = exam
            break
    
    return entities
