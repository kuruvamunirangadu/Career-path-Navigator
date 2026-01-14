import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Onboarding from './pages/Onboarding'
import Explore from './pages/Explore'
import StreamDetail from './pages/StreamDetail'
import VariantPaths from './pages/VariantPaths'
import VisualChart from './components/VisualChart'
import './index.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Onboarding/>} />
        <Route path='/home' element={<App/>} />
        <Route path='/explore' element={<Explore/>} />
        <Route path='/explore/:streamId' element={<StreamDetail/>} />
        <Route path='/explore/:streamId/variants' element={<VariantPaths/>} />
        <Route path='*' element={<Navigate to='/' replace/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
