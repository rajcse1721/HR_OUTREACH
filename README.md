# HR Outreach Tool

**Send personalised HR emails directly from Gmail.**

---

## Project structure

```
hr-outreach-tool/
├── index.html
├── vite.config.js
├── server.js
├── package.json
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.module.css
    ├── index.css
    ├── useOutreach.js
    └── components/
        ├── Header.jsx / .module.css
        ├── Sidebar.jsx / .module.css
        ├── StatsBar.jsx / .module.css
        ├── Compose.jsx / .module.css
        ├── Preview.jsx / .module.css
        ├── ActivityLog.jsx / .module.css
        ├── SetupGuide.jsx / .module.css
        └── ActionBar.jsx / .module.css
```

---

## One-time setup (5 minutes)

### 1. Enable Gmail 2-Step Verification

Go to https://myaccount.google.com/security → 2-Step Verification → Turn On.

### 2. Create a Gmail App Password

Go to https://myaccount.google.com/apppasswords → Select app: **Mail** → Generate.
Copy the 16-character password (looks like: `abcd efgh ijkl mnop`).

### 3. Add your App Password to server.js

Open `server.js` and update:

```js
const GMAIL_USER = "your@gmail.com";
const GMAIL_PASS = "abcdefghijklmnop";
```

### 4. Install dependencies

```bash
npm install
```

---

## Running the app

You need **two terminals** running simultaneously:

**Terminal 1 — Backend (Express)**

```bash
node server.js
```

Runs at http://localhost:3000

**Terminal 2 — Frontend (Vite)**

```bash
npm run dev
```

Runs at http://localhost:5173

Open http://localhost:5173 in your browser.

---

## How to use

1. Your details are pre-filled — update name, role, LinkedIn, phone in the sidebar
2. Add HR contacts (name, email, company) — or import from CSV
3. Edit the email template in the **Compose** tab using `{{tokens}}`
4. Check personalised emails in the **Preview** tab
5. Hit **Send all directly →** — emails go straight from your Gmail

---

## CSV import format

```
Name,Email,Company
Pooja Sharma,pooja@innovaccer.com,Innovaccer
Rahul Mehta,rahul@razorpay.com,Razorpay
```

---

## Tech stack

- **Frontend:** React 18 + Vite 5 + CSS Modules
- **Backend:** Node.js + Express + Nodemailer
- **Email:** Gmail SMTP via App Password (no OAuth, no Google Cloud)
