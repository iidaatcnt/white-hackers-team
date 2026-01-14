# White Hackers Team - Technical Specifications

## 1. Description
A financial logic simulation board game designed for educational purposes. Students can participate by modifying the game's strategy engine to learn about algorithms and financial management.

## 2. Branding (WHT)
- **Concept**: Future-oriented hacker academy based in Shiroi City.
- **Color Palette**: 
  - Main: `#f8fafc` (Slate 50 - White)
  - Accent: `#0ea5e9` (Sky 500 - Cyan/Blue)
  - Text: `#1e293b` (Slate 800)
- **Vibe**: Clean, Intelligence, Security, Advanced Tech.

## 3. Tech Stack
- **Frontend**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 4. Key Logic (Strategy Engine)
The simulation allows users to injectable code into `runStrategy` located in `src/strategies.ts`.
```typescript
export const runStrategy = (player: PlayerState, gameState: GameState) => {
  // Logic injection point for students
};
```

## 5. Development Roadmap
- phase 1: Basic board game with manual dice (DONE)
- phase 2: AI integration with initial strategy API (DONE)
- phase 3: Multi-player support (Peer-to-peer or local)
- phase 4: Advanced financial assets (Stocks, Real Estate, Crypto)
- phase 5: Visual "Logic Builder" (No-code UI for strategy building)

## 6. Directory Structure
```text
white-hacker-s-lab/
├── src/
│   ├── App.tsx          # Main Dashboard & Game Logic
│   ├── constants.ts     # Board layout & Tile definitions
│   ├── strategies.ts    # Student-accessible Strategy Engine
│   └── index.css        # Theme variables
├── README.md            # User manual
└── spec.md              # Technical specs
```
