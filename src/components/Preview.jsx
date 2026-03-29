import React from 'react'
import { fillTemplate } from '../useOutreach'
import s from './Preview.module.css'

const BADGE = {
  sent:    <div className={`${s.badge} ${s.badgeSent}`}>✓ sent</div>,
  failed:  <div className={`${s.badge} ${s.badgeFailed}`}>✗ failed</div>,
  sending: <div className={`${s.badge} ${s.badgeSending}`}>sending...</div>,
}

export default function Preview({ contacts, subject, body, sender }) {
  if (!contacts.length) {
    return (
      <div className={s.emptyState}>
        <div className={s.emptyIcon}>✉</div>
        <p>Add HR contacts in the sidebar<br />and they'll appear here as personalised previews.</p>
      </div>
    )
  }

  return (
    <div className={s.grid}>
      {contacts.map(hr => {
        const ps = fillTemplate(subject, hr, sender)
        const pb = fillTemplate(body, hr, sender)
        return (
          <div key={hr.id} className={`${s.card} ${s['card_' + hr.status] || ''}`}>
            {BADGE[hr.status]}
            <div className={s.to}>To: {hr.email}</div>
            <div className={s.subj}>{ps}</div>
            <div className={s.body}>{pb}</div>
          </div>
        )
      })}
    </div>
  )
}
