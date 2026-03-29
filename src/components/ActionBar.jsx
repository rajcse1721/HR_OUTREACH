import React from 'react'
import s from './ActionBar.module.css'

export default function ActionBar({ contacts, isSending, onSend, progress }) {
  const pending = contacts.filter(c => c.status !== 'sent').length
  const total   = contacts.length

  const info = total === 0
    ? 'Add contacts to get started'
    : `Ready to send ${pending} email${pending !== 1 ? 's' : ''} directly from Gmail`

  return (
    <div className={s.bar}>
      <div className={s.info}>{info}</div>

      {isSending && (
        <div className={s.progressWrap}>
          <div className={s.progressLabel}>
            <span>Sending...</span>
            <span>{progress.done} / {progress.total}</span>
          </div>
          <div className={s.progressTrack}>
            <div
              className={s.progressFill}
              style={{ width: progress.total ? `${Math.round((progress.done / progress.total) * 100)}%` : '0%' }}
            />
          </div>
        </div>
      )}

      <div className={s.actions}>
        <button
          className={s.btnSend}
          onClick={onSend}
          disabled={isSending || total === 0}
        >
          {isSending ? 'Sending...' : 'Send all directly →'}
        </button>
      </div>
    </div>
  )
}
