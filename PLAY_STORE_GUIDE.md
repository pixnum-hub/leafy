# Leafy — Play Store Deployment Guide v2.0
© Manik Roy 2026. All Rights Reserved.

---

## Complete PWA File Package

| File | Purpose |
|---|---|
| `index.html` | Main app (ready — do not rename) |
| `manifest.json` | PWA identity, icons, shortcuts |
| `sw.js` | Service worker v2.0.0 — offline support |
| `capacitor.config.json` | Android/Capacitor build config |
| `icon-72.png` → `icon-512.png` | All 8 required icon sizes |
| `favicon.ico` | Browser tab icon |

---

## What's in v2.0 (Latest)

- ✅ 42 plants (including 7 Indian plants: Tulsi, Curry Leaf, Neem, Mogra, Ashwagandha, Chilli, Lemon)
- ✅ AI Photo Diagnosis (Claude Vision — camera + gallery)
- ✅ Disease Finder — 25 diseases, 22 symptoms
- ✅ Soil Mix Calculator with exact gram/litre quantities
- ✅ Fertiliser Dilution Calculator (full/half/quarter strength)
- ✅ Watering Tracker with localStorage persistence
- ✅ Plant Cost Tracker
- ✅ Propagation Guide (5 methods, step-by-step)
- ✅ Seasonal Care Tips
- ✅ 4 Themes: Dark, Light, OLED, High Contrast
- ✅ System sans-serif fonts (no external font loading)
- ✅ Full offline support via Service Worker v2.0.0

---

## Method 1 — PWABuilder (Easiest, ~10 minutes)

1. Create a folder: `leafy/`
2. Copy ALL files from this package into `leafy/`
3. Drag the folder onto https://app.netlify.com/drop
4. You get a URL like `https://leafy-abc123.netlify.app`
5. Go to https://www.pwabuilder.com → paste URL → Start
6. Click **Package for stores → Google Play Store**
7. Package ID: `com.manikroy.leafy` | App name: `Leafy`
8. Download `.aab` file → upload to Google Play Console

---

## Method 2 — Capacitor + Android Studio

```bash
mkdir leafy-app && cd leafy-app
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android
mkdir www
# Copy ALL package files into www/
npx cap init "Leafy" "com.manikroy.leafy" --web-dir www
npx cap add android
npx cap sync
npx cap open android
```

In Android Studio:
**Build → Generate Signed Bundle/APK → Android App Bundle → Release**

---

## Play Store Listing (Ready to paste)

**App name:** Leafy — Plant Care Guide

**Short description (80 chars):**
AI plant diagnosis, 42 plants, disease finder & soil calculator.

**Full description:**
Leafy is your complete plant care companion — from daily watering to expert soil mixing, fertiliser dosing and AI-powered disease diagnosis.

🌿 42 PLANTS including 7 Indian varieties:
Tulsi, Curry Leaf, Neem, Mogra, Ashwagandha, Chilli Pepper, Lemon Tree — plus Monstera, Orchids, Succulents, Herbs and more.

📸 AI PHOTO DIAGNOSIS:
Point your camera or upload a photo — Claude AI identifies diseases, gives 5-step remedies and urgency rating.

🔬 DISEASE FINDER:
Select from 22 symptoms to identify 25 plant diseases with causes, remedies and prevention tips.

🪨 SOIL MIX CALCULATOR:
Enter pot size in cm — get exact ingredient quantities in litres and grams for each plant's ideal mix.

🧪 FERTILISER CALCULATOR:
Get full-strength, half-strength and quarter-strength dilution doses for any jug size.

💧 WATERING TRACKER:
Add your plants, tap Watered — app tells you exactly when to water next.

✂️ PROPAGATION GUIDE:
5 methods: Stem Cutting, Leaf Cutting, Root Division, Offsets, Water Propagation.

💰 COST TRACKER:
Log plant and gardening expenses by category with running total.

📱 DESIGNED FOR MOBILE:
Works fully offline. No account needed. No ads. No subscriptions.
4 themes: Dark, Light, OLED True Black, High Contrast.

**Category:** Lifestyle
**Content rating:** Everyone
**Privacy policy:** https://www.privacypolicygenerator.info

---

## App Signing — CRITICAL
Store your `.keystore` file and password permanently.
Loss = cannot update app on Play Store ever again.
Backup to: Google Drive + USB drive + Password manager.
