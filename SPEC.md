# Dental Horoscope Card Game - Specification

## Overview
A web-based card game integrated with LINE Official Account via LIFF (LINE Front-end Framework). Players draw a card from a deck of 23 "Dental Horoscopes," each providing a unique mission related to dental hygiene.

## Core Mechanics
- **Card Deck**: 23 unique dental-themed horoscope cards.
- **Global Constraint**: No two players can draw the same card on the same calendar day (UTC/Local sync).
- **Personal Constraint**: A player cannot draw the same card twice until they have drawn all 23 cards (at which point their personal history resets).
- **Reset Logic**: 
  - The shared global pool for the day resets if all 23 cards have been drawn by various players.
  - The global pool also resets at the start of a new day.
- **Result Display**: The mission is displayed in the chat (via LIFF Send Messages) and in the app UI.
- **Admin View**: Admins can view results to provide extra information or guidance.

## Architecture
- **Frontend**: React (Vite) + Tailwind CSS + Framer Motion.
- **Backend**: Express.js (serving the LIFF app and API).
- **Database**: Firebase Firestore (for real-time global state and user history).
- **Authentication**: LINE Login (handled via LIFF SDK).

## Data Models (Firestore)

### `globals/daily_deck`
- `date`: `string` (YYYY-MM-DD)
- `pickedCardIds`: `string[]`
- `totalCards`: `number` (23)

### `users/{userId}`
- `displayName`: `string`
- `pickedCardsHistory`: `string[]` (All-time history for duplicate prevention)
- `lastPickedAt`: `timestamp`
- `lastMissionId`: `string`

### `missions` (Static/Ready-only)
- `id`: `string`
- `title`: `string`
- `content`: `string`
- `extraInfo`: `string` (For admin reference)

## User Flow
1. **QR Scan**: User scans a QR code that opens the LIFF app.
2. **LIFF Init**: App initializes, checks LINE authentication.
3. **Card Selection**: User sees a deck of cards. Remaining available cards for the day are shown (or just a generic deck visual).
4. **Draw Card**:
   - Backend/Client calculates available cards (Global Availability AND Personal Uniqueness).
   - If no cards are available (all 23 picked today or user has picked all remaining today), trigger a reset or show "Full" status.
5. **Animation**: A card is flipped/drawn using `framer-motion`.
6. **Result**: Display mission details and a "Send to Chat" button (or auto-send if permissions allow).
7. **Social Sharing**: User can share their horoscope with the official account.

## Technical Requirements
- LINE Developers Account (LIFF ID).
- Firebase Project (Firestore enabled).
- Node.js environment.

## Design
- **Theme**: Mystical, Cosmic, but with Dental elements (teeth, brushes, stars).
- **Colors**: Deep purples, Golds, and Clean Teal.
- **Interaction**: Intuitive card dragging/tapping.
