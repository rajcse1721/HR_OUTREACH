import React from 'react'
import s from './StatsBar.module.css'

export default function StatsBar({ contacts }) {
  const total   = contacts.length
  const sent    = contacts.filter(c => c.status === 'sent').length
  const failed  = contacts.filter(c => c.status === 'failed').length
  const pending = contacts.filter(c => c.status === 'pending').length

  return (
    <div className={s.bar}>
      <div className={s.stat}>
        <div className={`${s.num} ${s.accent}`}>{total}</div>
        <div className={s.label}>total</div>
      </div>
      <div className={s.stat}>
        <div className={`${s.num} ${s.teal}`}>{sent}</div>
        <div className={s.label}>sent</div>
      </div>
      <div className={s.stat}>
        <div className={`${s.num} ${s.red}`}>{failed}</div>
        <div className={s.label}>failed</div>
      </div>
      <div className={s.stat}>
        <div className={`${s.num} ${s.amber}`}>{pending}</div>
        <div className={s.label}>pending</div>
      </div>
    </div>
  )
}
