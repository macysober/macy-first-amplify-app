using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Unity.Netcode;
using UnityEngine.Events;

namespace TheDwelling.Core
{
    [System.Serializable]
    public class FearProfile
    {
        public Dictionary<FearType, float> fearIntensities = new Dictionary<FearType, float>();
        public float averageHeartRate = 60f;
        public float peakStressLevel = 0f;
        public List<string> triggerWords = new List<string>();
        public Vector3 lastAvoidanceVector;
        public float totalScreamCount = 0;
        public float panicBreathingTime = 0f;
    }

    public enum FearType
    {
        Darkness,
        Heights,
        Claustrophobia,
        Isolation,
        BeingWatched,
        BodyHorror,
        Insects,
        Water,
        Mirrors,
        Dolls,
        Unknown
    }

    public class FearDetectionSystem : NetworkBehaviour
    {
        [Header("Detection Settings")]
        [SerializeField] private bool detectionEnabled = false;
        [SerializeField] private float microphoneSensitivity = 100f;
        [SerializeField] private float screamThreshold = 0.7f;
        [SerializeField] private float heavyBreathingThreshold = 0.3f;
        [SerializeField] private float updateInterval = 0.1f;

        [Header("Player Fear State")]
        [SerializeField] private FearProfile currentProfile;
        [SerializeField] private float currentStressLevel = 0f;
        [SerializeField] private float breathingRate = 0f;
        [SerializeField] private bool isPlayerPanicking = false;

        [Header("Audio Detection")]
        private AudioSource microphoneSource;
        private string microphoneDevice;
        private float[] audioSamples = new float[512];
        private float[] breathingPattern = new float[100];
        private int breathingIndex = 0;

        [Header("Movement Detection")]
        [SerializeField] private float avoidanceDetectionRadius = 5f;
        private Vector3 previousPosition;
        private Vector3 averageMovementDirection;
        private Queue<Vector3> movementHistory = new Queue<Vector3>();

        [Header("Events")]
        public UnityEvent<FearType, float> OnFearDetected;
        public UnityEvent<float> OnScreamDetected;
        public UnityEvent OnPanicStateEntered;
        public UnityEvent OnPanicStateExited;

        private Coroutine detectionCoroutine;
        private PlayerController playerController;
        private Camera playerCamera;

        private void Awake()
        {
            currentProfile = new FearProfile();
            
            // Initialize fear types
            foreach (FearType fearType in System.Enum.GetValues(typeof(FearType)))
            {
                currentProfile.fearIntensities[fearType] = 0f;
            }
        }

        private void Start()
        {
            if (!IsOwner) return;

            playerController = GetComponent<PlayerController>();
            playerCamera = GetComponentInChildren<Camera>();
            
            SetupMicrophone();
        }

        private void SetupMicrophone()
        {
            if (Microphone.devices.Length > 0)
            {
                microphoneDevice = Microphone.devices[0];
                microphoneSource = gameObject.AddComponent<AudioSource>();
                microphoneSource.clip = Microphone.Start(microphoneDevice, true, 10, 44100);
                microphoneSource.loop = true;
                
                // Wait until the recording has started
                while (!(Microphone.GetPosition(microphoneDevice) > 0)) { }
                
                microphoneSource.Play();
                microphoneSource.volume = 0f; // Mute playback
            }
            else
            {
                Debug.LogWarning("No microphone detected!");
            }
        }

        public void EnableDetection()
        {
            if (!IsOwner) return;
            
            detectionEnabled = true;
            if (detectionCoroutine == null)
            {
                detectionCoroutine = StartCoroutine(DetectionLoop());
            }
        }

        public void DisableDetection()
        {
            detectionEnabled = false;
            if (detectionCoroutine != null)
            {
                StopCoroutine(detectionCoroutine);
                detectionCoroutine = null;
            }
        }

