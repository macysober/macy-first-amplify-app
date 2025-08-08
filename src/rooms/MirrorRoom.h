#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Components/SceneComponent.h"
#include "Engine/TriggerVolume.h"
#include "MirrorRoom.generated.h"

USTRUCT(BlueprintType)
struct FMirrorState
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    bool bIsReflectionCorrect = true;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    int32 AssignedPlayerID = -1;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    AActor* ReflectedActor = nullptr;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    float DistortionLevel = 0.0f;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FVector ReflectionOffset = FVector::ZeroVector;
};

UENUM(BlueprintType)
enum class EMirrorPuzzleStage : uint8
{
    Initial,            // Players exploring
    FirstDistortion,    // One mirror shows truth
    MultipleRealities,  // Different truths per player
    FinalAlignment,     // Must align all mirrors
    Completed
};

UCLASS()
class THEDWELLING_API AMirrorRoom : public AActor
{
    GENERATED_BODY()

public:
    AMirrorRoom();

    // Room Control
    UFUNCTION(BlueprintCallable, Category = "Mirror Room")
    void InitializeRoom(const TArray<int32>& PlayerIDs);

    UFUNCTION(BlueprintCallable, Category = "Mirror Room")
    void StartPuzzle();

    UFUNCTION(BlueprintCallable, Category = "Mirror Room")
    void ResetRoom();

    // Mirror Manipulation
    UFUNCTION(BlueprintCallable, Category = "Mirror Room")
    void DistortMirror(int32 MirrorIndex, float DistortionAmount);

    UFUNCTION(BlueprintCallable, Category = "Mirror Room")
    void SwapReflections(int32 MirrorA, int32 MirrorB);

    UFUNCTION(BlueprintCallable, Category = "Mirror Room")
    void RevealTrueMirror(int32 MirrorIndex);

    // Player Interactions
    UFUNCTION(BlueprintCallable, Category = "Mirror Room")
    void OnPlayerLookAtMirror(int32 PlayerID, int32 MirrorIndex);

    UFUNCTION(BlueprintCallable, Category = "Mirror Room")
    void OnPlayerTouchMirror(int32 PlayerID, int32 MirrorIndex);

    // Puzzle Events
    UFUNCTION(BlueprintImplementableEvent, Category = "Mirror Room")
    void OnPuzzleStageChanged(EMirrorPuzzleStage NewStage);

    UFUNCTION(BlueprintImplementableEvent, Category = "Mirror Room")
    void OnMirrorShatter(int32 MirrorIndex);

    UFUNCTION(BlueprintImplementableEvent, Category = "Mirror Room")
    void OnReflectionHorror(int32 PlayerID, int32 MirrorIndex);

    UFUNCTION(BlueprintImplementableEvent, Category = "Mirror Room")
    void OnPuzzleComplete();

protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;

    // Mirror Setup
    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Mirror Setup")
    TArray<class AMirrorActor*> RoomMirrors;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Mirror Setup")
    int32 NumberOfMirrors = 7;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Mirror Setup")
    float MirrorUpdateRate = 0.1f;

    // Puzzle State
    UPROPERTY(BlueprintReadOnly, Category = "Puzzle State")
    EMirrorPuzzleStage CurrentStage;

    UPROPERTY(BlueprintReadOnly, Category = "Puzzle State")
    TArray<FMirrorState> MirrorStates;

    UPROPERTY(BlueprintReadOnly, Category = "Puzzle State")
    int32 TrueMirrorIndex = -1;

    UPROPERTY(BlueprintReadOnly, Category = "Puzzle State")
    float PuzzleProgress = 0.0f;

private:
    // Mirror Logic
    void UpdateMirrorReflections();
    void CreateFalseReflection(int32 MirrorIndex, int32 PlayerID);
    void GenerateHorrorReflection(int32 MirrorIndex, int32 PlayerID);
    bool CheckPuzzleSolution();

    // Stage Behaviors
    void ExecuteInitialStage();
    void ExecuteFirstDistortionStage();
    void ExecuteMultipleRealitiesStage();
    void ExecuteFinalAlignmentStage();

    // Horror Elements
    void TriggerMirrorWhispers(int32 MirrorIndex);
    void CreateMirrorDoppelganger(int32 PlayerID);
    void ShatterMirrorSequence(int32 MirrorIndex);

    // Player Tracking
    UPROPERTY()
    TMap<int32, FVector> PlayerPositions;

    UPROPERTY()
    TMap<int32, FRotator> PlayerLookDirections;

    UPROPERTY()
    TMap<int32, float> PlayerSanityLevels;

    // Timers
    FTimerHandle MirrorUpdateTimer;
    FTimerHandle StageProgressionTimer;
    FTimerHandle HorrorEventTimer;

    // Puzzle Solution
    UPROPERTY()
    TArray<int32> CorrectMirrorSequence;

    UPROPERTY()
    TArray<int32> PlayerInputSequence;

    // Room Atmosphere
    UPROPERTY(EditAnywhere, Category = "Atmosphere")
    class UAudioComponent* WhisperAudioComponent;

    UPROPERTY(EditAnywhere, Category = "Atmosphere")
    class UPointLightComponent* RoomLighting;

    UPROPERTY(EditAnywhere, Category = "Atmosphere")
    float LightFlickerIntensity = 0.0f;
};