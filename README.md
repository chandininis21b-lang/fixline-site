# Fixline — AI IT Support Site

A static, professional front end for an AI IT-support agent. Ships with a working demo
chat (simulated locally) and a clear hook for wiring in a real **Salesforce Agentforce**
agent.

Files:
- `index.html` — page structure
- `styles.css` — all styling
- `script.js` — demo chat logic + the spot to connect Agentforce

---

## 1. Open and run it in VS Code

1. Install [VS Code](https://code.visualstudio.com/) if you don't have it.
2. Unzip/copy this folder somewhere on your machine, e.g. `~/projects/fixline`.
3. In VS Code: **File → Open Folder…** → select `fixline`.
4. Install the **Live Server** extension (by Ritwick Dey) from the Extensions panel
   (`Ctrl+Shift+X` / `Cmd+Shift+X`, search "Live Server").
5. Right-click `index.html` in the file explorer → **Open with Live Server**.
   Your browser opens `http://127.0.0.1:5500` and the site is live locally, with
   auto-reload on save.

No build step, no `npm install` — it's plain HTML/CSS/JS.

---

## 2. Connect it to your real Agentforce agent

Right now `script.js` fakes a reply in `getAgentReply()` so the demo works without any
setup. To make it real, you have two solid options:

### Option A — Salesforce Embedded Messaging (fastest, official)
This is Salesforce's own widget for putting an Agentforce/Messaging agent on any website.

1. In **Salesforce Setup**, go to **Embedded Service → Embedded Service Deployments**
   (or **Messaging for In-App and Web** if your org is on the newer console) and create
   a deployment pointed at your Agentforce service agent.
2. Salesforce generates a snippet that looks like this — copy yours exactly, it contains
   your org-specific IDs:

   ```html
   <script type="text/javascript">
     window.embeddedservice_bootstrap = {};
     // ... Salesforce fills in your orgId, deploymentId, and URLs here
   </script>
   <script type="text/javascript"
     src="https://YOUR-DOMAIN.my.salesforce.com/embeddedservice/5.0/esw.min.js">
   </script>
   ```

3. Paste that snippet just before `</body>` in `index.html`.
4. Salesforce's widget renders its own chat bubble/window — you can either let it float
   on the page as-is, or hide the custom `.chat-widget` demo block in `index.html` and
   trigger Salesforce's widget from the "Report an issue" button instead.

This route needs zero custom API code — Salesforce hosts the connection to your agent.

### Option B — Call Agentforce from your own backend (more control)
If you want the custom chat UI already built in this page (the `#chatWidget` section) to
talk to Agentforce directly:

1. You'll need a small backend (Node/Express, a Salesforce Connected App, or a
   middleware service) because Agentforce's API requires OAuth credentials that must
   **never** be exposed in browser JavaScript.
2. That backend calls the Agentforce/Salesforce Conversational API with your credentials
   and returns just the reply text to the browser.
3. In `script.js`, replace the body of `getAgentReply()`:

   ```js
   async function getAgentReply(userText) {
     const res = await fetch('https://your-backend.example.com/api/agent', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ message: userText })
     });
     const data = await res.json();
     return data.reply;
   }
   ```   orgfarm-17a6526ff8-dev-ed.develop.my.salesforce.com

4. Build the `/api/agent` endpoint on your backend to forward to Salesforce and return
   `{ reply: "..." }`.

**Use Option A unless you specifically need a fully custom chat UI** — it's less code
and Salesforce maintains it for you.

---

## 3. Make it public

Since this is a static site (no server-side code), any static host works. Three easy
options:

### Netlify (drag-and-drop, no git needed)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag the whole `fixline` folder onto the page.
3. Netlify gives you a live public URL in seconds (e.g. `fixline-123.netlify.app`).
4. Optional: add a custom domain under **Site settings → Domain management**.

### GitHub Pages (free, good if you're already using git)
1. Create a new repo on GitHub, e.g. `fixline-site`.
2. In VS Code's terminal, from the project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/fixline-site.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages** → Source: `main` branch, `/ (root)` folder → Save.
4. Your site goes live at `https://YOUR-USERNAME.github.io/fixline-site/`.

### Vercel
1. Install the CLI: `npm i -g vercel`.
2. From the project folder, run `vercel` and follow the prompts.
3. Vercel deploys it and gives you a public URL immediately, plus a new one on every
   future `vercel --prod`.

Any of these three gets you a public HTTPS link you can share with users right away.

---

## 4. Suggested next steps

- Swap the placeholder copy/stats in `index.html` for your real numbers.
- Add your company logo in place of the `.brand-mark` gradient square.
- If you go with Option A above, remove or repurpose the custom `#chatWidget` section
  so users aren't looking at two chat boxes.
