# 🎯 Career Path Explorer

A comprehensive career guidance platform that helps students discover their ideal career paths based on their interests, skills, and educational background. Built with modern web technologies and powered by intelligent ranking algorithms.

## ✨ Key Features

### 🎓 Smart Onboarding
- **AI-Powered Recommendations**: Get personalized career suggestions based on your interests
- **Interest-Based Filtering**: Select 2-4 interests to see relevant careers ranked by match score
- **Organized Results**: View careers in tabs (Best Matches, Good Matches, Others)
- **Animated UI**: Smooth transitions and engaging interactions throughout

### 🗺️ Interactive Career Explorer
- **Visual Career Map**: Explore all careers, courses, and educational streams
- **Multiple Stream Types**: Science, Commerce, Arts, Vocational/Skill-based
- **Stream Variants**: PCM, PCB, PCMB for Science; HEC, HPC, etc. for Commerce
- **Dual Views**: Switch between interactive chart and card layouts

### 📊 Career Intelligence
- **Why Path**: Understand why a career suits your profile
- **What to Study**: Complete curriculum and subject requirements
- **Roadmap**: Career progression (Short-term → Mid-term → Entry → Growth)
- **Skill Matching**: AI-generated insights based on career data
- **Course Connections**: Clear links between courses and career outcomes

### 🎨 Modern User Experience
- **Smooth Animations**: Fade, slide, pulse, scale, and stagger effects
- **Interactive Elements**: Hover effects, icons, and visual feedback
- **Icons Everywhere**: Visual indicators for all interests and actions
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Theme**: Eye-friendly interface with cyan/purple gradient accents

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16 or higher
- **Python** 3.8 or higher
- **npm** or yarn

### One-Click Start (Windows)
```bash
start-all.bat
```

This automatically:
- Installs backend dependencies
- Starts FastAPI server on `http://127.0.0.1:8000`
- Installs frontend dependencies
- Starts Vite dev server on `http://localhost:5173`

### Manual Setup

**Backend Setup:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

**Frontend Setup (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
carrer/
├── backend/                    # FastAPI backend
│   ├── main.py                # Main API server & routes
│   ├── data_loader.py         # Career data loading
│   ├── requirements.txt        # Python dependencies
│   └── README.md              # Backend documentation
│
├── frontend/                   # React + Vite frontend
│   ├── src/pages/             # Page components
│   ├── src/components/        # Reusable components
│   ├── src/index.css          # Animations & keyframes
│   ├── package.json           # Node dependencies
│   └── README.md              # Frontend documentation
│
├── career-data/               # Career database (JSON)
│   ├── careers.json           # Career definitions
│   ├── courses.json           # Course information
│   ├── streams.json           # Stream definitions
│   ├── mappings/              # Graph edges
│   └── more data files...
│
└── README.md                  # This file
```

## 🔌 API Endpoints

### Streams API
```
GET /streams?class=10
```

### Variants API
```
GET /variants?stream=stream:science
```

### Paths API
```
GET /paths?variant=variant:bipc
```

### AI Ranking API
```
POST /ai/rank
```

### AI Explanation API
```
GET /ai/explain?career=career:software_engineer
```

## 📈 Recent Improvements

✅ **Smart Career Ranking**
- Deduplicates careers (no duplicates)
- Filters low-relevance results
- Limits to top 15 matches
- Contextual match reasons

✅ **Enhanced UI/UX**
- Icon-based interest selection with checkmarks
- Filter tabs for organized results
- 2-column responsive grid layout
- Smooth page transitions

✅ **Data Quality**
- Separate ANM and GNM nursing careers
- Complete career roadmaps (4-phase)
- Skill-based matching
- Comprehensive curriculum details

✅ **Animation System**
- 8+ CSS keyframe animations
- Interactive hover effects
- Staggered entry animations
- Smooth transitions throughout

## 🧪 Testing

### Verify API Endpoints
```bash
curl "http://127.0.0.1:8000/paths?variant=variant:bipc"
```

### Test Career Data
```bash
python verify_nursing_links.py
python test_nursing_path.py
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test
3. Commit with clear messages
4. Push and create a pull request

## 📞 Support

- Review API documentation in backend/README.md
- Check frontend/README.md for UI components
- Test endpoints with test_api_direct.html

## 📄 License

Open source - MIT License

## 🎯 Roadmap

- [ ] OpenAI GPT-4 integration
- [ ] User profiles and saved preferences
- [ ] Career comparison tool
- [ ] Interview preparation guides
- [ ] Mobile app (React Native)
- [ ] Multilingual support

---

**Last Updated**: January 15, 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
