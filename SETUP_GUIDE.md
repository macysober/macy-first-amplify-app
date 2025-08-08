# The Dwelling - Unity Setup Guide

## Quick Start

### 1. Install Unity
1. Download Unity Hub from https://unity.com/download
2. Install Unity 2022.3 LTS (Long Term Support)
3. During installation, include:
   - Visual Studio (for C# editing)
   - WebGL Build Support (optional, for web builds)
   - Windows Build Support

### 2. Create New Unity Project
1. Open Unity Hub
2. Click "New Project"
3. Select "3D (URP)" template
4. Name: "TheDwelling"
5. Location: `C:\Users\msobe\Chinchilla-Projects\the-dwelling\Unity`
6. Click "Create Project"

### 3. Import Required Packages
Once Unity opens, install these packages via Package Manager (Window > Package Manager):

1. **Netcode for GameObjects** (Multiplayer)
   - Click "+" > "Add package from git URL"
   - Enter: `com.unity.netcode.gameobjects`

2. **Input System** (New Input)
   - Search for "Input System" in Package Manager
   - Click Install
   - When prompted, click "Yes" to enable new input system

3. **TextMeshPro** (Better Text)
   - Should be included by default
   - If not, search and install

4. **Post Processing** (Visual Effects)
   - Search for "Post-processing" in Package Manager
   - Install latest version

5. **Cinemachine** (Camera System)
   - Search for "Cinemachine"
   - Install for better camera control

### 4. Project Settings

1. **Input System**
   - Edit > Project Settings > Player
   - Configuration > Active Input Handling: "Both" or "Input System Package (New)"

2. **Quality Settings**
   - Edit > Project Settings > Quality
   - Set default level to "High" or "Ultra"

3. **Audio Settings**
   - Edit > Project Settings > Audio
   - Default Speaker Mode: Stereo
   - DSP Buffer Size: Best latency

### 5. Import Scripts
1. Copy all scripts from `Assets/Scripts/` to your Unity project's Assets/Scripts folder
2. Unity will compile them automatically
3. Fix any compilation errors (usually missing references)

### 6. Create Basic Scene Structure

```
Hierarchy:
├── Managers
│   ├── GameManager
│   ├── NetworkManager
│   └── UIManager
├── Environment
│   ├── Rooms
│   │   └── MirrorRoom
│   └── Lighting
├── UI
│   ├── Canvas
│   │   ├── HUD
│   │   ├── DeathScreen
│   │   └── VictoryScreen
│   └── EventSystem
└── SpawnPoints
    ├── SpawnPoint1
    ├── SpawnPoint2
    ├── SpawnPoint3
    └── SpawnPoint4
```

### 7. Network Setup
1. Create empty GameObject named "NetworkManager"
2. Add Component: Unity Netcode > NetworkManager
3. Configure:
   - Player Prefab: (create and assign player prefab)
   - Network Transport: Unity Transport
   - Max Players: 4

### 8. Create Player Prefab
1. Create new GameObject "Player"
2. Add Components:
   - Character Controller
   - PlayerController (our script)
   - FearDetectionSystem (our script)
   - NetworkObject
   - Audio Source
3. Add child Camera
4. Save as Prefab
5. Assign to NetworkManager

### 9. Create The Entity Prefab
1. Create GameObject "TheEntity"
2. Add Components:
   - TheEntity (our script)
   - NavMeshAgent
   - NetworkObject
   - Audio Source
3. Create child objects for different forms
4. Save as Prefab

### 10. Create Mirror Room
1. Create room geometry (walls, floor, ceiling)
2. Place 7 mirror objects in a circle
3. Add Mirror components to each
4. Add room lighting
5. Create spawn points for players

### 11. Testing
1. File > Build Settings
2. Add current scene
3. Player Settings:
   - Company Name: Your name
   - Product Name: The Dwelling
4. For multiplayer testing:
   - Build and Run
   - Then press Play in Editor
   - This gives you 2 instances to test

## Asset Resources

### Free Horror Assets
- **Snaps Prototype | Office** - Free office environment
- **Horror Ambient Sounds** - Search Unity Asset Store
- **PBR Materials** - Built into URP

### Recommended Paid Assets (Optional)
- **Horror Engine** ($30) - Complete horror framework
- **A* Pathfinding Project** - Better AI navigation
- **Master Audio** - Advanced audio system

## Common Issues & Solutions

### Issue: Scripts not compiling
**Solution**: Make sure all required packages are installed, especially Netcode for GameObjects

### Issue: Microphone not working
**Solution**: 
1. Check Windows microphone permissions
2. Ensure Unity has microphone access
3. Test with `Microphone.devices` to see available devices

### Issue: Multiplayer not connecting
**Solution**:
1. Check firewall settings
2. Use Unity Transport's default settings
3. For local testing, use 127.0.0.1

### Issue: Performance issues
**Solution**:
1. Enable GPU Instancing on materials
2. Use LOD groups for complex models
3. Optimize lighting (use baked lighting where possible)

## Next Steps
1. Implement remaining rooms
2. Add more Entity behaviors
3. Create horror visual effects
4. Add spatial audio
5. Implement save system
6. Polish and playtest!

## Quick Test Commands
```csharp
// In Unity Console (Window > General > Console)
// Press ~ to open

// Spawn Entity manually
GameManager.Instance.GetEntity().ChangeState(EntityState.Hunting);

// Damage player
GameManager.Instance.GetPlayerData(0).sanity = 50f;

// Complete current room
FindObjectOfType<BaseRoom>().CompleteRoom(true);
```

Ready to create nightmares! 🏚️👻