import React, { useState, useRef } from "react";
import s from "./Sidebar.module.css";

const STATUS_LABEL = {
  pending: "—",
  sending: "...",
  sent: "✓ sent",
  failed: "✗ fail",
};
const STATUS_CLS = {
  pending: s.stPending,
  sending: s.stSending,
  sent: s.stSent,
  failed: s.stFailed,
};

export default function Sidebar({
  sender,
  setSender,
  contacts,
  delay,
  setDelay,
  onAdd,
  onRemove,
  onClear,
  onLoadPreset,
  onImportCSV,
  isSending,
}) {
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const csvRef = useRef();
  const resumeRef = useRef();

  const handleAdd = () => {
    const ok = onAdd(form.name, form.email, form.company);
    if (ok) setForm({ name: "", email: "", company: "" });
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const handleCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onImportCSV(ev.target.result);
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSender((prev) => ({
        ...prev,
        resume: ev.target.result,
        resumeName: file.name,
      }));
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
  };

  const handleRemoveResume = () => {
    setSender((prev) => ({
      ...prev,
      resume: null,
      resumeName: "",
    }));
  };

  const senderFields = [
    ["name", "Full name"],
    ["role", "Role / title"],
    ["linkedin", "LinkedIn URL"],
    ["phone", "Phone"],
  ];

  return (
    <aside className={s.sidebar}>
      {/* Sender details */}
      <section>
        <div className={s.sectionTitle}>Your details</div>
        {senderFields.map(([key, label]) => (
          <div className={s.field} key={key}>
            <label>{label}</label>
            <input
              value={sender[key]}
              onChange={(e) =>
                setSender((prev) => ({ ...prev, [key]: e.target.value }))
              }
            />
          </div>
        ))}

        {/* Resume Upload */}
        <div className={s.field}>
          <label>Resume</label>
          <div className={s.resumeContainer}>
            {!sender.resume ? (
              <label className={s.resumeUpload}>
                <span className={s.resumeBtn}>📎 Attach resume</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  ref={resumeRef}
                  onChange={handleResumeUpload}
                  style={{ display: "none" }}
                />
              </label>
            ) : (
              <div className={s.resumeAttached}>
                <span className={s.resumeFile}>📄 {sender.resumeName}</span>
                <button
                  className={s.resumeRemove}
                  onClick={handleRemoveResume}
                  disabled={isSending}
                  type="button"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HR Contacts */}
      <section>
        <div className={s.sectionTitle}>
          HR contacts <span className={s.count}>({contacts.length})</span>
        </div>

        <div className={s.contactScroll}>
          {contacts.length === 0 ? (
            <div className={s.empty}>No contacts yet — add below.</div>
          ) : (
            contacts.map((c) => (
              <div
                key={c.id}
                className={`${s.contactRow} ${s["row_" + c.status] || ""}`}
              >
                <span className={s.crName}>{c.name}</span>
                <span className={s.crEmail}>{c.email}</span>
                <span className={s.crCo}>{c.company}</span>
                <span className={`${s.crSt} ${STATUS_CLS[c.status]}`}>
                  {STATUS_LABEL[c.status]}
                </span>
                <button
                  className={s.crDel}
                  onClick={() => onRemove(c.id)}
                  disabled={isSending}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        <div className={s.addGrid}>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            onKeyDown={handleKey}
            className={s.addInput}
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            onKeyDown={handleKey}
            className={s.addInput}
          />
          <input
            placeholder="Company"
            value={form.company}
            onChange={(e) =>
              setForm((f) => ({ ...f, company: e.target.value }))
            }
            onKeyDown={handleKey}
            className={s.addInput}
          />
          <button className={s.btnPlus} onClick={handleAdd}>
            +
          </button>
        </div>

        <div className={s.btnRow}>
          <button
            className={s.btnSm}
            onClick={onLoadPreset}
            disabled={isSending}
          >
            Load preset
          </button>
          <label className={s.btnSm}>
            Import CSV
            <input
              type="file"
              accept=".csv"
              ref={csvRef}
              onChange={handleCSV}
              style={{ display: "none" }}
            />
          </label>
          <button
            className={`${s.btnSm} ${s.btnDanger}`}
            onClick={onClear}
            disabled={isSending}
          >
            Clear all
          </button>
        </div>
      </section>

      {/* Settings */}
      <section>
        <div className={s.sectionTitle}>Settings</div>
        <div className={s.field}>
          <label>Delay between emails (seconds)</label>
          <input
            type="number"
            value={delay}
            min={1}
            max={60}
            onChange={(e) => setDelay(Number(e.target.value))}
          />
        </div>
      </section>
      {/* Footer */}
      <section className={s.footer}>
        Made with ❤️ by
        <a
          href="https://www.linkedin.com/in/rajesh-singh1721/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rajesh Singh
        </a>
      </section>
    </aside>
  );
}
