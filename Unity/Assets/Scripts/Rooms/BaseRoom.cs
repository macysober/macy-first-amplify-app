using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Unity.Netcode;
using UnityEngine.Events;
using TheDwelling.Core;

namespace TheDwelling.Rooms
{
    public abstract class BaseRoom : NetworkBehaviour
    {
        [Header("Room Configuration")]
        [SerializeField] protected string roomName = "Unknown Room";
        [SerializeField] protected float roomTimeLimit = 600f; // 10 minutes
        [SerializeField] protected int requiredPlayersToStart = 1;
        [SerializeField] protected Transform[] playerSpawnPoints;

        [Header("Room State")]
        protected NetworkVariable<bool> isRoomActive = new NetworkVariable<bool>(false);
        protected NetworkVariable<float> roomTimer = new NetworkVariable<float>(0f);
        protected NetworkVariable<float> puzzleProgress = new NetworkVariable<float>(0f);
        protected List<PlayerData> playersInRoom = new List<PlayerData>();

        [Header("Puzzle Elements")]
        [SerializeField] protected GameObject[] puzzleObjects;
        [SerializeField] protected Transform exitDoor;
        [SerializeField] protected bool requiresAllPlayersToExit = true;

        [Header("Horror Elements")]
        [SerializeField] protected float baseFearLevel = 0.2f;
        [SerializeField] protected float sanityDrainRate = 1f;
        [SerializeField] protected GameObject[] horrorTriggers;
        protected Dictionary<ulong, float> playerFearLevels = new Dictionary<ulong, float>();

        [Header("Lighting")]
        [SerializeField] protected Light[] roomLights;
        [SerializeField] protected float normalLightIntensity = 1f;
        [SerializeField] protected float horrorLightIntensity = 0.3f;
        [SerializeField] protected AnimationCurve lightFlickerCurve;

        [Header("Audio")]
        [SerializeField] protected AudioSource ambientAudioSource;
        [SerializeField] protected AudioClip[] ambientClips;
        [SerializeField] protected AudioClip[] horrorStingers;
        [SerializeField] protected AudioSource puzzleAudioSource;

        [Header("Events")]
        public UnityAction<string> OnRoomCompleted;
        public UnityEvent<float> OnPuzzleProgressChanged;
        public UnityEvent<ulong> OnPlayerEnteredRoom;
        public UnityEvent<ulong> OnPlayerExitedRoom;
        public UnityEvent OnPuzzleFailed;

        protected Coroutine roomUpdateCoroutine;
        protected Coroutine lightingCoroutine;

        public virtual void InitializeRoom(List<PlayerData> players)
        {
            if (!IsServer) return;

            playersInRoom = new List<PlayerData>(players);
            isRoomActive.Value = true;

            // Initialize player positions
            TeleportPlayersToRoom();

            // Initialize fear levels
            foreach (var player in players)
            {
                playerFearLevels[player.clientId] = baseFearLevel;
            }

            // Start room behavior
            roomUpdateCoroutine = StartCoroutine(RoomUpdateLoop());
            lightingCoroutine = StartCoroutine(LightingEffectsLoop());

            // Initialize puzzle
            InitializePuzzle();

            // Start ambient audio
            if (ambientAudioSource != null && ambientClips.Length > 0)
            {
                ambientAudioSource.clip = ambientClips[Random.Range(0, ambientClips.Length)];
                ambientAudioSource.loop = true;
                ambientAudioSource.Play();
            }
        }

        protected abstract void InitializePuzzle();
        protected abstract bool CheckPuzzleSolution();
        protected abstract void OnPuzzleComplete();

        protected virtual void TeleportPlayersToRoom()
        {
            if (!IsServer) return;

            int spawnIndex = 0;
            foreach (var player in playersInRoom)
            {
                if (player.isAlive)
                {
                    TeleportPlayerClientRpc(player.clientId, playerSpawnPoints[spawnIndex % playerSpawnPoints.Length].position);
                    spawnIndex++;
                }
            }
        }

        [ClientRpc]
        protected void TeleportPlayerClientRpc(ulong playerId, Vector3 position)
        {
            if (NetworkManager.Singleton.LocalClientId == playerId)
            {
                GameObject playerObj = NetworkManager.Singleton.LocalClient.PlayerObject.gameObject;
                playerObj.transform.position = position;
            }
        }

        protected virtual IEnumerator RoomUpdateLoop()
        {
            while (isRoomActive.Value)
            {
                // Update room timer
                roomTimer.Value += Time.deltaTime;

                // Check time limit
                if (roomTimer.Value >= roomTimeLimit)
                {
                    OnTimeExpired();
                    yield break;
                }

                // Update player sanity
                UpdatePlayerSanity();

                // Check puzzle progress
                if (CheckPuzzleSolution())
                {
                    OnPuzzleComplete();
                    yield break;
                }

                // Update horror intensity based on progress
                UpdateHorrorIntensity();

                yield return new WaitForSeconds(0.5f);
            }
        }

        protected virtual void UpdatePlayerSanity()
        {
            foreach (var player in playersInRoom)
            {
                if (player.isAlive)
                {
                    float fearMultiplier = playerFearLevels.ContainsKey(player.clientId) ? 
                        playerFearLevels[player.clientId] : baseFearLevel;
                    
                    player.sanity -= sanityDrainRate * fearMultiplier * Time.deltaTime;
                    player.sanity = Mathf.Clamp(player.sanity, 0f, 100f);

                    // Trigger horror events at low sanity
                    if (player.sanity < 30f && Random.value < 0.01f)
                    {
                        TriggerPersonalHorror(player.clientId);
                    }
                }
            }
        }

