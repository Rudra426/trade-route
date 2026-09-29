# Trade Routes: Cities of Antiquity

**Submission for Smart India Hackathon 2026**
**Problem Statement:** SIH26208 (Toys and games based on our civilization, history, and culture)

**Trade Routes: Cities of Antiquity** is a modern, multiplayer, web-based board game heavily inspired by classic property-trading mechanics. However, it replaces the modern industrial theme with a rich, immersive journey through Ancient Indian history. Players take on the roles of legendary merchants traversing the subcontinent—from the Grand Bazaar to Pataliputra—buying territories, upgrading them into Grand Palaces, trading with rivals, and navigating unexpected caravan events.

---

## 📜 Concept & Core Gameplay

At its heart, *Trade Routes* is a game of economic strategy, negotiation, and luck. You start with a modest purse of gold and must navigate the outer rim of the board by rolling dice. 

**The goal is simple:** Amass wealth, build an empire of trade halls and palaces, and bankrupt your competitors while learning about India's rich heritage.

### What it does:
- **Territory Acquisition**: Land on unowned historical cities (like Mathura, Taxila, or Kashi) and purchase them.
- **Toll Collection**: If another merchant lands on your territory, they must pay a toll based on the property's development level.
- **Empire Building**: Collect a full color-group of territories to unlock the ability to construct upgrades (Workshop → Warehouse → Trade Hall → Caravanserai → Grand Palace).
- **The Caravan Events**: Land on "Event" spaces to draw cards that can instantly shift the balance of power (e.g., discovering hidden treasure, paying royal taxes, or being forced to relocate).
- **Detention**: Beware the King's Guards! Rolling three doubles or landing on specific spaces will send you to Detention, freezing your movement until you pay a fine or roll doubles.

### When it does it (The Turn Loop):
1. **Pre-Roll Phase**: Before moving, you can manage your empire (mortgage properties to free up liquid gold, build upgrades) or propose complex trade agreements to other players (or AI).
2. **Action Phase**: Roll the 3D physics-based dice and move your token across the board.
3. **Resolution Phase**: Handle the consequences of the space you landed on (Buy, Pay Toll, Draw Card, Pay Tax).
4. **Post-Action Phase**: Conclude your turn and pass the dice to the next merchant.

---

## 🛠️ Tech Stack

This project was built from the ground up using a modern, highly responsive, and real-time capable web stack.

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) & React 19
- **Language**: TypeScript (Strict typing for game engine state and event payloads)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
  - Uses a heavily customized bespoke theme tailored to the Ancient Indian aesthetic (Terracotta `#e7d5b3`, Leather Brown `#5c3a21`, and deep sandstone textures).
- **UI Components**: Built on top of [Base UI](https://base-ui.com/) and Shadcn UI primitives for accessible structural components.
- **Animations**: CSS 3D Transforms for interactive cards and [Framer Motion](https://www.framer.com/motion/) for smooth token gliding.

### State Management & Multiplayer
- **Game Engine**: [Zustand](https://zustand-demo.pmnd.rs/) manages the complex, deeply nested single source of truth for the game.
- **Realtime Sync**: [Supabase Realtime](https://supabase.com/docs/guides/realtime) channels.
  - The Zustand store state is seamlessly broadcasted and synchronized across all clients in the room via Supabase Postgres Changes.
  - Includes robust **Optimistic Concurrency Control** via a strict version counter to prevent race conditions during simultaneous lobby joins and state syncs.

---

## ✨ Features & Recent Updates

- **Multilingual Support (EN / हिन्दी)**: Full localization system built-in! Switch seamlessly between English and Hindi for all UI elements, historical facts, and modal dialogues. 
- **Interactive Educational Cards**: Property cards feature a smooth 3D flip transform. Tapping any property on the board flips the card to reveal historical facts and context about the ancient city.
- **Robust Multiplayer**: Built with state synchronization that accounts for race conditions, dropped packets, and out-of-order payloads using an internal version tracker.
- **Smart AI Opponents**: Fill the lobby with AI merchants that evaluate trade fairness, manage their properties, and take their turns automatically.
- **Advanced Trade Engine**: Propose custom combinations of properties and gold to your rivals.
- **Thematic Design**: Rich aesthetic with parchment textures, cinematic hero backgrounds, and an immersive user interface.

---

## 🚀 Getting Started Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   You will need a Supabase project for the realtime multiplayer to function.
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *Note: In production, ensure you have set up Row Level Security (RLS) in Supabase. See `supabase_rls_proposal.md` for policy recommendations.*

3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Play!**
   Open [http://localhost:3000](http://localhost:3000) in your browser. Click "Begin Journey", enter a Merchant Name, and create a room!

---

## 🚀 Deployment Instructions (Vercel)

This project is optimized for deployment on Vercel.

1. Push your code to a GitHub repository.
2. Log into [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. In the environment variables section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**. Vercel will automatically detect Next.js and build the production bundle.
