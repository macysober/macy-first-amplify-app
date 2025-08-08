using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Unity.Netcode;
using UnityEngine.Rendering;
using TheDwelling.Core;

namespace TheDwelling.Rooms
{
    public class MirrorRoom : BaseRoom
    {
        [Header("Mirror Configuration")]
        [SerializeField] private Mirror[] mirrors = new Mirror[7];
        [SerializeField] private int trueMirrorIndex = -1;
        [SerializeField] private float mirrorDistortionRate = 0.1f;
        [SerializeField] private GameObject mirrorShatterEffect;

        [Header("Mirror Puzzle")]
        private NetworkVariable<int> currentStage = new NetworkVariable<int>(0);
        private NetworkList<int> playerMirrorChoices;
        private Dictionary<ulong, int> playerAssignedMirrors = new Dictionary<ulong, int>();
        private List<int> correctSequence = new List<int>();
        private List<int> playerInputSequence = new List<int>();

        [Header("Horror Elements")]
        [SerializeField] private GameObject doppelgangerPrefab;
        [SerializeField] private AudioClip[] whisperClips;
        [SerializeField] private AudioClip mirrorCrackClip;
        [SerializeField] private Material corruptedReflectionMaterial;
        private Dictionary<ulong, GameObject> playerDoppelgangers = new Dictionary<ulong, GameObject>();

        private void Awake()
        {
            playerMirrorChoices = new NetworkList<int>();
            roomName = "The Mirror Room";
        }

        protected override void InitializePuzzle()
        {
            if (!IsServer) return;

            // Randomly select the true mirror
            trueMirrorIndex = Random.Range(0, mirrors.Length);
            
            // Generate the correct sequence (3-step sequence)
            correctSequence.Clear();
            for (int i = 0; i < 3; i++)
            {
                correctSequence.Add(Random.Range(0, mirrors.Length));
            }

            // Initialize mirrors
            for (int i = 0; i < mirrors.Length; i++)
            {
                mirrors[i].Initialize(i, i == trueMirrorIndex);
                mirrors[i].OnPlayerInteraction += OnMirrorInteracted;
            }

            // Start with all mirrors showing normal reflections
            SetMirrorStage(0);
        }

        private void SetMirrorStage(int stage)
        {
            currentStage.Value = stage;

            switch (stage)
            {
                case 0: // Initial exploration
                    InitialStageSetup();
                    break;
                case 1: // First distortion
                    FirstDistortionSetup();
                    break;
                case 2: // Multiple realities
                    MultipleRealitiesSetup();
                    break;
                case 3: // Final alignment
                    FinalAlignmentSetup();
                    break;
            }
        }

        private void InitialStageSetup()
        {
            // All mirrors show normal reflections
            foreach (var mirror in mirrors)
            {
                mirror.SetDistortionLevel(0f);
                mirror.ShowNormalReflection();
            }

            StartCoroutine(InitialStageProgression());
        }

        private IEnumerator InitialStageProgression()
        {
            yield return new WaitForSeconds(30f);
            
            // Start introducing subtle wrongness
            int randomMirror = Random.Range(0, mirrors.Length);
            if (randomMirror != trueMirrorIndex)
            {
                mirrors[randomMirror].ShowDelayedReflection(0.5f);
            }

            yield return new WaitForSeconds(30f);
            SetMirrorStage(1);
        }

        private void FirstDistortionSetup()
        {
            // One mirror shows the truth, others begin to distort
            for (int i = 0; i < mirrors.Length; i++)
            {
                if (i == trueMirrorIndex)
                {
                    mirrors[i].RevealTruth();
                }
                else
                {
                    mirrors[i].SetDistortionLevel(Random.Range(0.1f, 0.3f));
                    
                    // Some mirrors show horror
                    if (Random.value < 0.3f)
                    {
                        mirrors[i].ShowHorrorReflection();
                    }
                }
            }

            // Players must find and interact with the true mirror
            StartCoroutine(WaitForTrueMirrorDiscovery());
        }

