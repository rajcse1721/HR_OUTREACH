import { useState, useCallback, useRef } from "react";

export const DEFAULT_SENDER = {
  name: "Rajesh Singh",
  role: "Java Backend Engineer | 4+ Years at Oracle",
  linkedin: "https://www.linkedin.com/in/rajesh-singh1721/",
  phone: "+91-7764056313",
  resume: null,
  resumeName: "",
};

export const DEFAULT_SUBJECT =
  "Application for Java Developer Role | 4+ Years at Oracle";

export const DEFAULT_BODY = `Hi {{hr_name}},

I hope you are doing well.

I wanted to check if there are any current or upcoming openings for a Java Developer role in your organization. I have 4+ years of experience in backend and full-stack development, currently working with Oracle Cerner, with strong expertise in Java, Spring Boot, Microservices, REST APIs, and React.js.

I have experience building scalable enterprise applications and working in Agile environments, and I am actively exploring opportunities to contribute to product-driven teams.

I have attached my resume for your reference. I would appreciate it if you could consider my profile for any relevant opportunities.

Looking forward to your response.

Best regards,
{{your_name}}
{{your_role}}
{{phone}} | {{linkedin}}`;

export function fillTemplate(str, hr, sender) {
  return str
    .replace(/{{hr_name}}/g, hr.name)
    .replace(/{{company}}/g, hr.company || "your company")
    .replace(/{{your_name}}/g, sender.name)
    .replace(/{{your_role}}/g, sender.role)
    .replace(/{{linkedin}}/g, sender.linkedin)
    .replace(/{{phone}}/g, sender.phone);
}

