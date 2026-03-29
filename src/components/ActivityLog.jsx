import React, { useEffect, useRef } from 'react'
import s from './ActivityLog.module.css'

const CLS = { i: s.info, s: s.success, e: s.error, w: s.warn }

export default function ActivityLog({ logs }) {
  const ref = useRef()
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [logs])

  return (
    <div className={s.wrap} ref={ref}>
      {logs.length === 0
        ? <div className={s.empty}>No activity yet — send emails to see logs here.</div>
        : logs.map(l => (
          <div key={l.id} className={`${s.line} ${CLS[l.type] || s.info}`}>
            <span className={s.time}>[{l.time}]</span> {l.msg}
          </div>
        ))
      }
    </div>
  )
}
