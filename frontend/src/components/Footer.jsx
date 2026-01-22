import React from 'react'

const DEVELOPERS = [
  {
    name: 'Muni Rangadu',
    title: 'Full-Stack Developer',
    roles: ['Backend Specialist', 'Database & API Expert'],
    email: 'kuruvamunirangadu.2005@gmail.com',
    phone: '+91 8639019597',
    icon: '👨‍💻'
  },
  {
    name: 'Reddi Sekhar',
    title: 'Full-Stack Developer',
    roles: ['Project Lead & Architect', 'Next.js & TypeScript Expert'],
    email: 'reddisekharmarugani@gmail.com',
    phone: '+91 9346414887',
    icon: '👨‍💼'
  }
]

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* About Section */}
        <div className="footer-column">
          <h3 className="footer-heading">About Career Navigator</h3>
          <p className="footer-text">
            Intelligent career path guidance system designed to help students discover streams, variants, and next-best actions aligned with their interests and goals.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/onboarding">Onboarding</a></li>
            <li><a href="/explore">Explore</a></li>
            <li><a href="https://github.com/kuruvamunirangadu/Career-path-Navigator" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-column">
          <h3 className="footer-heading">Get Support</h3>
          <ul className="footer-links">
            <li>📧 <a href="mailto:kuruvamunirangadu.2005@gmail.com">Email Support</a></li>
            <li>💬 <a href="https://wa.me/918639019597" target="_blank" rel="noopener noreferrer">WhatsApp Support</a></li>
            <li>🐙 <a href="https://github.com/kuruvamunirangadu/Career-path-Navigator/issues" target="_blank" rel="noopener noreferrer">Report Issues</a></li>
          </ul>
        </div>

        {/* Contact Developers */}
        <div className="footer-column">
          <h3 className="footer-heading">Contact Developers</h3>
          <p className="footer-text">
            Connect with our development team for technical support and feature requests.
          </p>
        </div>
      </div>

      <div className="footer-divider"></div>

      {/* Developer Cards */}
      <div className="developers-section">
        {DEVELOPERS.map((dev) => (
          <div key={dev.name} className="dev-card">
            <div className="dev-header">
              <span className="dev-icon">{dev.icon}</span>
              <h4 className="dev-name">{dev.name}</h4>
            </div>
            <p className="dev-title">{dev.title}</p>
            <div className="dev-roles">
              {dev.roles.map((role, idx) => (
                <span key={idx} className="dev-role">{role}</span>
              ))}
            </div>
            <div className="dev-contact">
              <a href={`mailto:${dev.email}`} className="contact-link">
                📧 {dev.email}
              </a>
              <a href={`https://wa.me/${dev.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="contact-link">
                💬 {dev.phone}
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="footer-divider"></div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p className="copyright">© 2026 Career Navigator. All rights reserved.</p>
        <p className="footer-credit">
          Proudly developed by <strong>Muni Rangadu</strong> & <strong>Reddi Sekhar</strong>
        </p>
      </div>
    </footer>
  )
}
