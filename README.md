# THE DWELLING - Psychological Horror Escape Game

## 🎮 Project Status
This repository contains:
1. **The Dwelling** - Horror escape room game design & Unity implementation
2. **Beauty Match AI** - Previous app (backed up in `src/app/page_backup_beauty.tsx`)

Currently deployed on AWS Amplify with the Beauty Match AI frontend active. The Dwelling files are included for game development.

## Overview
A 4-player cooperative horror escape room game where the house itself is alive and learns from player fears. Players must solve interconnected puzzles while being psychologically tormented by an adaptive AI entity.

## Core Features

### 1. Living House System
- Dynamic room transformation based on player behavior
- Adaptive puzzle generation that exploits discovered weaknesses
- Environmental storytelling through house "memories"

### 2. Fear Detection & Manifestation
- Microphone analysis for breathing patterns, panic sounds
- Camera tracking for avoidance behaviors
- Personalized horror generation based on player reactions
- Sanity system affecting puzzle perception

### 3. Escape Room Mechanics
- Multi-stage puzzles requiring teamwork
- Information asymmetry (players see different things)
- Trust-based challenges where betrayal is possible
- Time pressure with increasing horror intensity

### 4. The Entity
- AI-driven antagonist that studies player behavior
- Creates false teammates and mimics voices
- Manipulates environment based on psychological profiles
- Becomes more aggressive as players near escape

## Technical Stack
- **Engine**: Unreal Engine 5 (for photorealistic horror)
- **Networking**: Epic Online Services for 4-player co-op
- **AI**: Behavior trees + machine learning for Entity
- **Audio**: Wwise for dynamic 3D horror soundscapes
- **Analytics**: Player fear profiling system

## Project Structure
```
the-dwelling/
├── src/
│   ├── core/          # Game systems, managers
│   ├── rooms/         # Individual escape rooms
│   ├── entities/      # The Entity AI, manifestations
│   ├── players/       # Player controllers, fear system
│   ├── ui/           # Interfaces, sanity effects
│   ├── audio/        # Dynamic audio systems
│   └── networking/   # Multiplayer implementation
├── docs/             # Design documents
└── assets/          # 3D models, textures, sounds
```

## Development Phases

### Phase 1: Foundation (Current)
- Basic multiplayer connectivity
- First escape room prototype (Mirror Room)
- Core fear detection system
- Basic Entity AI

### Phase 2: Horror Systems
- Sanity mechanics
- Dynamic room transformations
- Voice mimicry system
- Psychological profiling

### Phase 3: Content
- 5 interconnected escape rooms
- Multiple Entity forms
- Procedural puzzle variations
- Ending sequences

### Phase 4: Polish
- Photorealistic graphics
- Advanced audio design
- Playtesting & balancing
- Performance optimization

## Getting Started
1. Install Unreal Engine 5.3+
2. Clone this repository
3. Open TheDwelling.uproject
4. Build and run

## Design Pillars
1. **Psychological Horror > Jump Scares**
2. **Your Mind is the Enemy**
3. **Trust No One (Including Yourself)**
4. **Every Playthrough is Personal**

## Unity Development
For detailed Unity setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## Game Design Document
For complete game design details, see [docs/GAME_DESIGN.md](./docs/GAME_DESIGN.md)