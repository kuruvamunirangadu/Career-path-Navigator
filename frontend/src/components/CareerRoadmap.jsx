import React from 'react'

export default function CareerRoadmap({ careerId, careerName, nbaAttributes }) {
  // Create timeline based on career attributes
  const phases = []

  // Phase 1: Decision & Preparation
  phases.push({
    title: 'Decision & Preparation',
    icon: '📚',
    color: '#FFD460',
    duration: '1-2 years',
    actions: [
      'Research career thoroughly',
      'Assess your aptitude and interests',
      nbaAttributes?.has_exam && 'Begin entrance exam preparation',
      nbaAttributes?.is_skill_based && 'Start learning foundational skills'
    ].filter(Boolean)
  })

  // Phase 2: Entrance & Qualification
  if (nbaAttributes?.has_exam || nbaAttributes?.has_degree) {
    phases.push({
      title: 'Entrance & Qualification',
      icon: '📝',
      color: '#FF6B35',
      duration: nbaAttributes?.has_degree ? '3-5 years' : '1-2 years',
      actions: [
        nbaAttributes?.has_exam && 'Take entrance examination',
        nbaAttributes?.has_degree && 'Pursue degree program',
        nbaAttributes?.has_diploma && 'Complete diploma program',
        'Build foundational knowledge',
        'Internship and practical experience'
      ].filter(Boolean)
    })
  }

  // Phase 3: Skill Development
  if (nbaAttributes?.is_skill_based || nbaAttributes?.has_degree) {
    phases.push({
      title: 'Skill Development',
      icon: '🛠️',
      color: '#4ECDC4',
      duration: '1-3 years',
      actions: [
        'Develop technical skills',
        'Obtain relevant certifications',
        nbaAttributes?.is_skill_based && 'Build portfolio of projects',
        'Gain hands-on experience',
        'Network with professionals'
      ].filter(Boolean)
    })
  }

  // Phase 4: Entry & Career Start
  phases.push({
    title: 'Career Entry',
    icon: '🚀',
    color: '#00D9FF',
    duration: 'Ongoing',
    actions: [
      'Secure first job/position',
      'Adapt to professional environment',
      nbaAttributes?.is_govt_service && 'Join government service',
      nbaAttributes?.is_medical && 'Obtain medical license',
      'Establish professional reputation'
    ].filter(Boolean)
  })

  // Phase 5: Growth & Specialization
  phases.push({
    title: 'Growth & Specialization',
    icon: '📈',
    color: '#6A4C93',
    duration: '3-5 years',
    actions: [
      'Pursue advanced certifications',
      'Consider specialization/masters',
      'Increase responsibility and leadership',
      nbaAttributes?.is_govt_service && 'Climb government hierarchy',
      'Develop expertise and thought leadership'
    ].filter(Boolean)
  })

  return (
    <div style={{ animation: 'fadeIn 0.6s ease' }}>
      <div style={{ marginBottom: '32px' }}>
        <h3
          style={{
            color: 'var(--primary)',
            marginTop: 0,
            fontSize: '1.25rem',
            marginBottom: '20px'
          }}>
          🗺️ Your Career Roadmap
        </h3>

        {/* Timeline Visualization */}
        <div
          style={{
            position: 'relative',
            paddingLeft: '40px'
          }}>
          {/* Vertical line */}
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '30px',
              bottom: '0',
              width: '2px',
              background: 'linear-gradient(180deg, #00D9FF, #FF6B35)',
              borderRadius: '2px'
            }}
          />

          {/* Timeline items */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
            {phases.map((phase, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  animation: `slideInUp 0.${5 + (idx % 3)}s ease`
                }}>
                {/* Timeline dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '-40px',
                    top: '0',
                    width: '28px',
                    height: '28px',
                    background: phase.color,
                    border: '3px solid var(--bg-darker)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--bg-darker)',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    boxShadow: `0 0 0 3px ${phase.color}40`
                  }}>
                  {idx + 1}
                </div>

                {/* Phase card */}
                <div
                  style={{
                    background: `${phase.color}10`,
                    border: `2px solid ${phase.color}`,
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${phase.color}20`
                    e.currentTarget.style.transform = 'translateX(8px)'
                    e.currentTarget.style.boxShadow = `0 8px 16px ${phase.color}30`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${phase.color}10`
                    e.currentTarget.style.transform = 'translateX(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}>
                  {/* Phase header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{phase.icon}</span>
                    <div>
                      <h4
                        style={{
                          margin: '0 0 2px 0',
                          color: 'var(--text-primary)',
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        }}>
                        {phase.title}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          color: 'var(--text-secondary)',
                          fontSize: '0.9rem'
                        }}>
                        ⏱️ {phase.duration}
                      </p>
                    </div>
                  </div>

                  {/* Actions list */}
                  <ul
                    style={{
                      margin: '12px 0 0 0',
                      paddingLeft: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                    {phase.actions.map((action, actionIdx) => (
                      <li
                        key={actionIdx}
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.95rem',
                          lineHeight: '1.4'
                        }}>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Milestones */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(106, 76, 147, 0.1))',
          border: '2px solid rgba(0, 217, 255, 0.3)',
          borderRadius: '12px',
          padding: '24px',
          animation: 'slideInUp 0.8s ease'
        }}>
        <h3
          style={{
            color: 'var(--primary)',
            marginTop: 0,
            fontSize: '1.25rem',
            marginBottom: '16px'
          }}>
          🎯 Key Milestones
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
          <div
            style={{
              background: 'rgba(255, 107, 53, 0.1)',
              border: '1px solid rgba(255, 107, 53, 0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#FF6B35', fontSize: '0.9rem' }}>
              SHORT TERM (0-2 years)
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}>
              {nbaAttributes?.has_exam && <li>Complete entrance exam preparation</li>}
              {nbaAttributes?.is_skill_based && <li>Build foundational skills</li>}
              <li>Research thoroughly and plan</li>
            </ul>
          </div>

          <div
            style={{
              background: 'rgba(78, 205, 196, 0.1)',
              border: '1px solid rgba(78, 205, 196, 0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#4ECDC4', fontSize: '0.9rem' }}>
              MID TERM (2-5 years)
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}>
              {nbaAttributes?.has_degree && <li>Complete degree program</li>}
              <li>Gain practical experience</li>
              <li>Secure entry-level position</li>
            </ul>
          </div>

          <div
            style={{
              background: 'rgba(106, 76, 147, 0.1)',
              border: '1px solid rgba(106, 76, 147, 0.3)',
              borderRadius: '8px',
              padding: '16px'
            }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#6A4C93', fontSize: '0.9rem' }}>
              LONG TERM (5+ years)
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}>
              <li>Develop specialized expertise</li>
              {nbaAttributes?.is_govt_service && <li>Progress in government hierarchy</li>}
              <li>Establish thought leadership</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(0, 217, 255, 0.08)',
          border: '1px dashed rgba(0, 217, 255, 0.3)',
          borderRadius: '8px',
          animation: 'fadeIn 0.9s ease'
        }}>
        <p style={{ margin: '0 0 12px 0', color: 'var(--primary)', fontWeight: '600', fontSize: '1rem' }}>
          💡 Tips for Success
        </p>
        <ul
          style={{
            margin: 0,
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
          }}>
          <li>Stay committed and persistent through challenges</li>
          <li>Network with people already in this field</li>
          <li>Keep developing new skills continuously</li>
          <li>Track your progress against these milestones</li>
          <li>Adapt your plan as circumstances change</li>
        </ul>
      </div>
    </div>
  )
}
