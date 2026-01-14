import React from 'react'
import { Link } from 'react-router-dom'

export default function App(){
  return (
    <div className="app">
      <header className="header">
        <h1>Career Navigator</h1>
        <p>Explore your future with AI-powered career path guidance. Discover streams, courses, and careers aligned with your aspirations.</p>
        <Link to="/explore" className="btn">Start Exploring →</Link>
      </header>
    </div>
  )
}