        protected virtual void UpdateHorrorIntensity()
        {
            // Increase horror as time passes or puzzle progress stalls
            float timeIntensity = roomTimer.Value / roomTimeLimit;
            float progressIntensity = 1f - puzzleProgress.Value;
            float overallIntensity = Mathf.Max(timeIntensity, progressIntensity);

            // Update lighting
            foreach (var light in roomLights)
            {
                light.intensity = Mathf.Lerp(normalLightIntensity, horrorLightIntensity, overallIntensity);
            }

            // Chance to trigger horror events
            if (Random.value < overallIntensity * 0.01f)
            {
                TriggerRandomHorrorEvent();
            }
        }

        protected virtual IEnumerator LightingEffectsLoop()
        {
            while (isRoomActive.Value)
            {
                // Random light flickers
                if (Random.value < 0.05f)
                {
                    yield return FlickerLights();
                }

                yield return new WaitForSeconds(Random.Range(5f, 15f));
            }
        }

        protected IEnumerator FlickerLights()
        {
            float flickerDuration = Random.Range(0.5f, 2f);
            float elapsedTime = 0f;

            while (elapsedTime < flickerDuration)
            {
                float flickerValue = lightFlickerCurve.Evaluate(elapsedTime / flickerDuration);
                
                foreach (var light in roomLights)
                {
                    light.intensity = normalLightIntensity * flickerValue;
                }

                elapsedTime += Time.deltaTime;
                yield return null;
            }

            // Restore normal lighting
            foreach (var light in roomLights)
            {
                light.intensity = normalLightIntensity;
            }
        }

        protected virtual void TriggerRandomHorrorEvent()
        {
            if (horrorTriggers.Length > 0)
            {
                int randomIndex = Random.Range(0, horrorTriggers.Length);
                horrorTriggers[randomIndex].SetActive(true);
                
                // Deactivate after a delay
                StartCoroutine(DeactivateHorrorTrigger(horrorTriggers[randomIndex], 5f));
            }

            // Play horror stinger
            if (horrorStingers.Length > 0 && puzzleAudioSource != null)
            {
                AudioClip stinger = horrorStingers[Random.Range(0, horrorStingers.Length)];
                puzzleAudioSource.PlayOneShot(stinger);
            }
        }

        protected IEnumerator DeactivateHorrorTrigger(GameObject trigger, float delay)
        {
            yield return new WaitForSeconds(delay);
            trigger.SetActive(false);
        }

        protected virtual void TriggerPersonalHorror(ulong playerId)
        {
            // Get player's fear profile from GameManager
            var playerData = GameManager.Instance.GetPlayerData(playerId);
            if (playerData != null && playerData.fearProfile != null)
            {
                // Trigger horror based on their specific fears
                TriggerPersonalHorrorClientRpc(playerId);
            }
        }

        [ClientRpc]
        protected void TriggerPersonalHorrorClientRpc(ulong targetPlayerId)
        {
            if (NetworkManager.Singleton.LocalClientId == targetPlayerId)
            {
                // Client-side horror effects (visual distortions, sounds, etc.)
                StartCoroutine(PersonalHorrorSequence());
            }
        }

        protected virtual IEnumerator PersonalHorrorSequence()
        {
            // Override in derived classes for specific horror effects
            yield return new WaitForSeconds(3f);
        }

        protected virtual void OnTimeExpired()
        {
            if (!IsServer) return;

            isRoomActive.Value = false;
            OnPuzzleFailed?.Invoke();

            // Entity becomes aggressive
            var entity = GameManager.Instance.GetEntity();
            if (entity != null)
            {
                StartCoroutine(EntityAttackSequence());
            }
        }

        protected virtual IEnumerator EntityAttackSequence()
        {
            // The Entity hunts all players in the room
            yield return new WaitForSeconds(2f);
            
            // Force complete the room (failure state)
            CompleteRoom(false);
        }

        protected void CompleteRoom(bool success)
        {
            if (!IsServer) return;

            isRoomActive.Value = false;
            
            if (roomUpdateCoroutine != null)
            {
                StopCoroutine(roomUpdateCoroutine);
            }
            
            if (lightingCoroutine != null)
            {
                StopCoroutine(lightingCoroutine);
            }

            // Open exit door
            if (exitDoor != null)
            {
                OpenExitDoor();
            }

            // Notify game manager
            OnRoomCompleted?.Invoke(roomName);
        }

        protected virtual void OpenExitDoor()
        {
            // Animate door opening
            if (exitDoor != null)
            {
                Animator doorAnimator = exitDoor.GetComponent<Animator>();
                if (doorAnimator != null)
                {
                    doorAnimator.SetTrigger("Open");
                }
            }
        }

        public void OnPlayerInteract(ulong playerId, GameObject interactedObject)
        {
            if (!IsServer) return;

            // Handle player interactions with puzzle objects
            HandlePuzzleInteraction(playerId, interactedObject);
        }

        protected abstract void HandlePuzzleInteraction(ulong playerId, GameObject puzzleObject);

        protected void UpdatePuzzleProgress(float newProgress)
        {
            if (!IsServer) return;

            puzzleProgress.Value = Mathf.Clamp01(newProgress);
            OnPuzzleProgressChanged?.Invoke(puzzleProgress.Value);
        }

        public float GetRoomProgress()
        {
            return puzzleProgress.Value;
        }

        public float GetTimeRemaining()
        {
            return Mathf.Max(0, roomTimeLimit - roomTimer.Value);
        }

        protected override void OnDestroy()
        {
            base.OnDestroy();

            if (roomUpdateCoroutine != null)
            {
                StopCoroutine(roomUpdateCoroutine);
            }

            if (lightingCoroutine != null)
            {
                StopCoroutine(lightingCoroutine);
            }
        }
    }
}