        private IEnumerator WaitForTrueMirrorDiscovery()
        {
            bool discovered = false;
            float timeLimit = 120f;
            float elapsed = 0f;

            while (!discovered && elapsed < timeLimit)
            {
                // Check if any player has interacted with the true mirror
                if (playerInputSequence.Contains(trueMirrorIndex))
                {
                    discovered = true;
                    UpdatePuzzleProgress(0.33f);
                    SetMirrorStage(2);
                    yield break;
                }

                elapsed += 1f;
                yield return new WaitForSeconds(1f);
            }

            // Time ran out - increase horror
            IncreaseMirrorHorror();
        }

        private void MultipleRealitiesSetup()
        {
            // Each player sees different things in mirrors
            AssignPlayerMirrors();

            // Create doppelgangers
            foreach (var player in playersInRoom)
            {
                if (player.isAlive)
                {
                    CreateDoppelganger(player.clientId);
                }
            }

            // Mirrors now show different realities per player
            UpdateMirrorsForMultipleRealities();
            
            StartCoroutine(MultipleRealitiesProgression());
        }

        private void AssignPlayerMirrors()
        {
            int mirrorIndex = 0;
            foreach (var player in playersInRoom)
            {
                if (player.isAlive)
                {
                    playerAssignedMirrors[player.clientId] = mirrorIndex % mirrors.Length;
                    mirrorIndex++;
                }
            }
        }

        private void CreateDoppelganger(ulong playerId)
        {
            if (doppelgangerPrefab != null)
            {
                GameObject doppelganger = Instantiate(doppelgangerPrefab);
                doppelganger.GetComponent<NetworkObject>().Spawn();
                playerDoppelgangers[playerId] = doppelganger;
                
                // Position behind a random mirror
                int mirrorIndex = Random.Range(0, mirrors.Length);
                doppelganger.transform.position = mirrors[mirrorIndex].transform.position + 
                    mirrors[mirrorIndex].transform.forward * -2f;
            }
        }

        private IEnumerator MultipleRealitiesProgression()
        {
            // Players must work together to identify patterns
            float progressTime = 0f;
            
            while (progressTime < 180f) // 3 minutes
            {
                // Check for correct pattern input
                if (CheckSequenceProgress())
                {
                    UpdatePuzzleProgress(0.66f);
                    SetMirrorStage(3);
                    yield break;
                }

                // Occasionally swap reflections
                if (Random.value < 0.05f)
                {
                    SwapRandomReflections();
                }

                progressTime += 1f;
                yield return new WaitForSeconds(1f);
            }

            // Failed - mirrors begin to shatter
            StartCoroutine(MirrorShatterSequence());
        }

        private void FinalAlignmentSetup()
        {
            // All mirrors must be touched in correct sequence
            playerInputSequence.Clear();
            
            // Show the sequence briefly in the true mirror
            StartCoroutine(ShowCorrectSequence());
        }

        private IEnumerator ShowCorrectSequence()
        {
            // Flash the correct sequence in the true mirror
            Mirror trueMirror = mirrors[trueMirrorIndex];
            
            foreach (int index in correctSequence)
            {
                mirrors[index].FlashHighlight(1f);
                yield return new WaitForSeconds(1.5f);
            }

            // Now players must replicate
            yield return new WaitForSeconds(2f);
            
            // Start final timer
            StartCoroutine(FinalSequenceTimer());
        }

        private IEnumerator FinalSequenceTimer()
        {
            float timeLimit = 60f;
            float elapsed = 0f;

            while (elapsed < timeLimit)
            {
                if (playerInputSequence.Count >= correctSequence.Count)
                {
                    if (CheckFinalSequence())
                    {
                        OnPuzzleComplete();
                        yield break;
                    }
                    else
                    {
                        // Wrong sequence - reset and punish
                        playerInputSequence.Clear();
                        ShatterRandomMirror();
                    }
                }

                elapsed += 0.5f;
                yield return new WaitForSeconds(0.5f);
            }

            // Failed - all mirrors shatter
            StartCoroutine(MirrorShatterSequence());
        }

        protected override bool CheckPuzzleSolution()
        {
            // Puzzle is complete when final sequence is entered correctly
            return currentStage.Value == 4; // Completed stage
        }

