#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Character.h"
#include "AIController.h"
#include "BehaviorTree/BehaviorTree.h"
#include "../core/FearDetectionSystem.h"
#include "TheEntity.generated.h"

UENUM(BlueprintType)
enum class EEntityState : uint8
{
    Dormant,        // Watching, learning
    Stalking,       // Following specific player
    Hunting,        // Active pursuit
    Mimicking,      // Pretending to be player/object
    Manifesting,    // Creating fear-based illusions
    Feeding         // Consuming sanity/fear
};

UENUM(BlueprintType)
enum class EEntityForm : uint8
{
    Shadow,         // Base form, barely visible
    Mimic,          // Copies player appearance
    Nightmare,      // Personalized horror form
    Swarm,          // Multiple smaller entities
    Environmental   // Becomes part of the room
};

UCLASS()
class THEDWELLING_API ATheEntity : public ACharacter
{
    GENERATED_BODY()

public:
    ATheEntity();

    // State Management
    UFUNCTION(BlueprintCallable, Category = "Entity AI")
    void SetEntityState(EEntityState NewState);

    UFUNCTION(BlueprintCallable, Category = "Entity AI")
    void TransformIntoForm(EEntityForm NewForm, int32 TargetPlayerID = -1);

    // Learning System
    UFUNCTION(BlueprintCallable, Category = "Entity AI")
    void LearnFromPlayer(int32 PlayerID, const FFearProfile& FearProfile);

    UFUNCTION(BlueprintCallable, Category = "Entity AI")
    void AdaptToPlayerStrategy(int32 PlayerID, const FString& StrategyType);

    // Manifestation Abilities
    UFUNCTION(BlueprintCallable, Category = "Entity AI")
    void CreateIllusion(const FVector& Location, EFearType FearType);

    UFUNCTION(BlueprintCallable, Category = "Entity AI")
    void MimicPlayerVoice(int32 PlayerID, const FString& Message);

    UFUNCTION(BlueprintCallable, Category = "Entity AI")
    void ManipulateEnvironment(AActor* TargetObject, const FTransform& NewTransform);

    // Horror Events
    UFUNCTION(BlueprintImplementableEvent, Category = "Entity AI")
    void OnBeginStalk(int32 TargetPlayerID);

    UFUNCTION(BlueprintImplementableEvent, Category = "Entity AI")
    void OnManifestFear(EFearType FearType, const FVector& Location);

    UFUNCTION(BlueprintImplementableEvent, Category = "Entity AI")
    void OnPlayerSanityBreak(int32 PlayerID);

protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Entity AI")
    EEntityState CurrentState;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Entity AI")
    EEntityForm CurrentForm;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Entity AI")
    float LearningRate = 0.1f;

    UPROPERTY(EditAnywhere, BlueprintReadOnly, Category = "Entity AI")
    float AggressionLevel = 0.0f;

private:
    // AI Components
    UPROPERTY()
    class AAIController* EntityAIController;

    UPROPERTY(EditAnywhere, Category = "Entity AI")
    class UBehaviorTree* EntityBehaviorTree;

    // Player Knowledge Database
    UPROPERTY()
    TMap<int32, FFearProfile> KnownPlayerFears;

    UPROPERTY()
    TMap<int32, TArray<FString>> PlayerBehaviorPatterns;

    // State Behaviors
    void ExecuteDormantBehavior(float DeltaTime);
    void ExecuteStalkingBehavior(float DeltaTime);
    void ExecuteHuntingBehavior(float DeltaTime);
    void ExecuteMimickingBehavior(float DeltaTime);

    // Learning Functions
    void AnalyzePlayerActions(int32 PlayerID);
    void UpdatePlayerKnowledge(int32 PlayerID, const FString& NewPattern);
    float CalculateOptimalDistance(int32 PlayerID);

    // Manifestation Logic
    bool CanManifestFear(EFearType FearType);
    void SelectOptimalForm(int32 TargetPlayerID);
    FVector PredictPlayerMovement(int32 PlayerID);

    // Current Targets
    UPROPERTY()
    int32 PrimaryTargetID = -1;

    UPROPERTY()
    TArray<int32> SecondaryTargets;

    // Timers
    FTimerHandle StateTransitionTimer;
    FTimerHandle LearningUpdateTimer;
};