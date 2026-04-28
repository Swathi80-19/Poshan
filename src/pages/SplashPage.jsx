import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import poshanLogoWhite from '../assets/poshan-logo-white.svg'

const floatingOrbs = [
  { size: '14rem', top: '4%', left: '3%', duration: '18s', delay: '0s', driftX: '3vw', driftY: '-5vh' },
  { size: '18rem', top: '8%', left: '78%', duration: '22s', delay: '-4s', driftX: '-4vw', driftY: '4vh' },
  { size: '10rem', top: '34%', left: '-2%', duration: '20s', delay: '-6s', driftX: '3vw', driftY: '2vh' },
  { size: '12rem', top: '52%', left: '20%', duration: '17s', delay: '-3s', driftX: '4vw', driftY: '3vh' },
  { size: '16rem', top: '44%', left: '82%', duration: '24s', delay: '-10s', driftX: '-3vw', driftY: '-4vh' },
  { size: '15rem', top: '92%', left: '10%', duration: '23s', delay: '-9s', driftX: '4vw', driftY: '-2vh' },
  { size: '8rem', top: '120%', left: '72%', duration: '18s', delay: '-5s', driftX: '-2vw', driftY: '3vh' },
  { size: '12rem', top: '150%', left: '28%', duration: '20s', delay: '-12s', driftX: '3vw', driftY: '-4vh' },
]

const structureCards = [
  {
    id: '01',
    title: 'One health story',
    text: 'Poshan keeps the day together so logging does not break into scattered notes and missing context.',
  },
  {
    id: '02',
    title: 'Readable pattern view',
    text: 'The record becomes easier to review because changes, consistency, and gaps can be read in one flow.',
  },
  {
    id: '03',
    title: 'Care linked to action',
    text: 'The same information can move forward into nutrition guidance instead of ending as passive tracking data.',
  },
]

const workflowSteps = [
  {
    id: '01',
    label: 'Capture',
    title: 'Log the day one time.',
    text: 'Meals, hydration, activity, sleep, and progress enter the same shared record.',
    state: 'Input collected',
    width: '88%',
  },
  {
    id: '02',
    label: 'Structure',
    title: 'Organize the record into a usable view.',
    text: 'Poshan shapes those entries into a timeline that feels calm, readable, and consistent.',
    state: 'Data arranged',
    width: '74%',
  },
  {
    id: '03',
    label: 'Review',
    title: 'Read what the pattern is saying.',
    text: 'Signals become easier to review because trends and routines stay attached to the same daily story.',
    state: 'Signals visible',
    width: '63%',
  },
  {
    id: '04',
    label: 'Continue',
    title: 'Enter the right login.',
    text: 'Members and nutritionists move into the login that matches their role without losing the context of the record.',
    state: 'Ready to enter',
    width: '52%',
  },
]

const trackedItems = ['Meals', 'Hydration', 'Activity', 'Weight', 'Sleep', 'Progress']
const ctaNotes = ['Member access', 'Nutritionist access', 'Care tools']

