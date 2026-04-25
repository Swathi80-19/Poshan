import { useEffect, useState } from 'react'
import { ArrowRight, ShieldCheck, UserRound } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import poshanLogoWhite from '../assets/poshan-logo-white.svg'

const choiceOrbs = [
  { size: '12rem', top: '6%', left: '8%', duration: '16s', delay: '0s', driftX: '2vw', driftY: '-3vh' },
  { size: '18rem', top: '12%', left: '76%', duration: '22s', delay: '-4s', driftX: '-3vw', driftY: '4vh' },
  { size: '8rem', top: '54%', left: '20%', duration: '18s', delay: '-7s', driftX: '3vw', driftY: '3vh' },
  { size: '14rem', top: '68%', left: '70%', duration: '20s', delay: '-10s', driftX: '-2vw', driftY: '-4vh' },
]

const choices = [
  {
    title: 'Member login',
    icon: <UserRound size={20} />,
    action: '/login',
    description: 'Track meals, appointments, and progress in your personal wellness workspace.',
    eyebrow: 'For patients',
    points: ['Meals and activity', 'Appointments and history'],
  },
  {
    title: 'Nutritionist login',
    icon: <ShieldCheck size={20} />,
    action: '/admin/login',
    description: 'Manage patients, sessions, reports, and day-to-day practice decisions.',
    eyebrow: 'For professionals',
    points: ['Patients and sessions', 'Reports and follow-ups'],
  },
]

export default function ChoicePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDrawingEntry, setIsDrawingEntry] = useState(Boolean(location.state?.drawnEntry))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!isDrawingEntry) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setIsDrawingEntry(false)
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [isDrawingEntry])

  return (
    <div className={`choice-scene ${isDrawingEntry ? 'choice-scene-drawing' : 'choice-scene-ready'}`}>
      <div className="choice-scene-orbs" aria-hidden="true">
        {choiceOrbs.map((orb, index) => (
          <span
            key={`${orb.top}-${orb.left}`}
            className="choice-scene-orb"
            style={{
              '--orb-size': orb.size,
              '--orb-top': orb.top,
              '--orb-left': orb.left,
              '--orb-duration': orb.duration,
              '--orb-delay': orb.delay,
              '--orb-drift-x': orb.driftX,
              '--orb-drift-y': orb.driftY,
              '--orb-hue': index % 2 === 0 ? 'rgba(115, 149, 95, 0.18)' : 'rgba(201, 149, 59, 0.2)',
            }}
          />
        ))}
      </div>
      <div className="choice-scene-grid" />

      <div className={`choice-stage-shell ${isDrawingEntry ? 'choice-stage-shell-drawing' : 'choice-stage-shell-ready'}`}>
        <section className="choice-stage">
          <div className="choice-stage-copy">
            <div className="brand-lockup">
              <div className="brand-chip">
                <img src={poshanLogoWhite} alt="Poshan" style={{ width: 30, height: 30 }} />
              </div>
              <div>
                <div className="brand-name">Poshan</div>
                <div className="eyebrow" style={{ marginTop: '0.2rem' }}>Portal opened</div>
              </div>
            </div>

            <div className="story-section-tag">Choose your entrance</div>
            <h1 className="choice-stage-title">Select the login that matches the person using Poshan.</h1>
            <p className="choice-stage-text">
              Pick the workspace you want to open now. Each path takes you straight into the tools made for that role.
            </p>
            <p className="choice-stage-note">
              Two clear paths, one secure account system. You can always switch later by signing out.
            </p>
          </div>

          <div className="choice-stage-grid">
            {choices.map((choice) => (
              <button
                key={choice.title}
                type="button"
                className="choice-stage-card"
                onClick={() => navigate(choice.action)}
              >
                <div className="choice-stage-card-top">
                  <div className="choice-stage-icon">{choice.icon}</div>
                  <span className="choice-stage-tag">{choice.eyebrow}</span>
                </div>

                <div className="choice-stage-card-body">
                  <strong>{choice.title}</strong>
                  <p>{choice.description}</p>
                  <div className="choice-stage-points" aria-hidden="true">
                    {choice.points.map((point) => (
                      <span key={point} className="choice-stage-point">{point}</span>
                    ))}
                  </div>
                </div>

                <div className="choice-stage-card-foot">
                  Continue
                  <ArrowRight size={16} />
                </div>
              </button>
            ))}
          </div>

          <div className="choice-stage-support">
            <span className="choice-stage-support-label">Quick reminder</span>
            <p className="choice-stage-support-text">
              Members continue to their personal wellness dashboard. Nutritionists continue to the clinical workspace.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
