import React, { useRef } from 'react'
import s from './Compose.module.css'

const TOKENS = ['{{hr_name}}', '{{company}}', '{{your_name}}', '{{your_role}}', '{{linkedin}}', '{{phone}}']

export default function Compose({ subject, setSubject, body, setBody }) {
  const taRef = useRef()

  const insertToken = (token) => {
    const ta = taRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    const newVal = body.substring(0, start) + token + body.substring(end)
    setBody(newVal)
    setTimeout(() => {
      ta.selectionStart = ta.selectionEnd = start + token.length
      ta.focus()
    }, 0)
  }

  return (
    <div className={s.compose}>
      <div className={s.field}>
        <label>Subject line</label>
        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className={s.subject}
        />
      </div>

      <div className={s.field}>
        <label>Email body</label>
        <div className={s.tokenBar}>
          <span className={s.tokenLabel}>Insert:</span>
          {TOKENS.map(t => (
            <button key={t} className={s.token} onClick={() => insertToken(t)}>{t}</button>
          ))}
        </div>
        <textarea
          ref={taRef}
          value={body}
          onChange={e => setBody(e.target.value)}
          rows={16}
          className={s.body}
        />
      </div>
    </div>
  )
}