        protected override void OnPuzzleComplete()
        {
            if (!IsServer) return;

            UpdatePuzzleProgress(1f);
            currentStage.Value = 4;

            // All mirrors show true reflections
            foreach (var mirror in mirrors)
            {
                mirror.ShowTrueReflection();
            }

            // Destroy doppelgangers
            foreach (var doppelganger in playerDoppelgangers.Values)
            {
                if (doppelganger != null)
                {
                    Destroy(doppelganger, 2f);
                }
            }

            CompleteRoom(true);
        }

        private void OnMirrorInteracted(int mirrorIndex, ulong playerId)
        {
            if (!IsServer) return;

            // Record interaction
            playerInputSequence.Add(mirrorIndex);
            
            // Limit sequence length
            if (playerInputSequence.Count > 10)
            {
                playerInputSequence.RemoveAt(0);
            }

            // Handle based on current stage
            switch (currentStage.Value)
            {
                case 1: // First distortion
                    if (mirrorIndex == trueMirrorIndex)
                    {
                        // Correct mirror found
                        mirrors[mirrorIndex].FlashHighlight(2f);
                    }
                    else
                    {
                        // Wrong mirror - increase distortion
                        mirrors[mirrorIndex].SetDistortionLevel(
                            mirrors[mirrorIndex].GetDistortionLevel() + 0.1f
                        );
                    }
                    break;

                case 2: // Multiple realities
                    HandleMultipleRealitiesInteraction(mirrorIndex, playerId);
                    break;

                case 3: // Final alignment
                    // Check if following correct sequence
                    int sequenceIndex = playerInputSequence.Count - 1;
                    if (sequenceIndex < correctSequence.Count)
                    {
                        if (mirrorIndex == correctSequence[sequenceIndex])
                        {
                            mirrors[mirrorIndex].FlashHighlight(0.5f);
                        }
                        else
                        {
                            // Wrong - create horror feedback
                            TriggerMirrorHorror(mirrorIndex, playerId);
                        }
                    }
                    break;
            }

            // Trigger whispers
            if (Random.value < 0.3f)
            {
                PlayMirrorWhisper(mirrorIndex);
            }
        }

        private void HandleMultipleRealitiesInteraction(int mirrorIndex, ulong playerId)
        {
            if (playerAssignedMirrors.ContainsKey(playerId))
            {
                if (mirrorIndex == playerAssignedMirrors[playerId])
                {
                    // Player found their assigned mirror
                    mirrors[mirrorIndex].ShowPlayerTruth(playerId);
                }
                else
                {
                    // Show another player's reality
                    mirrors[mirrorIndex].ShowAlternateReality();
                }
            }
        }

        private bool CheckSequenceProgress()
        {
            // Check if players are discovering the pattern
            // This is simplified - in full implementation would be more complex
            return playerInputSequence.Count >= 5 && Random.value < 0.1f;
        }

        private bool CheckFinalSequence()
        {
            if (playerInputSequence.Count < correctSequence.Count)
                return false;

            for (int i = 0; i < correctSequence.Count; i++)
            {
                int inputIndex = playerInputSequence.Count - correctSequence.Count + i;
                if (playerInputSequence[inputIndex] != correctSequence[i])
                    return false;
            }

            return true;
        }

        private void IncreaseMirrorHorror()
        {
            foreach (var mirror in mirrors)
            {
                mirror.IncreaseHorrorLevel();
            }
        }

        private void SwapRandomReflections()
        {
            int mirror1 = Random.Range(0, mirrors.Length);
            int mirror2 = Random.Range(0, mirrors.Length);
            
            if (mirror1 != mirror2)
            {
                mirrors[mirror1].SwapReflectionWith(mirrors[mirror2]);
            }
        }

        private void ShatterRandomMirror()
        {
            int mirrorIndex = Random.Range(0, mirrors.Length);
            ShatterMirror(mirrorIndex);
        }

        private void ShatterMirror(int mirrorIndex)
        {
            if (mirrorIndex < 0 || mirrorIndex >= mirrors.Length) return;

            Mirror mirror = mirrors[mirrorIndex];
            mirror.Shatter();

            // Spawn shatter effect
            if (mirrorShatterEffect != null)
            {
                Instantiate(mirrorShatterEffect, mirror.transform.position, mirror.transform.rotation);
            }

            // Play shatter sound
            if (mirrorCrackClip != null && puzzleAudioSource != null)
            {
                puzzleAudioSource.PlayOneShot(mirrorCrackClip);
            }

            // Damage nearby players
            DamageNearbyPlayers(mirror.transform.position, 5f, 20f);
        }

