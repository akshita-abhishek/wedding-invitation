# Akshita & Abhishek — Wedding Invitation

An illustrated, interactive wedding invitation with a gold seal and six turning pages: welcome, family invitation, Haldi, Sangeet, Baraat & Reception, and a floral closing note from the families.

**Website:** https://akshita-abhishek.github.io/wedding-invitation/

| Celebration | Date | Time | Venue |
| --- | --- | --- | --- |
| Haldi | 25 November 2026 | 2:00 PM | Hari Niwas Palace |
| Sangeet | 25 November 2026 | 7:00 PM | Hari Niwas Palace |
| Baraat & Reception | 26 November 2026 | 1:00 PM | Hari Niwas Palace |

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, including `/wedding-invitation/`. Development mode stays silent for testing; production builds retain the invitation’s background music.

```sh
npm run build
npm run preview
```

## Publishing

GitHub Actions builds and publishes `dist/` to GitHub Pages on every push to `main`. In the repository's **Settings → Pages**, the publishing source must be **GitHub Actions**.

The site is fully static and does not require a database, server, login, or API keys. RSVP collection is not included.

The repository path is configured in `vite.config.ts`. Update `base` if the repository name changes; use `/` when configuring a custom domain.

## Editing the invitation

- Family names and page order: `src/App.tsx`
- Closing message and floral styling: `src/components/closing-invitation.tsx` and its accompanying CSS
- Event dates, times, and venue: `src/components/illustrated-event.tsx`
- Page turning and swipe behavior: `src/components/invitation-book.tsx`
- Styling: `src/app/`
- Artwork: `public/images/`
- Dress codes: `src/components/illustrated-event.tsx`
- Background music configuration: `src/lib/music-config.ts`

The background music uses the supplied “Ishq Hai” clip in `public/audio/ishqhai.m4a`, with its first three nearly silent seconds removed and the web copy optimized for streaming (about 87 seconds, 128 kbps AAC). Its URL in `src/lib/music-config.ts` includes `import.meta.env.BASE_URL` so it works on GitHub Pages; the version query refreshes previously cached audio. Audio preloads while the seal is displayed, starts on the seal tap, and loops across page turns. There are no guest music controls. If playback is blocked or interrupted, it retries on the next guest tap or keypress after opening the seal. Browsers may limit preloading, so an immediate tap on a slow connection can still need buffering. Set `backgroundMusicUrl` to `null` to disable music.

Guests can swipe left or right, use the navigation buttons, or use the keyboard arrow keys. Links ending in `#haldi`, `#sangeet`, `#wedding`, or `#closing` open the corresponding page after the seal. Navigation shows page numbers without repeated visible page titles. Decorative animations automatically respect the device's reduced-motion preference.