export function useOutreach() {
  const [sender, setSender] = useState(DEFAULT_SENDER);
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [contacts, setContacts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [delay, setDelay] = useState(3);
  const [serverStatus, setServerStatus] = useState("checking"); // checking | ok | error
  const [serverEmail, setServerEmail] = useState("");
  const sendingRef = useRef(false);

  const addLog = useCallback((type, msg) => {
    const time = new Date().toLocaleTimeString();
    setLogs((l) => [...l, { type, msg, time, id: Date.now() + Math.random() }]);
  }, []);

  const backendBase =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const checkStatus = useCallback(async () => {
    try {
      const r = await fetch(`${backendBase}/status`);
      const d = await r.json();
      if (d.ok) {
        setServerStatus("ok");
        setServerEmail(d.email);
      } else {
        setServerStatus("error");
      }
    } catch (err) {
      console.error("Status fetch failed", err);
      setServerStatus("error");
    }
  }, [backendBase]);

  const addContact = useCallback(
    (name, email, company) => {
      if (!name.trim() || !email.trim()) return false;
      // Check for duplicate email
      if (
        contacts.some(
          (c) => c.email.toLowerCase() === email.toLowerCase().trim(),
        )
      ) {
        return false; // Already exists
      }
      setContacts((c) => [
        ...c,
        {
          id: Date.now() + Math.random(),
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          status: "pending",
        },
      ]);
      return true;
    },
    [contacts],
  );

  const removeContact = useCallback((id) => {
    if (sendingRef.current) return;
    setContacts((c) => c.filter((x) => x.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    if (sendingRef.current) return;
    setContacts([]);
  }, []);

  const updateStatus = useCallback((id, status) => {
    setContacts((c) => c.map((x) => (x.id === id ? { ...x, status } : x)));
  }, []);

  const loadPreset = useCallback(() => {
    const preset = [
      {
        name: "Alex Rivers",
        email: "a.rivers@pixelstream.io",
        company: "PixelStream",
      },
      {
        name: "Jordan Smith",
        email: "jordan@cloudbound.tech",
        company: "CloudBound",
      },
      {
        name: "Taylor Chen",
        email: "t.chen@dataforge.ai",
        company: "DataForge",
      },
      {
        name: "Morgan Vance",
        email: "vance@velox-systems.com",
        company: "Velox Systems",
      },
      {
        name: "Casey Wright",
        email: "casey@nexulabs.dev",
        company: "NexuLabs",
      },
      {
        name: "Riley Quinn",
        email: "r.quinn@starlight-solutions.org",
        company: "Starlight Solutions",
      },
      {
        name: "Skyler Page",
        email: "skyler@orbit-ops.co",
        company: "OrbitOps",
      },
      {
        name: "Jamie Lane",
        email: "j.lane@blueframe.net",
        company: "BlueFrame",
      },
      {
        name: "Dakota Gray",
        email: "d.gray@zenith-apps.io",
        company: "Zenith Apps",
      },
      {
        name: "Peyton Reed",
        email: "reed@ironpulse.com",
        company: "IronPulse",
      },
    ];
    setContacts((c) => [
      ...c,
      ...preset.map((p) => ({
        ...p,
        id: Date.now() + Math.random(),
        status: "pending",
      })),
    ]);
    addLog(
      "w",
      "Preset loaded — replace with real recruiter emails before sending!",
    );
  }, [addLog]);

  const importCSV = useCallback(
    (text) => {
      const lines = text.split("\n").filter((l) => l.trim());
      let added = 0;
      const newContacts = [];
      lines.forEach((line, i) => {
        if (i === 0 && line.toLowerCase().includes("name")) return;
        const parts = line.split(",").map((s) => s.trim().replace(/"/g, ""));
        if (parts.length >= 2 && parts[1].includes("@")) {
          newContacts.push({
            id: Date.now() + i + Math.random(),
            name: parts[0],
            email: parts[1],
            company: parts[2] || "",
            status: "pending",
          });
          added++;
        }
      });
      setContacts((c) => [...c, ...newContacts]);
      addLog("s", `Imported ${added} contacts from CSV.`);
    },
    [addLog],
  );

  const sendAll = useCallback(async () => {
    if (sendingRef.current) return;

    sendingRef.current = true;
    setIsSending(true);

    // Capture pending contacts at START (before any status changes)
    const pendingSnapshot = contacts.filter((c) => c.status !== "sent");

    if (!pendingSnapshot.length) {
      sendingRef.current = false;
      setIsSending(false);
      return;
    }

    sendingRef.current = true;
    addLog(
      "i",
      `Starting campaign — sending ${pendingSnapshot.length} emails directly via Gmail...`,
    );

    let sent = 0;
    let failed = 0;

    // Convert resume to base64 if it exists
    let attachmentData = null;
    if (sender.resume) {
      const binaryString = String.fromCharCode.apply(
        null,
        new Uint8Array(sender.resume),
      );
      attachmentData = {
        data: btoa(binaryString),
        filename: sender.resumeName,
      };
    }

    for (let i = 0; i < pendingSnapshot.length; i++) {
      const hr = pendingSnapshot[i];
      updateStatus(hr.id, "sending");

      const filledBody = fillTemplate(body, hr, sender);
      const filledSubject = fillTemplate(subject, hr, sender);

      try {
        const sendPayload = {
          to: hr.email,
          subject: filledSubject,
          body: filledBody,
        };

        if (attachmentData) {
          sendPayload.attachment = attachmentData;
        }

        const res = await fetch(`${backendBase}/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sendPayload),
        });

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          throw new Error(
            `Unexpected non-JSON response from /send: ${text.substring(0, 300)}`,
          );
        }

        if (!res.ok || data.error) {
          throw new Error(data.error || `Send failed (HTTP ${res.status})`);
        }

        updateStatus(hr.id, "sent");
        sent++;
        addLog("s", `✓ Sent to ${hr.name} <${hr.email}> · ${hr.company}`);
      } catch (err) {
        updateStatus(hr.id, "failed");
        failed++;
        addLog("e", `✗ Failed: ${hr.name} — ${err.message}`);
      }

      if (i < pendingSnapshot.length - 1) {
        await new Promise((r) => setTimeout(r, delay * 1000));
      }
    }

    addLog("i", `Campaign complete — ${sent} sent, ${failed} failed.`);
    sendingRef.current = false;
    setIsSending(false);
  }, [body, subject, sender, delay, addLog, updateStatus, contacts]);

  return {
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
  };
}
