import React, { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserProgress, saveInterests, saveBoard, saveUserProgress } from '../utils/userProgress'
import { API_BASE } from '../utils/apiConfig'

const BOARDS = ['CBSE','ICSE','STATE']
const INTERESTS = [
  { name: 'Technology', icon: '💻' },
  { name: 'Biology', icon: '🧬' },
  { name: 'Business', icon: '💼' },
  { name: 'Creativity', icon: '🎨' },
  { name: 'Defense', icon: '🛡️' },
  { name: 'Science', icon: '🔬' },
  { name: 'Arts', icon: '🎭' },
  { name: 'Leadership', icon: '👔' },
  { name: 'Research', icon: '📚' }
]

export default function Onboarding(){
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [board, setBoard] = useState(BOARDS[0])
  const [interests, setInterests] = useState(['Technology'])
  const [loading, setLoading] = useState(false)
  const [ranked, setRanked] = useState(null)
  const [error, setError] = useState('')
  const [filterScore, setFilterScore] = useState('all') // all, high, medium, any
  const [isAnimating, setIsAnimating] = useState(false)

  // Test API connection on mount and load saved progress
  useEffect(() => {
    console.log('API_BASE is:', API_BASE)
    
    // Load saved progress
    const savedProgress = getUserProgress()
    if (savedProgress.board) {
      setBoard(savedProgress.board)
    }
    if (savedProgress.interests && savedProgress.interests.length > 0) {
      setInterests(savedProgress.interests.map(name => 
        INTERESTS.find(i => i.name === name) || name
      ))
    }
    
    fetch(`${API_BASE}/streams?class=10`)
      .then(r => {
        console.log('API connection test:', r.ok ? 'SUCCESS' : 'FAILED', r.status)
        return r.json()
      })
      .then(data => console.log('Streams available:', data))
      .catch(err => console.error('API connection error:', err))
  }, [])

  const userProfile = useMemo(()=>({
    current_level: 'class_10',
    board,
    interests: interests.map(i => typeof i === 'string' ? i : i.name),
  }),[board, interests])

  function toggleInterest(interestObj){
    const name = typeof interestObj === 'string' ? interestObj : interestObj.name
    setInterests(prev => {
      const prevNames = prev.map(p => typeof p === 'string' ? p : p.name)
      let updated
      if (prevNames.includes(name)) {
        updated = prev.filter(x => (typeof x === 'string' ? x : x.name) !== name)
      } else {
        const fullObj = INTERESTS.find(i => i.name === name)
        updated = [...prev, fullObj || name]
      }
      // Auto-save interests after change
      saveInterests(updated)
      return updated
    })
  }

  function goToStep(newStep) {
    setIsAnimating(true)
    setTimeout(() => {
      setStep(newStep)
      setIsAnimating(false)
    }, 300)
  }

  async function fetchAllPaths(){
    try {
      console.log('Fetching paths from API_BASE:', API_BASE)
      const variants = ['variant:mpc','variant:bipc','variant:mec','variant:hec','variant:hpc','variant:cec','variant:pcmb','variant:hsp','variant:heg','variant:creative_service_skills','variant:technical_skills']
      console.log('Trying variants:', variants)
      
      const results = await Promise.all(variants.map(async v => {
        try {
          const url = `${API_BASE}/paths?variant=${v}`
          console.log('Fetching:', url)
          const r = await fetch(url)
          console.log(`Response for ${v}:`, r.status, r.ok)
          if(!r.ok) {
            const errorText = await r.text()
            console.error(`Error response for ${v}:`, errorText)
            return {paths: []}
          }
          const data = await r.json()
          console.log(`Paths for ${v}:`, data.paths?.length || 0)
          return data
        } catch(err) {
          console.error(`Error fetching paths for variant ${v}:`, err)
          return {paths: []}
        }
      }))
      
      // Flatten paths arrays
      const valid_paths = results.flatMap(r => r.paths || [])
      console.log('Total valid paths collected:', valid_paths.length)
      if(valid_paths.length > 0) {
        console.log('Sample path:', valid_paths[0])
      }
      return valid_paths
    } catch(err){
      console.error('fetchAllPaths error:', err)
      return []
    }
  }

  async function submit(){
    setError('')
    setLoading(true)
    setRanked(null)
    try{
      // Save user selections to progress
      saveBoard(board)
      saveInterests(interests)
      
      const valid_paths = await fetchAllPaths()
      if(!valid_paths || valid_paths.length === 0){
        setError('No career paths available. Please try again.')
        setLoading(false)
        return
      }
      console.log('Submitting with user_profile:', userProfile)
      console.log('And valid_paths:', valid_paths)
      const resp = await fetch(`${API_BASE}/ai/rank`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ user_profile: userProfile, valid_paths })
      })
      if(!resp.ok) {
        const errText = await resp.text()
        throw new Error(`Ranking failed: ${resp.status} ${errText}`)
      }
      const data = await resp.json()
      console.log('Ranked response:', data)
      setRanked(data.ranked || data)
      setStep(4)
    }catch(e){
      console.error('Submit error:', e)
      setError(`Error: ${e.message || 'Something went wrong while fetching ranked paths.'}`)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Navigation */}
      <div style={{display: 'flex', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)'}}>
        <button onClick={()=>nav('/')} style={{padding: '8px 16px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '6px'}}
          onMouseEnter={(e) => {e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 12px rgba(0, 217, 255, 0.3)'}}
          onMouseLeave={(e) => {e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none'}}>
          🎯 Onboarding
        </button>
        <button onClick={()=>nav('/explore')} style={{padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '6px'}}
          onMouseEnter={(e) => {e.target.style.borderColor = 'var(--primary)'; e.target.style.color = 'var(--primary)'; e.target.style.transform = 'translateY(-2px)'}}
          onMouseLeave={(e) => {e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; e.target.style.transform = 'translateY(0)'}}>
          🗺️ Explore
        </button>
      </div>
      
      <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8" style={{animation: 'fadeInDown 0.6s ease'}}>Career Onboarding</h1>

      {/* Steps indicator */}
      <ol className="flex items-center space-x-4 mb-8 text-lg text-slate-300">
        {[
          {num: 1, label: 'Class', icon: '📚'},
          {num: 2, label: 'Board', icon: '🏫'},
          {num: 3, label: 'Interests', icon: '❤️'},
          {num: 4, label: 'Results', icon: '🎯'}
        ].map(({num, label, icon}) => (
          <li key={num} className={`flex items-center ${step>=num? 'text-primary':'text-slate-500'}`} style={{transition: 'all 0.4s ease', transform: step >= num ? 'scale(1.05)' : 'scale(1)'}}>
            <span className={`w-8 h-8 rounded-full border mr-2 flex items-center justify-center ${step>=num? 'border-primary bg-primary/20 shadow-glow':'border-slate-600'}`} style={{transition: 'all 0.4s ease'}}>
              {step > num ? '✓' : icon}
            </span>
            {label}
          </li>
        ))}
      </ol>

      {step===1 && (
        <div className="bg-white/5 border border-slate-700 rounded-xl p-8 backdrop-blur" style={{animation: 'slideInUp 0.5s ease', opacity: isAnimating ? 0 : 1, transition: 'opacity 0.3s ease'}}>
          <h2 className="text-3xl font-semibold mb-4 text-primary flex items-center gap-3">📚 Step 1 — Select Class</h2>
          <p className="text-lg text-slate-300 mb-6">Currently supported: Class 10</p>
          <div className="flex items-center gap-4">
            <div className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary text-white text-lg font-semibold shadow-glow" style={{animation: 'pulse 2s infinite'}}>
              Class 10
            </div>
          </div>
          <div className="mt-8">
            <button type="button" className="btn" onClick={()=>goToStep(2)} style={{transition: 'all 0.3s ease'}}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              Next → 
            </button>
          </div>
        </div>
      )}

      {step===2 && (
        <div className="bg-white/5 border border-slate-700 rounded-xl p-8 backdrop-blur" style={{animation: 'slideInUp 0.5s ease', opacity: isAnimating ? 0 : 1, transition: 'opacity 0.3s ease'}}>
          <h2 className="text-3xl font-semibold mb-4 text-primary flex items-center gap-3">🏫 Step 2 — Choose Board</h2>
          <p className="text-lg text-slate-300 mb-6">Pick your board to personalize content.</p>
          <div className="flex gap-3 flex-wrap">
            {BOARDS.map(b => (
              <button 
                key={b}
                onClick={() => setBoard(b)}
                className={`px-6 py-3 rounded-lg border-2 font-semibold text-lg transition-all duration-300 ${
                  board === b 
                    ? 'border-primary bg-primary/20 text-primary shadow-glow' 
                    : 'border-slate-600 text-slate-300 hover:border-primary/50'
                }`}
                style={{
                  transform: board === b ? 'scale(1.05)' : 'scale(1)',
                  animation: board === b ? 'pulse 2s infinite' : 'none'
                }}
              >
                {b}
              </button>
            ))}
          </div>
          <div className="mt-8 flex gap-4">
            <button type="button" className="btn" onClick={()=>goToStep(1)} style={{transition: 'all 0.3s ease'}}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              ← Back
            </button>
            <button type="button" className="btn" onClick={()=>goToStep(3)} style={{transition: 'all 0.3s ease'}}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              Next →
            </button>
          </div>
        </div>
      )}

      {step===3 && (
        <div className="bg-white/5 border border-slate-700 rounded-xl p-8 backdrop-blur" style={{animation: 'slideInUp 0.5s ease', opacity: isAnimating ? 0 : 1, transition: 'opacity 0.3s ease'}}>
          <h2 className="text-3xl font-semibold mb-4 text-primary flex items-center gap-3">❤️ Step 3 — Select Interests</h2>
          <p className="text-lg text-slate-300 mb-6">Pick 2–4 interests (used for ranking only; never for eligibility).</p>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px'}}>
            {INTERESTS.map((interest) => {
              const name = interest.name
              const icon = interest.icon
              const isSelected = interests.some(i => (typeof i === 'string' ? i : i.name) === name)
              return (
                <button 
                  key={name}
                  type="button"
                  style={{
                    padding: '12px 20px',
                    borderRadius: '24px',
                    border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                    background: isSelected ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.25), rgba(154, 52, 255, 0.25))' : 'transparent',
                    color: isSelected ? 'var(--primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontFamily: 'Inter, sans-serif',
                    position: 'relative',
                    zIndex: 10,
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected ? '0 4px 12px rgba(0, 217, 255, 0.4)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onClick={() => toggleInterest(interest)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.1) translateY(-2px)'
                    e.target.style.borderColor = 'var(--primary)'
                    e.target.style.color = 'var(--primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = isSelected ? 'scale(1.05)' : 'scale(1)'
                    e.target.style.borderColor = isSelected ? 'var(--primary)' : 'var(--border)'
                    e.target.style.color = isSelected ? 'var(--primary)' : 'var(--text-secondary)'
                  }}
                >
                  <span style={{fontSize: '1.3rem'}}>{icon}</span>
                  {name}
                  {isSelected && <span style={{marginLeft: '4px'}}>✓</span>}
                </button>
              )
            })}
          </div>
          <div style={{display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap'}}>
            <button type="button" className="btn" onClick={() => goToStep(2)} style={{transition: 'all 0.3s ease'}}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              ← Back
            </button>
            <button type="button" className="btn" onClick={submit} disabled={loading} style={{
              opacity: loading ? 0.7 : 1, 
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'scale(1)')}>
              {loading && <span className="inline-block animate-spin mr-2">⚙️</span>}
              {loading ? 'Ranking…' : '✨ Submit & Rank Paths'}
            </button>
            {error && <span style={{color: '#ff6b6b', fontSize: '1.05rem', animation: 'shake 0.5s'}}>{error}</span>}
          </div>
        </div>
      )}

      {step===4 && (
        <div className="bg-white/5 border border-slate-700 rounded-xl p-8 backdrop-blur" style={{animation: 'slideInUp 0.5s ease', opacity: isAnimating ? 0 : 1, transition: 'opacity 0.3s ease'}}>
          <h2 className="text-3xl font-semibold mb-6 text-primary flex items-center gap-3">🎯 Recommended Career Paths</h2>
          {!ranked && <div className="text-slate-300 text-lg">No results</div>}
          {ranked && (
            <>
              <p className="text-slate-300 mb-4" style={{animation: 'fadeIn 0.6s ease'}}>Based on your interests: <span className="text-primary font-semibold">{interests.map(i => typeof i === 'string' ? i : i.name).join(', ')}</span></p>
              
              {/* Filter Controls */}
              <div className="flex gap-3 mb-6 flex-wrap" style={{animation: 'fadeIn 0.8s ease'}}>
                <button 
                  onClick={() => setFilterScore('all')} 
                  className={`px-4 py-2 rounded-lg border transition-all duration-300 ${filterScore === 'all' ? 'border-primary bg-primary/20 text-primary shadow-glow' : 'border-slate-600 text-slate-400 hover:border-primary/50'}`}
                  style={{transform: filterScore === 'all' ? 'scale(1.05)' : 'scale(1)'}}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05) translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = filterScore === 'all' ? 'scale(1.05)' : 'scale(1)'}
                >
                  📊 All ({ranked.length})
                </button>
                <button 
                  onClick={() => setFilterScore('high')} 
                  className={`px-4 py-2 rounded-lg border transition-all duration-300 ${filterScore === 'high' ? 'border-primary bg-primary/20 text-primary shadow-glow' : 'border-slate-600 text-slate-400 hover:border-primary/50'}`}
                  style={{transform: filterScore === 'high' ? 'scale(1.05)' : 'scale(1)'}}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05) translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = filterScore === 'high' ? 'scale(1.05)' : 'scale(1)'}
                >
                  ⭐ Best Matches ({ranked.filter(r => r.score >= 5).length})
                </button>
                <button 
                  onClick={() => setFilterScore('medium')} 
                  className={`px-4 py-2 rounded-lg border transition-all duration-300 ${filterScore === 'medium' ? 'border-primary bg-primary/20 text-primary shadow-glow' : 'border-slate-600 text-slate-400 hover:border-primary/50'}`}
                  style={{transform: filterScore === 'medium' ? 'scale(1.05)' : 'scale(1)'}}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05) translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = filterScore === 'medium' ? 'scale(1.05)' : 'scale(1)'}
                >
                  ✨ Good Matches ({ranked.filter(r => r.score >= 2 && r.score < 5).length})
                </button>
                <button 
                  onClick={() => setFilterScore('any')} 
                  className={`px-4 py-2 rounded-lg border transition-all duration-300 ${filterScore === 'any' ? 'border-primary bg-primary/20 text-primary shadow-glow' : 'border-slate-600 text-slate-400 hover:border-primary/50'}`}
                  style={{transform: filterScore === 'any' ? 'scale(1.05)' : 'scale(1)'}}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05) translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = filterScore === 'any' ? 'scale(1.05)' : 'scale(1)'}
                >
                  💡 Others ({ranked.filter(r => r.score > 0 && r.score < 2).length})
                </button>
              </div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {ranked
                  .filter(r => {
                    if (filterScore === 'all') return true;
                    if (filterScore === 'high') return r.score >= 5;
                    if (filterScore === 'medium') return r.score >= 2 && r.score < 5;
                    if (filterScore === 'any') return r.score > 0 && r.score < 2;
                    return true;
                  })
                  .map((r, idx) => (
                    <div 
                      key={r.career_id || idx} 
                      className="flex items-start gap-3 p-4 rounded-lg border border-slate-700 bg-white/5 hover:bg-white/10 transition-all duration-300"
                      style={{
                        animation: `fadeInUp 0.${5 + idx}s ease`,
                        transform: 'translateY(0)',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 217, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.borderColor = 'rgb(51, 65, 85)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-white text-base flex items-center gap-2">
                          <span>🎯</span> {r.career_name}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">{r.reason || 'Available career path'}</div>
                        {r.score > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex gap-1">
                              {Array.from({length: Math.min(5, Math.ceil(r.score/2))}).map((_, i) => (
                                <span 
                                  key={i} 
                                  className="inline-block w-2 h-2 rounded-full bg-emerald-400"
                                  style={{animation: `pulse 2s infinite ${i * 0.1}s`}}
                                ></span>
                              ))}
                            </div>
                            <span className="text-xs text-emerald-300 font-semibold">{r.score} pts</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
              <p className="text-sm text-slate-400 mt-4 italic">
                {filterScore === 'all' 
                  ? `Showing all ${ranked.length} results` 
                  : `Filtered results • Use tabs above to see more`}
              </p>
            </>
          )}
          <div className="mt-6 flex gap-4">
            <button 
              type="button" 
              className="btn" 
              onClick={() => { goToStep(3); setRanked(null); setFilterScore('all'); }}
              style={{transition: 'all 0.3s ease'}}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05) translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              ← Adjust Interests
            </button>
            <button 
              type="button" 
              className="btn" 
              onClick={() => nav('/explore')}
              style={{transition: 'all 0.3s ease'}}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05) translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              🗺️ Explore Career Map
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