        private IEnumerator DetectionLoop()
        {
            while (detectionEnabled)
            {
                // Audio Analysis
                if (microphoneSource != null && microphoneSource.clip != null)
                {
                    AnalyzeAudio();
                }

                // Movement Analysis
                AnalyzeMovement();

                // Visual Analysis
                AnalyzeVisualFocus();

                // Update stress level
                UpdateStressLevel();

                // Send data to server
                if (Time.frameCount % 30 == 0) // Every 30 frames
                {
                    SendFearDataToServer();
                }

                yield return new WaitForSeconds(updateInterval);
            }
        }

        private void AnalyzeAudio()
        {
            if (microphoneSource.clip == null) return;

            microphoneSource.GetOutputData(audioSamples, 0);
            
            float currentVolume = CalculateRMS(audioSamples);
            
            // Detect screaming
            if (currentVolume > screamThreshold)
            {
                OnScreamDetected?.Invoke(currentVolume);
                currentProfile.totalScreamCount++;
                currentStressLevel = Mathf.Min(currentStressLevel + 0.3f, 1f);
                
                DetectFearContext(FearType.Unknown, 0.8f);
            }
            
            // Analyze breathing pattern
            breathingPattern[breathingIndex] = currentVolume;
            breathingIndex = (breathingIndex + 1) % breathingPattern.Length;
            
            breathingRate = CalculateBreathingRate();
            
            if (breathingRate > heavyBreathingThreshold)
            {
                currentProfile.panicBreathingTime += updateInterval;
                
                if (!isPlayerPanicking && currentProfile.panicBreathingTime > 3f)
                {
                    isPlayerPanicking = true;
                    OnPanicStateEntered?.Invoke();
                }
            }
            else if (isPlayerPanicking && breathingRate < heavyBreathingThreshold * 0.7f)
            {
                isPlayerPanicking = false;
                currentProfile.panicBreathingTime = 0f;
                OnPanicStateExited?.Invoke();
            }
        }

        private float CalculateRMS(float[] samples)
        {
            float sum = 0f;
            for (int i = 0; i < samples.Length; i++)
            {
                sum += samples[i] * samples[i];
            }
            return Mathf.Sqrt(sum / samples.Length) * microphoneSensitivity;
        }

        private float CalculateBreathingRate()
        {
            // Simple breathing rate detection based on volume fluctuations
            float variance = 0f;
            float average = 0f;
            
            foreach (float sample in breathingPattern)
            {
                average += sample;
            }
            average /= breathingPattern.Length;
            
            foreach (float sample in breathingPattern)
            {
                variance += Mathf.Pow(sample - average, 2);
            }
            variance /= breathingPattern.Length;
            
            return Mathf.Sqrt(variance);
        }

        private void AnalyzeMovement()
        {
            if (playerController == null) return;

            Vector3 currentPosition = transform.position;
            Vector3 movement = currentPosition - previousPosition;
            
            if (movement.magnitude > 0.01f)
            {
                movementHistory.Enqueue(movement.normalized);
                if (movementHistory.Count > 50)
                {
                    movementHistory.Dequeue();
                }
                
                // Calculate average movement direction
                averageMovementDirection = Vector3.zero;
                foreach (Vector3 dir in movementHistory)
                {
                    averageMovementDirection += dir;
                }
                averageMovementDirection /= movementHistory.Count;
                
                // Detect backing away behavior
                if (Vector3.Dot(averageMovementDirection, transform.forward) < -0.5f)
                {
                    // Player is consistently backing away from something
                    DetectNearbyFearSource();
                }
            }
            
            previousPosition = currentPosition;
        }

        private void DetectNearbyFearSource()
        {
            Collider[] nearbyObjects = Physics.OverlapSphere(transform.position, avoidanceDetectionRadius);
            
            foreach (Collider obj in nearbyObjects)
            {
                if (obj.CompareTag("FearSource"))
                {
                    FearSource fearSource = obj.GetComponent<FearSource>();
                    if (fearSource != null)
                    {
                        float distance = Vector3.Distance(transform.position, obj.transform.position);
                        float intensity = 1f - (distance / avoidanceDetectionRadius);
                        
                        DetectFearContext(fearSource.fearType, intensity);
                        currentProfile.lastAvoidanceVector = transform.position - obj.transform.position;
                    }
                }
            }
        }

