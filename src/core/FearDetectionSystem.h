#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "AudioCaptureComponent.h"
#include "FearDetectionSystem.generated.h"

UENUM(BlueprintType)
enum class EFearType : uint8
{
    Darkness,
    Heights,
    Claustrophobia,
    Isolation,
    BeingWatched,
    BodyHorror,
    Insects,
    Water,
    Unknown
};

USTRUCT(BlueprintType)
struct FFearProfile
{
    GENERATED_BODY()

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    TMap<EFearType, float> FearIntensities;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    float CurrentSanity = 100.0f;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    float HeartRate = 60.0f;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    TArray<FString> TriggerWords;

    UPROPERTY(BlueprintReadWrite, EditAnywhere)
    FVector LastAvoidanceDirection;
};

UCLASS()
class THEDWELLING_API AFearDetectionSystem : public AActor
{
    GENERATED_BODY()

public:
    AFearDetectionSystem();

    UFUNCTION(BlueprintCallable, Category = "Fear Detection")
    void AnalyzeMicrophoneInput(const TArray<float>& AudioData);

    UFUNCTION(BlueprintCallable, Category = "Fear Detection")
    void AnalyzePlayerMovement(const FVector& PlayerLocation, const FVector& LookDirection);

    UFUNCTION(BlueprintCallable, Category = "Fear Detection")
    FFearProfile GetPlayerFearProfile(int32 PlayerID);

    UFUNCTION(BlueprintCallable, Category = "Fear Detection")
    void UpdateSanity(int32 PlayerID, float DeltaSanity);

    UFUNCTION(BlueprintImplementableEvent, Category = "Fear Detection")
    void OnFearDetected(int32 PlayerID, EFearType FearType, float Intensity);

protected:
    virtual void BeginPlay() override;
    virtual void Tick(float DeltaTime) override;

private:
    UPROPERTY()
    UAudioCaptureComponent* AudioCapture;

    UPROPERTY()
    TMap<int32, FFearProfile> PlayerFearProfiles;

    // Audio analysis
    float AnalyzeBreathingPattern(const TArray<float>& AudioData);
    float DetectScream(const TArray<float>& AudioData);
    void ProcessVoiceStress(const TArray<float>& AudioData, int32 PlayerID);

    // Movement analysis
    void DetectAvoidanceBehavior(int32 PlayerID, const FVector& PlayerLocation);
    void AnalyzeLookAwayPatterns(int32 PlayerID, const FVector& LookDirection);

    // Fear learning
    void LearnPlayerFears(int32 PlayerID, EFearType DetectedFear, float Intensity);
    void AdaptEntityBehavior(int32 PlayerID);

    // Helpers
    float CalculateAudioIntensity(const TArray<float>& AudioData);
    EFearType DetermineFearType(const FVector& AvoidanceContext);
};