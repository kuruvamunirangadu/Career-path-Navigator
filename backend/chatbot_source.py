"""
Answer Source Module
SAFE data retrieval - App data is the ONLY source of truth
"""

import os
import json
from typing import Dict, Optional, List
from data_loader_versioned import load_career, load_stream, load_exam
from config import CAREERS_DIR, STREAMS_DIR, EXAMS_DIR


class AnswerSource:
    """
    Fetch answers from verified sources ONLY (uses versioned data)
    
    SAFETY RULE: Never invent data
    """
    
    def __init__(self, loader=None):
        # Loader parameter kept for backward compatibility but not used
        # Now uses versioned data directly
        pass
    
    def fetch_career_data(self, career_id: str) -> Optional[Dict]:
        """
        Fetch verified career data from versioned JSON
        """
        # Try loading from versioned data
        career_data = load_career(career_id)
        
        if career_data:
            return career_data
        
        # Try with career: prefix
        if not career_id.startswith('career:'):
            career_data = load_career(f'career:{career_id}')
        
        return career_data
    
    def fetch_stream_data(self, class_level: str) -> List[Dict]:
        """
        Fetch stream data for a class level
        """
        return self.loader.get_streams_for_class(class_level)
    
    def fetch_exam_data(self, exam_name: str) -> Optional[Dict]:
        """
        Fetch exam information
        """
        # Search in nodes for exam
        for node_id, node in self.loader.nodes.items():
            if node.get('type') == 'exam':
                display_name = node.get('display_name', '').lower()
                if exam_name.lower() in display_name or exam_name.lower() in node_id.lower():
                    return node
        return None
    
    def fetch_paths_for_career(self, career_id: str) -> Dict:
        """
        Get all paths leading to a career
        """
        paths = []
        
        # Search edges for paths to this career
        for edge in self.loader.edges:
            if edge.get('target') == career_id or edge.get('target') == f'career:{career_id}':
                source_id = edge.get('source')
                source_node = self.loader.nodes.get(source_id)
                if source_node:
                    paths.append({
                        'from': source_node.get('display_name', source_id),
                        'type': source_node.get('type'),
                        'id': source_id
                    })
        
        return {'paths': paths}
    
    def get_career_eligibility(self, career_id: str) -> Dict:
        """
        Get eligibility requirements for a career
        
        STRICT: Only return what exists in data
        """
        career = self.fetch_career_data(career_id)
        
        if not career:
            return {'available': False}
        
        attrs = career.get('attributes', {})
        
        return {
            'available': True,
            'career_name': career.get('display_name', career_id),
            'minimum_education': attrs.get('minimum_education', 'Not specified'),
            'mandatory_subjects': attrs.get('mandatory_subjects', []),
            'degree_required': attrs.get('degree_required', True),
            'entrance_exams': attrs.get('entrance_exams', []),
            'foundation_in_12': attrs.get('foundation_allowed_in_12', False)
        }
    
    def get_career_steps(self, career_id: str) -> Dict:
        """
        Get step-by-step path to career
        
        CRITICAL: Only verified steps from JSON
        """
        career = self.fetch_career_data(career_id)
        
        if not career:
            return {'available': False}
        
        # Build steps from versioned career data
        steps = []
        
        # Add entry paths as steps
        entry_paths = career.get('entry_paths', [])
        if entry_paths:
            steps.append(f"Complete {', '.join(entry_paths)} course")
        
        # Add exam requirements
        exams_required = career.get('exams_required', [])
        if exams_required:
            steps.append(f"Clear entrance exams: {', '.join(exams_required).upper()}")
        
        # Add stream/variant info
        stream = career.get('stream')
        variant = career.get('variant')
        if stream and variant:
            steps.insert(0, f"Choose {stream.capitalize()} stream with {variant.upper()} variant in Class 12")
        
        # Add salary progression as career growth info
        salary_band = career.get('salary_band', {})
        
        return {
            'available': True,
            'career_name': career.get('display_name', career_id),
            'steps': steps,
            'salary_band': salary_band,
            'failure_safe_paths': career.get('failure_safe_paths', []),
            'exams_required': exams_required,
            'stream': stream,
            'variant': variant
        }
    
    def get_career_roadmap(self, career_id: str) -> Dict:
        """
        Get career progression roadmap
        """
        career = self.fetch_career_data(career_id)
        
        if not career:
            return {'available': False}
        
        roadmap = career.get('roadmap', {})
        
        return {
            'available': bool(roadmap),
            'career_name': career.get('display_name', career_id),
            'short_term': roadmap.get('short_term', 'Data not available'),
            'mid_term': roadmap.get('mid_term', 'Data not available'),
            'long_term': roadmap.get('long_term', 'Data not available'),
            'entry_point': roadmap.get('entry', 'Data not available')
        }
    
    def get_stream_guidance(self, class_level: str) -> Dict:
        """
        Get stream options for a class
        """
        streams = self.fetch_stream_data(class_level)
        
        if not streams:
            return {'available': False}
        
        stream_list = []
        for stream in streams[:6]:  # Limit to 6
            stream_list.append({
                'name': stream.get('display_name', stream.get('id')),
                'id': stream.get('id'),
                'description': stream.get('description', 'Explore this stream for various career paths')
            })
        
        return {
            'available': True,
            'class_level': class_level,
            'streams': stream_list
        }