        private void AnalyzeVisualFocus()
        {
            if (playerCamera == null) return;

            // Cast ray from camera to see what player is looking at
            RaycastHit hit;
            if (Physics.Raycast(playerCamera.transform.position, playerCamera.transform.forward, out hit, 20f))
            {
                // Check if player quickly looks away from something
                StartCoroutine(TrackGazeAvoidance(hit.collider));
            }
        }

        private IEnumerator TrackGazeAvoidance(Collider target)
        {
            yield return new WaitForSeconds(0.2f);
            
            // Check if player is no longer looking at the target
            RaycastHit hit;
            if (Physics.Raycast(playerCamera.transform.position, playerCamera.transform.forward, out hit, 20f))
            {
                if (hit.collider != target)
                {
                    // Player looked away quickly
                    FearSource fearSource = target.GetComponent<FearSource>();
                    if (fearSource != null)
                    {
                        DetectFearContext(fearSource.fearType, 0.5f);
                    }
                }
            }
        }

        private void DetectFearContext(FearType fearType, float intensity)
        {
            currentProfile.fearIntensities[fearType] = Mathf.Max(
                currentProfile.fearIntensities[fearType],
                intensity
            );
            
            OnFearDetected?.Invoke(fearType, intensity);
            
            // Notify the Entity
            if (GameManager.Instance != null && GameManager.Instance.GetEntity() != null)
            {
                NotifyEntityOfFearServerRpc(fearType, intensity);
            }
        }

        private void UpdateStressLevel()
        {
            // Decay stress over time
            currentStressLevel = Mathf.Max(0, currentStressLevel - 0.01f * updateInterval);
            
            // Update peak stress
            if (currentStressLevel > currentProfile.peakStressLevel)
            {
                currentProfile.peakStressLevel = currentStressLevel;
            }
            
            // Calculate heart rate simulation
            currentProfile.averageHeartRate = 60f + (currentStressLevel * 60f) + (breathingRate * 20f);
        }

        private void SendFearDataToServer()
        {
            if (!IsOwner) return;
            
            UpdateFearProfileServerRpc(
                currentStressLevel,
                currentProfile.averageHeartRate,
                isPlayerPanicking,
                transform.position
            );
        }

        [ServerRpc]
        private void UpdateFearProfileServerRpc(float stress, float heartRate, bool panicking, Vector3 position)
        {
            var playerData = GameManager.Instance.GetPlayerData(OwnerClientId);
            if (playerData != null)
            {
                playerData.lastHeartRate = heartRate;
                playerData.lastKnownPosition = position;
                
                // Update sanity based on stress
                if (panicking)
                {
                    playerData.sanity -= 2f * Time.deltaTime;
                }
                else
                {
                    playerData.sanity -= stress * Time.deltaTime;
                }
                
                playerData.sanity = Mathf.Clamp(playerData.sanity, 0f, 100f);
            }
        }

        [ServerRpc]
        private void NotifyEntityOfFearServerRpc(FearType fearType, float intensity)
        {
            if (GameManager.Instance.GetEntity() != null)
            {
                GameManager.Instance.GetEntity().OnPlayerFearDetected(OwnerClientId, fearType, intensity);
            }
        }

        public FearProfile GetFearProfile()
        {
            return currentProfile;
        }

        public float GetCurrentStressLevel()
        {
            return currentStressLevel;
        }

        public bool IsPlayerPanicking()
        {
            return isPlayerPanicking;
        }

        private void OnDestroy()
        {
            if (microphoneDevice != null)
            {
                Microphone.End(microphoneDevice);
            }
        }
    }

    // Helper component to mark objects as fear sources
    public class FearSource : MonoBehaviour
    {
        public FearType fearType = FearType.Unknown;
        public float baseFearIntensity = 0.5f;
    }
}