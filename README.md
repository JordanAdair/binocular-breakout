# Binocular Breakout

## What Is This?

Dichoptic therapy presents different visual information to each eye to encourage binocular cooperation and reduce suppression.

This game is designed to be played with **red/blue anaglyph glasses**, allowing critical gameplay elements (paddle, ball, bricks) to be tuned so that both eyes are required to play successfully.

> ⚠️ This project is **not a medical device** and makes no clinical claims.

---

## Features

- Browser-based — no installation required
- Classic Breakout-style gameplay
- Live color customization for paddle and ball
- Adjustable game scale to change visual difficulty
- Settings persist automatically using Local Storage
- Built with a clean separation between game logic and rendering

---

## How Dichoptic Rendering Works

Using red/blue anaglyph glasses, each eye perceives different color channels.

By adjusting colors and contrast:

- The weaker eye can be emphasized
- The dominant eye can be de-emphasized
- Successful play requires binocular cooperation

All rendering uses solid colors with no gradients to avoid channel leakage.

---

## Tech Stack

- React (UI only)
- TypeScript
- HTML5 Canvas (game loop & rendering)
- Vite
- Local Storage for settings persistence
  
---

## Disclaimer

This project is for personal and experimental use only. It is not intended to diagnose, treat, or cure any medical condition.

---
