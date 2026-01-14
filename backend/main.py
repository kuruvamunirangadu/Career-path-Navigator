from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
import json
from typing import Optional
from data_loader import CareerData

app = FastAPI(title='Career Path API')
loader = CareerData()  # Create a fresh instance and load all data - Updated with complete career details

# Allow local frontend during development
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.get('/streams')
def get_streams(class_param: Optional[str] = Query('10', alias='class')):
    """Return streams available for a class (e.g., ?class=10)."""
    streams = loader.get_streams_for_class(class_param)
    if not streams:
        raise HTTPException(status_code=404, detail='No streams found for the specified class')
    return {'class': class_param, 'streams': streams}

@app.get('/paths')
def get_paths(variant: str = Query(...)):
    """Return valid paths (courses -> careers) for a given stream variant (e.g., ?variant=mpc)."""
    res = loader.get_paths_for_variant(variant)
    if not res['paths']:
        raise HTTPException(status_code=404, detail='No paths found for the specified variant')
    return res


@app.get('/variants')
def get_variants(stream: str = Query(...)):
    """Return stream variants for a given stream id (e.g., ?stream=science or ?stream=stream:science)."""
    variants = loader.get_variants_for_stream(stream)
    if not variants:
        raise HTTPException(status_code=404, detail='No variants found for the specified stream')
    return {'stream': stream, 'variants': variants}


@app.get('/stream/{streamId}')
def get_stream(streamId: str):
    """Return detailed information for a specific stream."""
    # normalize id
    stream_id = streamId if ':' in streamId else f'stream:{streamId}'
    node = loader.nodes.get(stream_id)
    if not node:
        raise HTTPException(status_code=404, detail='Stream not found')
    return {'stream': node}


@app.get('/ai/explain')
def ai_explain(career: str = Query(...)):
    """Return a safe, template-based explanation for a career id (e.g., ?career=software_engineer).

    This is a placeholder for AI; it uses the career node attributes to build an explanation.
    """
    # normalize id
    career_id = career if ':' in career else f'career:{career}'
    node = loader.nodes.get(career_id)
    if not node:
        raise HTTPException(status_code=404, detail='Career not found')

    attrs = node.get('attributes', {})
    skills = node.get('skills', [])
    
    # Use custom attributes if available, otherwise generate from templates
    why = node.get('why_path') or f"This career ({node.get('display_name')}) typically follows the courses: {', '.join(attrs.get('course_ids', [])) or 'relevant degrees and certifications'}."
    what_to_study = node.get('what_to_study') or ('Subjects and courses: ' + (', '.join(attrs.get('mandatory_subjects', attrs.get('course_ids', []))) or 'See course requirements'))
    
    # Use roadmap from node if available
    if node.get('roadmap'):
        roadmap = node.get('roadmap')
    else:
        roadmap = {
            'short_term': 'Choose the correct stream/variant; focus on required subjects and basics.',
            'mid_term': 'Complete relevant degree or prepare for entrance exams as needed.',
            'long_term': 'Gain experience, specialize, and pursue higher studies or leadership roles.'
        }
    
    skills_list = skills

    return {
        'career_id': career_id,
        'why': why,
        'what_to_study': what_to_study,
        'skills': skills_list,
        'roadmap': roadmap,
        'note': 'This explanation is generated from structured data and templates; it is not a human expert opinion.'
    }


@app.get('/graph')
def get_graph():
    """Return nodes and edges for the career graph. Nodes are the loaded node objects; edges are the mappings.

    The response includes `nodes` (dict of id -> node) and `edges` (list).
    """
    return {'nodes': loader.nodes, 'edges': loader.edges}


class RankRequest(BaseModel):
    user_profile: dict
    valid_paths: list


@app.post('/ai/rank')
def ai_rank(req: RankRequest):
    """Rank provided valid_paths for the given user_profile.

    If OPENAI_API_KEY is set in environment, attempt a controlled AI call.
    Otherwise, use a deterministic heuristic.
    """
    user = req.user_profile
    paths = req.valid_paths

    # Extract candidate careers from paths
    candidates = []
    for p in paths:
        # p expected as {course: {...}, careers: [{...}]}
        course = p.get('course', {})
        for c in p.get('careers', []):
            candidates.append({
                'career_id': c.get('id'),
                'career_name': c.get('display_name'),
                'course_id': course.get('id'),
                'course_name': course.get('display_name'),
                'skills': c.get('skills', [])
            })

    # If OPENAI_API_KEY present, call OpenAI Chat Completions with strict instructions
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
    if OPENAI_API_KEY:
        system = (
            "You are a safe career guidance assistant. You MUST only evaluate and rank the provided candidate list. "
            "Do NOT suggest or invent candidates outside the provided list. Reply with JSON only, no extra text."
        )
        options_text = json.dumps(candidates, ensure_ascii=False)
        user_text = (
            "User profile: " + json.dumps(user) + "\n\n"
            + "Candidates: " + options_text + "\n\n"
            + "Task: Rank the candidates by fit to the user profile and provide a short reason for each. "
            + "Return JSON only in the following schema: {\"ranked\": [{\"career_id\": \"...\", \"career_name\": \"...\", \"score\": 0.0, \"reason\": \"...\"}]}"
        )
        payload = {
            'model': 'gpt-4o-mini',
            'messages': [
                {'role': 'system', 'content': system},
                {'role': 'user', 'content': user_text}
            ],
            'temperature': 0.0,
            'max_tokens': 512
        }
        try:
            resp = requests.post('https://api.openai.com/v1/chat/completions', json=payload,
                                 headers={'Authorization': f'Bearer {OPENAI_API_KEY}'}, timeout=15)
            resp.raise_for_status()
            body = resp.json()
            content = body['choices'][0]['message']['content']
            # Extract JSON substring robustly
            import re
            m = re.search(r"\{[\s\S]*\}", content)
            if m:
                parsed = json.loads(m.group(0))
                # basic validation of parsed structure
                if isinstance(parsed, dict) and 'ranked' in parsed:
                    return parsed
        except Exception as e:
            # Log and fall back to deterministic heuristic
            print('AI call failed or returned invalid JSON:', e)

    # Heuristic fallback ranking
    interests = set((user.get('interests') or []))
    
    # Deduplicate candidates by career_id
    seen = {}
    for c in candidates:
        career_id = c['career_id']
        if career_id not in seen:
            seen[career_id] = c
    
    ranked = []
    for c in seen.values():
        score = 0
        name = (c.get('career_name') or '').lower()
        for it in interests:
            if it.lower() in name:
                score += 3
        # skills match
        for s in c.get('skills', []):
            for it in interests:
                if it.lower() in s.lower():
                    score += 2
        
        # Only include careers with score > 0 or top general careers
        if score > 0:
            ranked.append({
                'career_id': c['career_id'], 
                'career_name': c['career_name'], 
                'score': score, 
                'reason': f"Matches your interests in {', '.join(interests)}"
            })
    
    # If no matches, add top 5 general careers
    if len(ranked) == 0:
        for c in list(seen.values())[:5]:
            ranked.append({
                'career_id': c['career_id'], 
                'career_name': c['career_name'], 
                'score': 0, 
                'reason': "General career path available to you"
            })
    
    ranked.sort(key=lambda x: -x['score'])
    # Limit to top 15 results
    ranked = ranked[:15]
    return {'ranked': ranked}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='127.0.0.1', port=8000, reload=True)
# force reload 
