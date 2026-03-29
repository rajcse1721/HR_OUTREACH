import React from 'react'
import s from './SetupGuide.module.css'

const steps = [
  {
    n: 1,
    title: 'Enable 2-Step Verification',
    content: (
      <>Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer">myaccount.google.com/security</a> → 2-Step Verification → Turn On.</>
    ),
  },
  {
    n: 2,
    title: 'Create a Gmail App Password',
    content: (
      <>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer">myaccount.google.com/apppasswords</a> → Select app: <strong>Mail</strong> → Generate. Copy the 16-character password.</>
    ),
  },
  {
    n: 3,
    title: 'Edit server.js',
    content: (
      <>Open <code>server.js</code> in the project root and paste your App Password:
        <div className={s.codeBlock}><span className={s.cmd}>const GMAIL_PASS = 'abcd efgh ijkl mnop'; {'// ← paste here'}</span></div>
      </>
    ),
  },
  {
    n: 4,
    title: 'Install & start the backend',
    content: (
      <>Run these in the project folder:
        <div className={s.codeBlock}>
          <span className={s.cmd}>npm install{'\n'}node server.js</span>
        </div>
      </>
    ),
  },
  {
    n: 5,
    title: 'Start the Vite frontend',
    content: (
      <>Open a second terminal in the same folder:
        <div className={s.codeBlock}><span className={s.cmd}>npm run dev</span></div>
        Then open <a href="http://localhost:5173" target="_blank" rel="noreferrer">http://localhost:5173</a> in your browser.
      </>
    ),
  },
  {
    n: 6,
    title: 'Add contacts & send',
    content: 'Add your HR contacts in the sidebar, preview each email in the Preview tab, and hit Send All Directly. Emails go straight from your Gmail — no drafts, no Google Cloud.',
  },
]

export default function SetupGuide() {
  return (
    <div className={s.wrap}>
      <div className={s.card}>
        <h2 className={s.heading}>One-time setup — 5 minutes</h2>
        <p className={s.sub}>No Google Cloud needed. Uses Gmail App Password via Nodemailer.</p>
        <div className={s.steps}>
          {steps.map(step => (
            <div key={step.n} className={s.step}>
              <div className={s.stepNum}>{step.n}</div>
              <div className={s.stepBody}>
                <h3 className={s.stepTitle}>{step.title}</h3>
                <div className={s.stepContent}>{step.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
