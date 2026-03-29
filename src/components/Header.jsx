import React from "react";
import s from "./Header.module.css";

export default function Header({ status, email, theme, onToggleTheme }) {
  const pillClass =
    status === "ok" ? s.connected : status === "error" ? s.error : s.checking;
  const label =
    status === "ok"
      ? `Gmail connected · ${email}`
      : status === "error"
        ? "Server offline ???? — run: node server.js"
        : "Checking server...";

  return (
    <header className={s.header}>
      <div className={s.logo}>
        <div className={s.logoMark}>R</div>
        <span className={s.logoText}>HR Outreach</span>
        <span className={s.logoSub}>/ direct send via Gmail</span>
      </div>
      <div className={s.hereRight}>
        <button className={s.themeBtn} onClick={onToggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <div className={`${s.pill} ${pillClass}`}>
          <div className={s.dot} />
          <span>{label}</span>
        </div>
      </div>
    </header>
  );
}
