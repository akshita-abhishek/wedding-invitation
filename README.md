# Akshita & Abhishek — Wedding Invitation

An illustrated, interactive wedding invitation with a gold seal and five turning pages: welcome, family invitation, Haldi, Sangeet, and Wedding.

**Website:** https://akshita-abhishek.github.io/wedding-invitation/

| Celebration | Date | Time | Venue |
| --- | --- | --- | --- |
| Haldi | 25 November 2026 | 2:00 PM | Hari Niwas Palace |
| Sangeet | 25 November 2026 | 7:00 PM | Hari Niwas Palace |
| Wedding | 26 November 2026 | 1:00 PM | Hari Niwas Palace |

## Run locally

Use Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite, including `/wedding-invitation/`.

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
- Event dates, times, and venue: `src/components/illustrated-event.tsx`
- Page turning and swipe behavior: `src/components/invitation-book.tsx`
- Styling: `src/app/`
- Artwork: `public/images/`
- Dress codes: `src/components/illustrated-event.tsx`
- Background music configuration: `src/lib/music-config.ts`

The background music player is prepared for “Ishq Hai” from Mismatched Season 3 and remains disabled until its audio file is supplied. Set `backgroundMusicUrl` in `src/lib/music-config.ts` to enable it. For an audio file in `public/audio/`, prefix its path with `import.meta.env.BASE_URL` so it works on GitHub Pages. Enabled music starts when a guest opens the seal. The small music control pauses or resumes it without affecting the animations, and the same player stays mounted across page turns. Audio is loaded only after interaction; if a browser blocks playback, the guest can tap the music control to start it.

Guests can swipe left or right, use the navigation buttons, or use the keyboard arrow keys. Links ending in `#haldi`, `#sangeet`, or `#wedding` open the corresponding page after the seal. Decorative animations automatically respect the device's reduced-motion preference.
