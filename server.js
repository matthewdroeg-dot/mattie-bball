# Mattie Droeg — Basketball Video Builder

Polished highlight video builder powered by Shotstack + Twelve Labs.

## Stack
- Node.js + Express server (proxy to Shotstack & Twelve Labs)
- Vanilla HTML/CSS/JS frontend
- Deployed on Railway

## Deploy to Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) and sign in with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select this repo
5. Railway auto-detects Node.js and runs `npm start`
6. Your site is live at `yourapp.up.railway.app`

## Environment Variables (set in Railway dashboard)

| Variable | Value |
|---|---|
| `TL_KEY` | Your Twelve Labs API key |
| `TL_INDEX` | Your Twelve Labs index ID |
| `SS_KEY` | Your Shotstack sandbox API key |
| `PORT` | Set automatically by Railway |

## Local development

```bash
npm install
node server.js
```

Open http://localhost:3000
