# Trade Routes: Cities of Antiquity

![Trade Routes Logo / Banner Placeholder]

**Trade Routes: Cities of Antiquity** is a modern, multiplayer, web-based board game heavily inspired by the classic property-trading mechanics of Monopoly. However, it replaces the modern industrial theme with a rich, immersive journey through Ancient Indian history. Players take on the roles of legendary merchants traversing the subcontinent—from the Grand Bazaar to Pataliputra—buying territories, upgrading them into Grand Palaces, trading with rivals, and navigating unexpected caravan events.

---

## 📜 Concept & Core Gameplay

At its heart, *Trade Routes* is a game of economic strategy, negotiation, and luck. You start with a modest purse of gold and must navigate the outer rim of the board by rolling dice. 

**The goal is simple:** Amass wealth, build an empire of trade halls and palaces, and bankrupt your competitors.

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
- **Framework**: [Next.js](https://nextjs.org/) (App Router) & React 19
- **Language**: TypeScript (Strict typing for game engine state and event payloads)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
  - Uses a heavily customized bespoke theme tailored to the Ancient Indian aesthetic (Terracotta `#e7d5b3`, Leather Brown `#5c3a21`, and deep sandstone textures).
- **UI Components**: Built on top of [Base UI](https://base-ui.com/) and Shadcn UI primitives for accessible, unstyled structural components (Dialogs, Modals, Buttons) themed heavily via Tailwind.
- **Animations**: [Framer Motion](https://www.framer.com/motion/) for smooth 3D token gliding, dynamic popup modals, and interactive UI feedback.
- **3D Rendering**: Custom CSS-based 3D transforms for the realistic, physics-simulated dice rolling (`Dice3D.tsx`).

### State Management & Multiplayer
- **Game Engine**: [Zustand](https://zustand-demo.pmnd.rs/) manages the complex, deeply nested single source of truth for the game (handling player balances, property ownership, turn phases, and transaction logs).
- **Realtime Sync**: [Supabase Realtime](https://supabase.com/docs/guides/realtime) channels.
  - The game allows players to spin up unique "Room Codes".
  - The Zustand store state is seamlessly broadcasted and synchronized across all clients in the room via Supabase Postgres Changes and broadcast channels, ensuring every dice roll and trade is instantly reflected on everyone's screen.

---

## ✨ Features

- **Seamless Multiplayer**: Create a room, share a 4-letter code, and play live with friends anywhere in the world.
- **Smart AI Opponents**: Don't have 4 friends? Fill the lobby with AI merchants. The AI has built-in negotiation logic: it evaluates the mathematical fairness of trades, demands massive premiums for handing over monopolies, and takes its turns automatically.
- **Advanced Trade & Diplomacy Engine**: A fully featured trading modal that allows you to offer custom combinations of properties and gold in exchange for a rival's assets.
- **Property Management (Mortgages & Upgrades)**: Need quick cash? Mortgage your properties for half their value. Once you own a monopoly, strategically invest your gold to build up to Grand Palaces and skyrocket the rent.
- **Thematic Sound Design**: Integrated audio hooks trigger coin clinks, building hammers, and scroll-unfurling sounds to enhance the tactile feel of the board game.
- **Responsive Layout**: Designed to work gracefully on standard desktop monitors, giving maximum real-estate to the beautiful, centered game board while keeping the Action Chronicle and player stats pinned to the sidebar.

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
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Play!**
   Open [http://localhost:3000](http://localhost:3000) in your browser. Click "Begin Journey", enter a Merchant Name, and create a room!
