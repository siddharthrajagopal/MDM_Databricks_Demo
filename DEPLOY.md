# Deploy playbook

## 1 · Push to GitHub

You don't have the `gh` CLI installed, so we'll create the empty repo on github.com and push manually. (Alternative: install gh from https://cli.github.com and re-run the steps in the bottom appendix.)

### A. Create the empty repo on github.com

1. Go to **https://github.com/new**
2. Repository name: `mdm-databricks-briefing`
3. Visibility: **Private**
4. **Do NOT** initialize with README, .gitignore, or license — we already have those locally.
5. Click **Create repository**.
6. On the next page, copy the **HTTPS** or **SSH** clone URL (you'll see both).

### B. Push from this machine

In a terminal at the project root (`C:\Users\siddharth.rajagopal\Documents\projects\Holcim MDM Scenario`), run **one** of the following — pick HTTPS unless you've set up SSH keys:

**HTTPS** (you'll be prompted for credentials; use a Personal Access Token from github.com/settings/tokens, *not* your password):
```bash
git remote add origin https://github.com/<your-username>/mdm-databricks-briefing.git
git push -u origin main
```

**SSH** (only if `ssh -T git@github.com` already works):
```bash
git remote add origin git@github.com:<your-username>/mdm-databricks-briefing.git
git push -u origin main
```

After the push completes, refresh the GitHub page — you should see all 24 files.

---

## 2 · Deploy to Vercel

### A. One-time Vercel setup

1. Sign in to **https://vercel.com** with GitHub (creates a Vercel account linked to your GitHub identity).
2. When prompted, **install the Vercel GitHub App** and grant it access to the new repo (you can grant per-repo, not org-wide).

### B. Import the project

1. Go to **https://vercel.com/new**.
2. You'll see your GitHub repos. Click **Import** next to `mdm-databricks-briefing`.
3. On the **Configure Project** screen, set these:

| Setting | Value |
|---|---|
| **Framework Preset** | `Vite` *(should auto-detect)* |
| **Root Directory** | **`app`** ← critical, the React app is in a subfolder |
| **Build Command** | `npm run build` *(default — leave alone)* |
| **Output Directory** | `dist` *(default — leave alone)* |
| **Install Command** | `npm install` *(default — leave alone)* |
| **Node.js Version** | 20.x *(default — fine)* |

4. **Environment Variables**: none needed.
5. Click **Deploy**.

The first build takes ~60–90 seconds. Vercel will give you a deploy URL like `mdm-databricks-briefing-<hash>.vercel.app`.

### C. Verify the deploy

Open the URL. You should see:
- Title slide rendering with the K-101 anchor card
- All 5 slides reachable via Back / Next pills at the bottom
- Theme toggle in the top right (sun/moon icon) flips light ↔ dark

If anything looks broken, check the Vercel dashboard → your project → **Deployments** → click the failed deploy → **Build Logs**.

---

## 3 · Continuous deployment

Vercel auto-deploys every push to `main`. Workflow:

```bash
# make changes locally
cd app
npm run dev               # iterate
npm run build             # smoke-test the production build

# commit
cd ..
git add -A
git commit -m "Tweak ArchitectureDiagram spacing"
git push
```

Within ~60s of pushing, Vercel will build a new deployment and update the production URL.

### Preview deployments

Push to a non-main branch and Vercel will create a *preview* URL automatically — separate from production. Useful for sharing draft changes without overwriting the live URL.

---

## 4 · Optional · Custom domain

In Vercel project → **Settings → Domains** → add a domain. Vercel walks you through DNS records (CNAME or A). Free Vercel plans support custom domains; HTTPS is automatic via Let's Encrypt.

---

## 5 · Optional · Password-protect the deployment

The deploy URL is public by default — anyone with the link can view it. Vercel's **Password Protection** is a paid (Pro+) feature. If you need to keep the deck behind a password on a free plan, options:

- Move the repo's GitHub team to Vercel's Pro plan and enable Password Protection in Settings → Deployment Protection.
- Self-host the static `dist/` output behind your own auth (e.g., Cloudflare Pages with Cloudflare Access, internal SharePoint, etc.).

---

## Appendix · If you install gh CLI later

Once `gh` is installed and authenticated (`winget install --id GitHub.cli` then `gh auth login`), the GitHub-side flow becomes one command from this directory:

```bash
gh repo create mdm-databricks-briefing --private --source=. --remote=origin --push
```

That replaces sections 1A and 1B above.
