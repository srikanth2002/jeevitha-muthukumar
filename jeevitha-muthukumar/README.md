# 🌸 Jeevitha & Muthukumar — React Digital Invitation

A complete, mobile-responsive **React (Vite)** Tamil baby-shower / valaikappu website, with a live countdown, flower animation, an original instrumental sample, mute/unmute & song picker, share and calendar actions, and scrolling clickable wish cards.

## 1. Start on a Windows laptop

Open **Command Prompt** and run:

```bat
cd /d D:\jeevitha-baby-shower-react
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). To test a production build:

```bat
npm run build
npm run preview
```

If unzipping from the supplied ZIP, first extract the **whole project folder** to `D:\`.

## 2. Make wishes public to everyone (Google Sheets)

The sample works immediately without a backend, **but its preview wishes are stored only in that browser**. To share wishes between everyone:

1. Go to **Google Sheets** → create a new blank spreadsheet, e.g. **Jeevitha Wishes**.
2. Choose **Extensions → Apps Script**.
3. Replace the script with the complete contents of `backend/Code.gs`; click **Save**.
4. From the Apps Script editor, select the `setup` function and click **Run** once. Accept the permissions for access to **your own Google Sheet**. This creates the `Wishes` sheet.
5. Select **Deploy → New deployment → Select type: Web app**.
6. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy**; copy the **Web app URL ending in `/exec`**. This makes the link publicly writable. Monitor the sheet, and keep your spreadsheet itself private.
7. In this React folder copy `.env.example` to `.env`, then set:

   ```env
   VITE_WISHES_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

8. Restart `npm run dev`. **Public wishes** now refresh about every **20 seconds**; a submitted wish is verified by checking the Sheet before success is shown.
9. For deploying at Vercel, add the same variable under **Project Settings → Environment Variables**, then redeploy.

**Moderation:** Each new message appears immediately with `Approved = YES`. To remove a public wish, open the Sheet, change that row's `Approved` cell to `NO`; it disappears upon refresh. Visitors are told their wish is visible publicly, and only the name and message are collected. The public endpoint is intentionally accessible to guests. It uses basic input validation and duplicate detection but **does not include strong anti-spam protection**; for broader publicity, add CAPTCHA/server-side moderation before launch.

**Important:** If you change `Code.gs` after publishing, deploy a **new version** from **Manage deployments → Edit → Version: New version**. Otherwise the published web app still runs old code.

## 3. Tamil music / song controls

The provided `/public/music/soft-melody.wav` is a short, **original demo instrumental**. It is **not** a commercial Tamil film song. The browser won't autoplay sound without a user gesture; visitors tap Play in the bottom music bar to start. `Mute` leaves playback running silently, and the music bar stays visible while scrolling.

When the family selects its song, add an MP3 you have permission to publish into `public/music/`, e.g. `our-song.mp3`, and change `src/musicConfig.js`:

```js
export const PLAYLIST = [
  { id: 'song1', title: 'எங்கள் இனிய பாடல்', subtitle: 'தமிழ் பாடல்', src: '/music/our-song.mp3' },
];
```

For multiple songs, add multiple entries and choose using the music dropdown. **Do not upload a copyrighted movie recording to a public site without the necessary rights.**

## 4. Content changes

- **Event information**: `src/eventData.js`
- **Music**: `src/musicConfig.js` + `public/music/`
- **Appearance and animations**: `src/styles.css`
- **All React interactions**: `src/App.jsx`
- **Original QR** from the provided invitation: `public/venue-qr.png` (retained without altering the QR data).

The countdown targets **19 October 2026, 12:00 PM IST** and automatically switches to a celebration greeting at/after the start. Calendar event runs 12:00–15:00 as an **illustrative calendar block**, not a claimed official end time.

The maps action searches for the hall by name/address; **verify that it points to the right venue** before sharing. The original QR is shown separately so the original poster QR can still be scanned.

## 5. Publish on Vercel

Import the project as a GitHub repository or upload via Vercel CLI after login; framework Vite, build command `npm run build`, output directory `dist`. Configure `VITE_WISHES_SCRIPT_URL` as noted above. The invitation itself is static; the public Google Apps Script web app writes and reads wishes.

## Notes

- This is an invitation website, not a native app. All React code is client-side and readable by visitors via browser developer tools; public websites cannot hide distributed frontend source code completely.
- Wish-submission feedback confirms online saving only after the message is seen again in the shared Sheet.
- No analytics or tracking SDK is included.
- Event text is copied from the source invitation data; please review Tamil spelling, family names, venue and location with the family before launch.

## 6. Updated scroll-by-scroll family story

- Each section has its own full/near-full screen story layout; scrolling reveals it with fade, blur and rising motion. Scroll snapping is gentle (`proximity`), so guests can still read long messages and forms.
- A floating vertical dot navigator lets visitors jump to the opening, couple, family, countdown, venue, wishes or parents.
- **New semi-realistic anime illustration assets:** `public/art/anime-mother.webp`, `anime-couple.webp`, `anime-family.webp`. These are concept drawings, not portraits of actual family members.
- More couple/family scenes can be edited in `src/App.jsx` (`CoupleScene` and `FamilyScene`).
- Guests with reduced-motion settings see the whole site without reveal/motion effects.