export default function SplashPage() {
  const navigate = useNavigate()
  const timeoutRef = useRef(null)
  const introTimeoutRef = useRef(null)
  const [isIntroDrawing, setIsIntroDrawing] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)

    introTimeoutRef.current = window.setTimeout(() => {
      setIsIntroDrawing(false)
    }, 1650)

    return () => {
      if (introTimeoutRef.current) {
        window.clearTimeout(introTimeoutRef.current)
      }

      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleContinue = () => {
    if (isTransitioning) {
      return
    }

    setIsTransitioning(true)
    timeoutRef.current = window.setTimeout(() => {
      navigate('/choice', { state: { drawnEntry: true } })
    }, 1050)
  }

  return (
    <div className={`landing-page ${isIntroDrawing ? 'landing-page-drawing' : 'landing-page-ready'}`}>
      <div className="landing-grid-layer" />
      <div className="landing-glow landing-glow-a" />
      <div className="landing-glow landing-glow-b" />
      <div className="landing-orb-field" aria-hidden="true">
        {floatingOrbs.map((orb, index) => (
          <span
            key={`${orb.top}-${orb.left}`}
            className="landing-orb"
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

      <section className="landing-poster">
        <div className={`landing-poster-shell ${isIntroDrawing ? 'landing-poster-shell-drawing' : 'landing-poster-shell-ready'}`}>
          <div className="landing-poster-copy">
            <div className="brand-lockup">
              <div className="brand-chip">
                <img src={poshanLogoWhite} alt="Poshan" style={{ width: 30, height: 30 }} />
              </div>
              <div>
                <div className="brand-name">Poshan</div>
                <div className="eyebrow" style={{ marginTop: '0.2rem' }}>Nutrition platform</div>
              </div>
            </div>

            <div className="landing-poster-kicker landing-poster-seq landing-poster-seq-1">Personal nutrition support</div>
            <h1 className="landing-poster-title landing-poster-seq landing-poster-seq-2">
              Healthcare works better when the daily story is clear enough to act on.
            </h1>
            <p className="landing-poster-copytext landing-poster-seq landing-poster-seq-3">
              Poshan brings daily logging, expert guidance, and nutrition follow-through into one clear experience
              so members and nutritionists can stay aligned.
            </p>

            <p className="landing-poster-note landing-poster-seq landing-poster-seq-4">
              Built for members tracking daily health and nutritionists reviewing the same connected record.
            </p>
          </div>

          <div className="landing-poster-visual" aria-hidden="true">
            <div className="landing-logo-stage landing-logo-stage-hero">
              <span className="landing-logo-trace landing-logo-trace-ring" />
              <span className="landing-logo-trace landing-logo-trace-square" />
              <span className="landing-logo-trace landing-logo-trace-line-a" />
              <span className="landing-logo-trace landing-logo-trace-line-b" />
              <span className="landing-logo-glow landing-logo-glow-a" />
              <span className="landing-logo-glow landing-logo-glow-b" />
              <div className="brand-chip landing-logo-chip landing-logo-chip-hero">
                <img src={poshanLogoWhite} alt="Poshan" style={{ width: 76, height: 76 }} />
              </div>
            </div>
          </div>

          <div className="landing-poster-strip landing-poster-seq landing-poster-seq-5">
            {trackedItems.map((item) => (
              <span key={item} className="landing-poster-pill">{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-shell landing-structure">
        <div className="landing-structure-intro">
          <p className="landing-structure-support">
            Instead of scattered sections, Poshan is presented as a simple care system with each area doing one job.
          </p>
        </div>

        <div className="landing-structure-grid">
          {structureCards.map((card) => (
            <article key={card.id} className="landing-structure-card">
              <span className="landing-structure-card-id">{card.id}</span>
              <strong>{card.title}</strong>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-shell landing-workflow-section">
        <div className="landing-workflow-intro">
          <p className="landing-structure-support">
            As the page scrolls, the left side keeps an app snapshot visible while the right side highlights what Poshan helps you manage.
          </p>
        </div>

        <div className="landing-workflow-grid-v2">
          <div className="landing-workflow-panel-wrap">
            <div className="landing-workflow-panel" aria-hidden="true">
              <div className="landing-workflow-panel-head">
                <span>Care view</span>
                <strong>Poshan experience</strong>
              </div>

              <div className="landing-workflow-console">
                {workflowSteps.map((step) => (
                  <div key={step.id} className="landing-workflow-console-row">
                    <div className="landing-workflow-console-top">
                      <span>{step.label}</span>
                      <span>{step.state}</span>
                    </div>
                    <div className="landing-workflow-console-bar">
                      <span style={{ width: step.width }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="landing-workflow-panel-foot">
                <span>Result</span>
                <strong>Your next care step is ready</strong>
              </div>
            </div>
          </div>

          <div className="landing-workflow-list">
            {workflowSteps.map((step) => (
              <article key={step.id} className="landing-workflow-item">
                <div className="landing-workflow-item-id">{step.id}</div>
                <div className="landing-workflow-item-body">
                  <span>{step.label}</span>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-shell landing-cta-banner-shell">
        <div className="landing-cta-banner">
          <div className="landing-cta-banner-copy">
            <div className="landing-structure-tag">Continue</div>
            <h2 className="landing-cta-banner-title">Enter Poshan through the login that matches your role.</h2>
            <p className="landing-structure-support">
              Use the guided entry and move into the side of the platform designed for how you work.
            </p>
          </div>

          <div className="landing-cta-banner-side">
            <div className="landing-cta-banner-notes">
              {ctaNotes.map((note) => (
                <span key={note} className="landing-cta-banner-note">{note}</span>
              ))}
            </div>

            <button
              type="button"
              className="landing-continue-btn landing-continue-btn-wide"
              onClick={handleContinue}
              disabled={isTransitioning}
            >
              Continue to choose login
            </button>
            <p className="landing-cta-banner-subnote">The next page opens with the same guided transition.</p>
          </div>
        </div>
      </section>

      <div className={`draw-portal ${isTransitioning ? 'draw-portal-active' : ''}`} aria-hidden="true">
        <div className="draw-portal-wash" />
        <div className="draw-portal-stage">
          <span className="draw-portal-line draw-portal-line-a" />
          <span className="draw-portal-line draw-portal-line-b" />
          <span className="draw-portal-line draw-portal-line-c" />
          <span className="draw-portal-ring" />
          <span className="draw-portal-fill" />
        </div>
      </div>
    </div>
  )
}
