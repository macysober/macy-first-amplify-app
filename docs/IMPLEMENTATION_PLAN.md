# THE DWELLING - Implementation Plan

## Quick Start Options

### Option 1: Unity (Faster Prototype)
**Pros**: 
- Easier to learn
- Faster iteration
- Great asset store for horror
- Good networking solutions (Mirror, Photon)

**Cons**:
- Less photorealistic than UE5
- Limited next-gen features

### Option 2: Unreal Engine 5 (Recommended)
**Pros**:
- Photorealistic graphics (Nanite, Lumen)
- Better for horror atmosphere
- Industry standard for AAA
- Built-in networking

**Cons**:
- Steeper learning curve
- Longer build times

### Option 3: Godot (Budget Option)
**Pros**:
- Completely free
- Lightweight
- Good for indie horror

**Cons**:
- Limited 3D capabilities
- Smaller community

## Week 1: Foundation Setup

### Day 1-2: Environment Setup
```bash
# For Unreal Engine 5
1. Download UE5.3 from Epic Games Launcher
2. Create new project: Third Person Template
3. Enable plugins:
   - Audio Capture
   - Procedural Mesh
   - Horror Engine (marketplace)
   
# For Unity
1. Download Unity Hub
2. Install Unity 2023.2 LTS
3. Create new 3D URP project
4. Import packages:
   - Netcode for GameObjects
   - Microphone capture
   - Post-processing
```

### Day 3-4: Basic Multiplayer
- Set up 4-player lobby system
- Voice chat implementation
- Basic player movement sync
- Test connection stability

### Day 5-7: First Horror Prototype
- Create simple test room
- Implement basic fear detection (loud sounds)
- Add one jump scare trigger
- Test with friends for feedback

## Week 2: Core Systems

### Fear Detection System
```cpp
// Pseudocode for basic fear detection
void AnalyzeMicrophone() {
    float volumeLevel = GetMicrophoneVolume();
    float breathingRate = CalculateBreathingPattern();
    
    if (volumeLevel > SCREAM_THRESHOLD) {
        TriggerEntityResponse("scream");
        IncreaseFearLevel(0.3f);
    }
    
    if (breathingRate > PANIC_THRESHOLD) {
        TriggerEntityApproach();
    }
}
```

### Basic Entity AI
- Implement state machine (Dormant → Stalking → Hunting)
- Basic pathfinding to players
- Simple learning system (remember player positions)
- Voice recording and playback system

## Week 3: Mirror Room Prototype

### Room Components
1. **7 Mirror Setup**
   - 3D models with render texture cameras
   - Reflection distortion shaders
   - Shatter particle effects

2. **Puzzle Logic**
   - Track which mirror is "true"
   - Player interaction system
   - Solution checking

3. **Horror Elements**
   - False reflections system
   - Whisper audio triggers
   - Light flickering

## Week 4: Polish & Testing

### Performance Optimization
- LOD system for complex rooms
- Occlusion culling setup
- Network optimization
- Audio compression

### Playtesting Protocol
1. Internal testing (fix major bugs)
2. Friends & family alpha (4-5 sessions)
3. Small closed beta (20-30 players)
4. Analyze fear data and iterate

## Asset Creation Guide

### 3D Models Needed
- **The Entity** (5 forms)
  - Base shadow form
  - Humanoid mimic
  - Monster form
  - Environmental blend
  - True form

- **Room Props**
  - Victorian furniture set
  - Medical equipment
  - Childhood toys
  - Religious artifacts
  - Mirror variations

### Audio Requirements
- Ambient horror loops (20-30)
- Entity sounds (breathing, footsteps, screams)
- Puzzle interaction sounds
- Dynamic music layers
- Voice distortion effects

### Texture Work
- PBR materials for realism
- Decay/corruption variants
- Blood/gore decals
- Sanity distortion overlays
- Environmental storytelling details

## Quick Prototype Code

### Basic Unity Setup
```csharp
// PlayerFearController.cs
using UnityEngine;
using Unity.Netcode;

public class PlayerFearController : NetworkBehaviour
{
    [SerializeField] private float sanity = 100f;
    [SerializeField] private float fearLevel = 0f;
    
    private AudioSource microphoneInput;
    private float[] samples = new float[512];
    
    void Start()
    {
        if (IsOwner)
        {
            microphoneInput = GetComponent<AudioSource>();
            microphoneInput.clip = Microphone.Start(null, true, 1, 44100);
            microphoneInput.loop = true;
            while (!(Microphone.GetPosition(null) > 0)) {}
            microphoneInput.Play();
        }
    }
    
    void Update()
    {
        if (!IsOwner) return;
        
        // Analyze microphone
        microphoneInput.GetOutputData(samples, 0);
        float volume = GetAverageVolume(samples);
        
        if (volume > 0.5f) // Loud noise detected
        {
            IncreaseFearServerRpc(volume);
        }
        
        // Update sanity
        sanity -= fearLevel * Time.deltaTime;
        UpdateSanityEffects();
    }
    
    [ServerRpc]
    void IncreaseFearServerRpc(float amount)
    {
        fearLevel += amount;
        // Notify The Entity
        FindObjectOfType<EntityAI>()?.OnPlayerFearDetected(OwnerClientId, fearLevel);
    }
    
    void UpdateSanityEffects()
    {
        // Add post-processing distortion based on sanity
        // Trigger hallucinations at low sanity
        // Modify puzzle visibility
    }
}
```

### Basic Unreal Setup
```cpp
// FearDetectionComponent.cpp
#include "FearDetectionComponent.h"
#include "AudioCaptureComponent.h"

void UFearDetectionComponent::BeginPlay()
{
    Super::BeginPlay();
    
    // Start audio capture
    AudioCapture = NewObject<UAudioCaptureComponent>(this);
    AudioCapture->RegisterComponent();
    
    // Bind audio analysis
    GetWorld()->GetTimerManager().SetTimer(
        AnalysisTimer,
        this,
        &UFearDetectionComponent::AnalyzeAudio,
        0.1f,
        true
    );
}

void UFearDetectionComponent::AnalyzeAudio()
{
    TArray<float> AudioData;
    AudioCapture->GetAudioData(AudioData);
    
    float Volume = CalculateVolume(AudioData);
    float BreathRate = DetectBreathingPattern(AudioData);
    
    if (Volume > ScreamThreshold)
    {
        OnScreamDetected.Broadcast(GetOwner());
    }
    
    if (BreathRate > PanicThreshold)
    {
        CurrentFearLevel += 0.1f;
        OnFearIncreased.Broadcast(CurrentFearLevel);
    }
}
```

## Next Steps

1. **Choose Your Engine** (Unity for fast, UE5 for quality)
2. **Set Up Version Control** (Git with LFS for assets)
3. **Create Project Structure**
4. **Build First Test Room**
5. **Implement Basic Fear Detection**
6. **Test with Friends**
7. **Iterate Based on Feedback**

## Resources

### Horror Game Dev Tutorials
- Brackeys Horror Game Series
- Unity Horror Toolkit
- UE5 Horror Lighting Guide
- Procedural Horror Generation

### Asset Sources
- Megascans (free with UE5)
- Unity Asset Store Horror Packs
- Freesound.org (horror audio)
- Mixamo (character animations)

### Networking Solutions
- Unity: Netcode for GameObjects
- UE5: Built-in replication
- Photon (cross-platform)
- Mirror Networking

Ready to start building your nightmare?