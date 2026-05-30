# 🔥 Firebase Setup Guide — Yara vs Ali Multiplayer

Setting up real-time multiplayer takes about **10 minutes**. Follow these steps exactly.

---

## STEP 1 — Create a Firebase Project

1. Go to **https://console.firebase.google.com**
2. Click **"Add project"**
3. Enter a project name: `yara-vs-ali` (or anything you like)
4. Disable Google Analytics (not needed) → click **"Create project"**
5. Wait ~30 seconds → click **"Continue"**

---

## STEP 2 — Enable Realtime Database

1. In the left sidebar, click **"Build"** → **"Realtime Database"**
2. Click **"Create Database"**
3. Choose your region: **United States (us-central1)** is fine
4. For Security Rules, choose **"Start in test mode"** → click **"Enable"**

> ⚠️ Test mode allows open read/write for 30 days. This is fine for personal use.

---

## STEP 3 — Get Your Config

1. Click the **gear icon ⚙** next to "Project Overview" → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **"</>"** web icon to add a web app
4. Enter an app nickname: `yara-vs-ali`
5. **Do NOT** check Firebase Hosting
6. Click **"Register app"**
7. You'll see a code block like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.firebaseio.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

8. Copy this entire block — you'll need the values in the next step.

---

## STEP 4 — Add Config to Your Game

1. Open the file **`script.js`** in a text editor (Notepad, VS Code, etc.)
2. Find these lines near the top of the file:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "REPLACE_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL:       "https://REPLACE_WITH_YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId:             "REPLACE_WITH_YOUR_APP_ID"
};
```

3. Replace each `REPLACE_WITH_...` value with the actual values from your Firebase config
4. Save the file

---

## STEP 5 — Upload to GitHub Pages

If you haven't deployed yet:

1. Create a GitHub account at **https://github.com**
2. Create a new **public** repository called `yara-vs-ali`
3. Upload all files: `index.html`, `style.css`, `script.js`, `SETUP.md`
4. Go to **Settings → Pages → Source: main branch → Save**
5. Your game is live at: `https://YOUR-USERNAME.github.io/yara-vs-ali/`

If you've already deployed and are **updating** the config:
1. Go to your GitHub repository
2. Click `script.js` → click the **pencil (edit) icon**
3. Find the `FIREBASE_CONFIG` block and update it
4. Scroll down → click **"Commit changes"**
5. Wait 1–2 minutes → refresh your game

---

## HOW TO PLAY ON TWO PHONES

```
Phone 1 (e.g. Yara)            Phone 2 (e.g. Ali)
────────────────────            ────────────────────
1. Open the game link
2. Tap "Begin the Game"
3. Tap "Create Game"
4. Enter your name + emoji
5. Tap "I'm Ready"
6. See the Room Code: ABC123
7. Share the link with Ali  →   8. Ali opens the link
                                9. Tap "Join Game"
                               10. Code auto-fills → "Join"
                               11. Enter name + emoji
                               12. Tap "I'm Ready"

Both phones automatically enter the game! 🎉
```

---

## TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Room not found" | Make sure the code is correct (6 characters, no spaces) |
| Game doesn't sync | Check Firebase config values — copy them exactly |
| "Firebase not configured" warning | You still have REPLACE placeholders in script.js |
| Both joined but game won't start | Try refreshing both phones |
| Partner shows as offline | They may have locked their phone — ask them to tap the screen |

---

## DATABASE SECURITY (Optional)

After your 30-day test window, update your Firebase Realtime Database rules:

```json
{
  "rules": {
    "rooms": {
      "$roomId": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['p1', 'game'])"
      }
    }
  }
}
```

Set these in **Firebase Console → Realtime Database → Rules → Edit → Publish**

---

*Enjoy the game! ♥*