        private IEnumerator MirrorShatterSequence()
        {
            // All mirrors shatter in sequence
            for (int i = 0; i < mirrors.Length; i++)
            {
                ShatterMirror(i);
                yield return new WaitForSeconds(0.5f);
            }

            // Room fails
            OnPuzzleFailed?.Invoke();
            CompleteRoom(false);
        }

        private void TriggerMirrorHorror(int mirrorIndex, ulong playerId)
        {
            // Create personalized horror in the mirror
            mirrors[mirrorIndex].ShowPersonalHorror(playerId);
            
            // Reduce player sanity
            var player = GameManager.Instance.GetPlayerData(playerId);
            if (player != null)
            {
                player.sanity -= 10f;
            }
        }

        private void PlayMirrorWhisper(int mirrorIndex)
        {
            if (whisperClips.Length > 0 && mirrors[mirrorIndex] != null)
            {
                AudioSource mirrorAudio = mirrors[mirrorIndex].GetComponent<AudioSource>();
                if (mirrorAudio != null)
                {
                    AudioClip whisper = whisperClips[Random.Range(0, whisperClips.Length)];
                    mirrorAudio.PlayOneShot(whisper, 0.7f);
                }
            }
        }

        private void UpdateMirrorsForMultipleRealities()
        {
            foreach (var mirror in mirrors)
            {
                mirror.EnableMultipleRealitiesMode();
            }
        }

        private void DamageNearbyPlayers(Vector3 position, float radius, float damage)
        {
            foreach (var player in playersInRoom)
            {
                if (player.isAlive)
                {
                    GameObject playerObj = NetworkManager.Singleton.ConnectedClients[player.clientId].PlayerObject.gameObject;
                    float distance = Vector3.Distance(position, playerObj.transform.position);
                    
                    if (distance <= radius)
                    {
                        float damageAmount = damage * (1f - distance / radius);
                        player.sanity -= damageAmount;
                    }
                }
            }
        }

        protected override void HandlePuzzleInteraction(ulong playerId, GameObject puzzleObject)
        {
            Mirror mirror = puzzleObject.GetComponent<Mirror>();
            if (mirror != null)
            {
                mirror.OnPlayerInteract(playerId);
            }
        }

        protected override IEnumerator PersonalHorrorSequence()
        {
            // Mirror-specific horror: player sees themselves dying in reflections
            yield return new WaitForSeconds(3f);
        }
    }

    // Simplified Mirror component
    [System.Serializable]
    public class Mirror : MonoBehaviour
    {
        public System.Action<int, ulong> OnPlayerInteraction;
        
        private int mirrorIndex;
        private bool isTrueMirror;
        private float distortionLevel = 0f;
        private float horrorLevel = 0f;
        
        public void Initialize(int index, bool isTrue)
        {
            mirrorIndex = index;
            isTrueMirror = isTrue;
        }
        
        public void OnPlayerInteract(ulong playerId)
        {
            OnPlayerInteraction?.Invoke(mirrorIndex, playerId);
        }
        
        public void SetDistortionLevel(float level)
        {
            distortionLevel = Mathf.Clamp01(level);
            // Apply distortion to mirror shader/material
        }
        
        public float GetDistortionLevel()
        {
            return distortionLevel;
        }
        
        public void ShowNormalReflection() { }
        public void ShowDelayedReflection(float delay) { }
        public void ShowHorrorReflection() { }
        public void RevealTruth() { }
        public void FlashHighlight(float duration) { }
        public void ShowTrueReflection() { }
        public void ShowPlayerTruth(ulong playerId) { }
        public void ShowAlternateReality() { }
        public void IncreaseHorrorLevel() { horrorLevel += 0.1f; }
        public void SwapReflectionWith(Mirror other) { }
        public void Shatter() { }
        public void ShowPersonalHorror(ulong playerId) { }
        public void EnableMultipleRealitiesMode() { }
    }
}