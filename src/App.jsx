import React, { useState, useEffect, useCallback, useRef } from "react";
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import StatsBar from "./components/StatsBar.jsx";
import Compose from "./components/Compose.jsx";
import Preview from "./components/Preview.jsx";
import ActivityLog from "./components/ActivityLog.jsx";
import SetupGuide from "./components/SetupGuide.jsx";
import ActionBar from "./components/ActionBar.jsx";
import { useOutreach } from "./useOutreach.js";
import s from "./App.module.css";

const TABS = [
  { id: "compose", label: "Compose" },
  { id: "preview", label: "Preview" },
  { id: "log", label: "Activity Log" },
  { id: "setup", label: "Setup Guide" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("compose");
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [theme, setTheme] = useState("light");
  const isResizingRef = useRef(false);

  const {
    sender,
    setSender,
    subject,
    setSubject,
    body,
    setBody,
    contacts,
    logs,
    isSending,
    delay,
    setDelay,
    serverStatus,
    serverEmail,
    checkStatus,
    addContact,
    removeContact,
    clearAll,
    loadPreset,
    importCSV,
    sendAll,
  } = useOutreach();

  const [appError, setAppError] = useState(null);

  useEffect(() => {
    checkStatus();
    const id = setInterval(checkStatus, 15000);
    return () => clearInterval(id);
  }, [checkStatus]);

  useEffect(() => {
    const handleError = (event) => {
      console.error("window error", event.error || event.message);
      setAppError(event.error?.message || event.message || "Unknown error");
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", (ev) => {
      console.error("unhandled rejection", ev.reason);
      setAppError(ev.reason?.message || String(ev.reason));
    });

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  /* Track progress from contacts */
  useEffect(() => {
    if (!isSending) return;
    const total =
      contacts.filter((c) => c.status !== "pending").length === 0
        ? contacts.length
        : contacts.length;
    const done = contacts.filter(
      (c) => c.status === "sent" || c.status === "failed",
    ).length;
    setProgress({ done, total: contacts.length });
  }, [contacts, isSending]);

  /* Auto-switch to log tab when sending starts */
  useEffect(() => {
    if (isSending) setActiveTab("log");
  }, [isSending]);

  const handleSendAll = useCallback(() => {
    if (isSending) return;
    setProgress({
      done: 0,
      total: contacts.filter((c) => c.status !== "sent").length,
    });
    sendAll();
  }, [sendAll, contacts, isSending]);

  const handleMouseDown = useCallback((e) => {
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizingRef.current) return;
    const newWidth = e.clientX;
    if (newWidth >= 200 && newWidth <= 600) {
      setSidebarWidth(newWidth);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div className={`${s.root} ${theme === "dark" ? "dark" : ""}`}>
      {appError && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "rgba(220,20,60,0.9)",
            color: "white",
            padding: "12px",
            fontSize: "12px",
          }}
        >
          <strong>App error:</strong> {appError}
        </div>
      )}
      <Header
        status={serverStatus}
        email={serverEmail}
        theme={theme}
        onToggleTheme={() =>
          setTheme((t) => (t === "light" ? "dark" : "light"))
        }
      />

      <div className={s.layout}>
        <div className={s.sidebar} style={{ width: sidebarWidth }}>
          <Sidebar
            sender={sender}
            setSender={setSender}
            contacts={contacts}
            delay={delay}
            setDelay={setDelay}
            onAdd={addContact}
            onRemove={removeContact}
            onClear={clearAll}
            onLoadPreset={loadPreset}
            onImportCSV={importCSV}
            isSending={isSending}
          />
        </div>
        <div className={s.resizer} onMouseDown={handleMouseDown}></div>
        <div className={s.right}>
          <StatsBar contacts={contacts} />

          {/* Tab strip */}
          <div className={s.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`${s.tab} ${activeTab === tab.id ? s.tabActive : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.id === "log" && logs.length > 0 && (
                  <span className={s.logBadge}>{logs.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className={s.tabContent}>
            {activeTab === "compose" && (
              <Compose
                subject={subject}
                setSubject={setSubject}
                body={body}
                setBody={setBody}
              />
            )}
            {activeTab === "preview" && (
              <Preview
                contacts={contacts}
                subject={subject}
                body={body}
                sender={sender}
              />
            )}
            {activeTab === "log" && <ActivityLog logs={logs} />}
            {activeTab === "setup" && <SetupGuide />}
          </div>

          <ActionBar
            contacts={contacts}
            isSending={isSending}
            onSend={handleSendAll}
            progress={progress}
          />
        </div>
      </div>
    </div>
  );
}
