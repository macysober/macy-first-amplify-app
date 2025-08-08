using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Unity.Netcode;
using UnityEngine.AI;
using TheDwelling.Core;

namespace TheDwelling.Entity
{
    public enum EntityState
    {
        Dormant,
        Learning,
        Stalking,
        Hunting,
        Mimicking,
        Manifesting,
        Feeding
    }

    public enum EntityForm
    {
        Shadow,
        Humanoid,
        Nightmare,
        Environmental,
        Doppelganger
    }

    public class TheEntity : NetworkBehaviour
    {
        [Header("Entity Configuration")]
        [SerializeField] private EntityState currentState = EntityState.Dormant;
        [SerializeField] private EntityForm currentForm = EntityForm.Shadow;
        [SerializeField] private float learningRate = 0.1f;
        [SerializeField] private float aggressionLevel = 0f;
        [SerializeField] private float manifestationPower = 0f;

        [Header("AI Components")]
        private NavMeshAgent navAgent;
        private Animator animator;
        [SerializeField] private float moveSpeed = 3.5f;
        [SerializeField] private float stalkingDistance = 10f;
        [SerializeField] private float huntingSpeed = 6f;
        [SerializeField] private float detectionRadius = 15f;

        [Header("Player Knowledge")]
        private Dictionary<ulong, PlayerKnowledge> playerKnowledgeBase = new Dictionary<ulong, PlayerKnowledge>();
        private ulong currentTargetId = ulong.MaxValue;
        private List<PlayerData> allPlayers = new List<PlayerData>();

        [Header("Form Configurations")]
        [SerializeField] private GameObject[] formModels;
        [SerializeField] private Material shadowMaterial;
        [SerializeField] private Material nightmareMaterial;
        
        [Header("Audio")]
        [SerializeField] private AudioSource entityAudioSource;
        [SerializeField] private AudioClip[] whisperClips;
        [SerializeField] private AudioClip[] screamClips;
        [SerializeField] private AudioClip[] ambientClips;
        private Dictionary<ulong, List<AudioClip>> recordedPlayerAudio = new Dictionary<ulong, List<AudioClip>>();

        [Header("Manifestation")]
        [SerializeField] private GameObject[] fearManifestationPrefabs;
        [SerializeField] private float manifestationCooldown = 10f;
        private float lastManifestationTime = 0f;

        private Coroutine behaviorCoroutine;
        private Coroutine learningCoroutine;

        [System.Serializable]
        private class PlayerKnowledge
        {
            public ulong playerId;
            public FearProfile fearProfile;
            public List<FearType> confirmedFears = new List<FearType>();
            public float totalFearInflicted = 0f;
            public Vector3 lastKnownPosition;
            public float lastSeenTime;
            public List<string> behaviorPatterns = new List<string>();
            public int escapeAttempts = 0;
            public float averageStressLevel = 0f;
        }

        private void Awake()
        {
            navAgent = GetComponent<NavMeshAgent>();
            animator = GetComponent<Animator>();
            entityAudioSource = GetComponent<AudioSource>();
        }

        public override void OnNetworkSpawn()
        {
            if (IsServer)
            {
                StartEntityBehavior();
            }
        }

        public void Initialize(List<PlayerData> players)
        {
            if (!IsServer) return;

            allPlayers = players;
            
            // Initialize knowledge base for each player
            foreach (var player in players)
            {
                playerKnowledgeBase[player.clientId] = new PlayerKnowledge
                {
                    playerId = player.clientId,
                    fearProfile = new FearProfile(),
                    lastKnownPosition = player.lastKnownPosition,
                    lastSeenTime = Time.time
                };
            }

            // Start in dormant state
            ChangeState(EntityState.Dormant);
        }

        private void StartEntityBehavior()
        {
            behaviorCoroutine = StartCoroutine(EntityBehaviorLoop());
            learningCoroutine = StartCoroutine(LearningLoop());
        }

        private IEnumerator EntityBehaviorLoop()
        {
            while (true)
            {
                switch (currentState)
                {
                    case EntityState.Dormant:
                        yield return DormantBehavior();
                        break;
                    case EntityState.Learning:
                        yield return LearningBehavior();
                        break;
                    case EntityState.Stalking:
                        yield return StalkingBehavior();
                        break;
                    case EntityState.Hunting:
                        yield return HuntingBehavior();
                        break;
                    case EntityState.Mimicking:
                        yield return MimickingBehavior();
                        break;
                    case EntityState.Manifesting:
                        yield return ManifestingBehavior();
                        break;
                    case EntityState.Feeding:
                        yield return FeedingBehavior();
                        break;
                }

                yield return new WaitForSeconds(0.5f);
            }
        }

        private IEnumerator LearningLoop()
        {
            while (true)
            {
                // Continuously learn from player behaviors
                foreach (var player in allPlayers)
                {
                    if (player.isAlive)
                    {
                        AnalyzePlayerBehavior(player.clientId);
                    }
                }

                // Increase aggression over time
                aggressionLevel = Mathf.Min(aggressionLevel + 0.01f, 1f);
                
                // Increase manifestation power as we learn more fears
                UpdateManifestationPower();

                yield return new WaitForSeconds(2f);
            }
        }

        private void ChangeState(EntityState newState)
        {
            currentState = newState;
            
            // Update movement speed based on state
            switch (newState)
            {
                case EntityState.Dormant:
                case EntityState.Learning:
                    navAgent.speed = 0f;
                    break;
                case EntityState.Stalking:
                    navAgent.speed = moveSpeed;
                    break;
                case EntityState.Hunting:
                    navAgent.speed = huntingSpeed;
                    break;
            }

            // Notify clients of state change
            UpdateEntityStateClientRpc(newState);
        }

        [ClientRpc]
        private void UpdateEntityStateClientRpc(EntityState newState)
        {
            // Update visual/audio representation based on state
            UpdateEntityAppearance(newState);
        }

        private void UpdateEntityAppearance(EntityState state)
        {
            // Handle visual changes based on state
            switch (state)
            {
                case EntityState.Dormant:
                    SetFormAppearance(EntityForm.Shadow);
                    break;
                case EntityState.Hunting:
                    SetFormAppearance(EntityForm.Nightmare);
                    break;
            }
        }

        // BEHAVIOR IMPLEMENTATIONS

        private IEnumerator DormantBehavior()
        {
            // Initial observation phase - invisible and learning
            float dormantTime = 0f;
            
            while (dormantTime < 60f && aggressionLevel < 0.2f)
            {
                // Find a dark corner to observe from
                Vector3 hidingSpot = FindOptimalObservationPoint();
                navAgent.SetDestination(hidingSpot);
                
                // Play ambient sounds occasionally
                if (Random.value < 0.1f)
                {
                    PlayAmbientSound();
                }
                
                dormantTime += 2f;
                yield return new WaitForSeconds(2f);
            }
            
            // Transition to learning phase
            ChangeState(EntityState.Learning);
        }

        private IEnumerator LearningBehavior()
        {
            // Actively test player reactions
            float learningTime = 0f;
            
            while (learningTime < 120f)
            {
                // Select a random player to test
                PlayerData targetPlayer = SelectTargetPlayer();
                if (targetPlayer != null)
                {
                    // Move closer but stay hidden
                    Vector3 testPosition = GetTestPosition(targetPlayer.lastKnownPosition);
                    navAgent.SetDestination(testPosition);
                    
                    yield return new WaitForSeconds(3f);
                    
                    // Trigger a minor fear event
                    TriggerTestFearEvent(targetPlayer.clientId);
                }
                
                learningTime += 5f;
                yield return new WaitForSeconds(5f);
            }
            
            // Transition to stalking
            ChangeState(EntityState.Stalking);
        }

        private IEnumerator StalkingBehavior()
        {
            while (currentState == EntityState.Stalking)
            {
                // Select highest fear target
                PlayerData targetPlayer = SelectHighestFearTarget();
                
                if (targetPlayer != null)
                {
                    currentTargetId = targetPlayer.clientId;
                    
                    // Follow at a distance
                    Vector3 stalkPosition = targetPlayer.lastKnownPosition - 
                        (targetPlayer.lastKnownPosition - transform.position).normalized * stalkingDistance;
                    
                    navAgent.SetDestination(stalkPosition);
                    
                    // Occasionally make presence known
                    if (Random.value < 0.3f)
                    {
                        MakePresenceKnown(targetPlayer.clientId);
                    }
                    
                    // Transition to hunting if player is isolated
                    if (IsPlayerIsolated(targetPlayer.clientId) && aggressionLevel > 0.5f)
                    {
                        ChangeState(EntityState.Hunting);
                    }
                }
                
                yield return new WaitForSeconds(1f);
            }
        }

        private IEnumerator HuntingBehavior()
        {
            float huntTime = 0f;
            
            while (currentState == EntityState.Hunting && huntTime < 30f)
            {
                if (currentTargetId != ulong.MaxValue)
                {
                    PlayerData target = GetPlayerData(currentTargetId);
                    if (target != null && target.isAlive)
                    {
                        // Direct pursuit
                        navAgent.SetDestination(target.lastKnownPosition);
                        
                        // Check if we've caught the player
                        float distance = Vector3.Distance(transform.position, target.lastKnownPosition);
                        if (distance < 2f)
                        {
                            AttackPlayer(currentTargetId);
                            ChangeState(EntityState.Feeding);
                            yield break;
                        }
                        
                        // Scream to induce fear
                        if (Random.value < 0.4f)
                        {
                            PlayScream();
                        }
                    }
                }
                
                huntTime += 0.5f;
                yield return new WaitForSeconds(0.5f);
            }
            
            // Return to stalking if hunt fails
            ChangeState(EntityState.Stalking);
        }

        private IEnumerator MimickingBehavior()
        {
            // Transform into player or environmental object
            float mimicTime = 0f;
            
            // Choose a player to mimic
            PlayerData mimicTarget = SelectRandomAlivePlayer();
            if (mimicTarget != null)
            {
                SetFormAppearance(EntityForm.Doppelganger);
                
                while (mimicTime < 60f && currentState == EntityState.Mimicking)
                {
                    // Act like a player, lead others into traps
                    MimicPlayerBehavior(mimicTarget.clientId);
                    
                    mimicTime += 2f;
                    yield return new WaitForSeconds(2f);
                }
            }
            
            ChangeState(EntityState.Stalking);
        }

        private IEnumerator ManifestingBehavior()
        {
            // Create fear-based illusions
            if (Time.time - lastManifestationTime < manifestationCooldown)
            {
                ChangeState(EntityState.Stalking);
                yield break;
            }
            
            // Select a player with known fears
            PlayerData targetPlayer = SelectPlayerWithKnownFears();
            if (targetPlayer != null)
            {
                var knowledge = playerKnowledgeBase[targetPlayer.clientId];
                if (knowledge.confirmedFears.Count > 0)
                {
                    // Manifest their worst fear
                    FearType worstFear = knowledge.confirmedFears[0];
                    ManifestFear(worstFear, targetPlayer.lastKnownPosition);
                    
                    lastManifestationTime = Time.time;
                    
                    yield return new WaitForSeconds(10f);
                }
            }
            
            ChangeState(EntityState.Stalking);
        }

        private IEnumerator FeedingBehavior()
        {
            // Consume player's sanity/fear
            float feedTime = 0f;
            
            while (feedTime < 5f && currentTargetId != ulong.MaxValue)
            {
                DrainPlayerSanity(currentTargetId, 5f);
                manifestationPower += 0.1f;
                
                feedTime += 0.5f;
                yield return new WaitForSeconds(0.5f);
            }
            
            ChangeState(EntityState.Stalking);
        }

        // HELPER METHODS

        private Vector3 FindOptimalObservationPoint()
        {
            // Find a dark corner with good view of players
            Vector3 centerPoint = Vector3.zero;
            int aliveCount = 0;
            
            foreach (var player in allPlayers)
            {
                if (player.isAlive)
                {
                    centerPoint += player.lastKnownPosition;
                    aliveCount++;
                }
            }
            
            if (aliveCount > 0)
            {
                centerPoint /= aliveCount;
                
                // Find a position 15 units away from center
                Vector3 randomDirection = Random.insideUnitSphere;
                randomDirection.y = 0;
                randomDirection.Normalize();
                
                return centerPoint + randomDirection * 15f;
            }
            
            return transform.position;
        }

        private PlayerData SelectTargetPlayer()
        {
            List<PlayerData> alivePlayers = allPlayers.FindAll(p => p.isAlive);
            if (alivePlayers.Count > 0)
            {
                return alivePlayers[Random.Range(0, alivePlayers.Count)];
            }
            return null;
        }

        private PlayerData SelectHighestFearTarget()
        {
            PlayerData highestFearPlayer = null;
            float highestFear = 0f;
            
            foreach (var player in allPlayers)
            {
                if (player.isAlive && playerKnowledgeBase.ContainsKey(player.clientId))
                {
                    var knowledge = playerKnowledgeBase[player.clientId];
                    if (knowledge.averageStressLevel > highestFear)
                    {
                        highestFear = knowledge.averageStressLevel;
                        highestFearPlayer = player;
                    }
                }
            }
            
            return highestFearPlayer;
        }

        private bool IsPlayerIsolated(ulong playerId)
        {
            var player = GetPlayerData(playerId);
            if (player == null) return false;
            
            foreach (var otherPlayer in allPlayers)
            {
                if (otherPlayer.clientId != playerId && otherPlayer.isAlive)
                {
                    float distance = Vector3.Distance(player.lastKnownPosition, otherPlayer.lastKnownPosition);
                    if (distance < 10f)
                    {
                        return false;
                    }
                }
            }
            
            return true;
        }

        private void ManifestFear(FearType fearType, Vector3 position)
        {
            int prefabIndex = (int)fearType % fearManifestationPrefabs.Length;
            if (fearManifestationPrefabs[prefabIndex] != null)
            {
                GameObject manifestation = Instantiate(fearManifestationPrefabs[prefabIndex], position, Quaternion.identity);
                manifestation.GetComponent<NetworkObject>().Spawn();
                
                // Destroy after 30 seconds
                Destroy(manifestation, 30f);
            }
        }

        private void SetFormAppearance(EntityForm form)
        {
            currentForm = form;
            
            // Disable all form models
            foreach (var model in formModels)
            {
                if (model != null)
                    model.SetActive(false);
            }
            
            // Enable the appropriate model
            int formIndex = (int)form;
            if (formIndex < formModels.Length && formModels[formIndex] != null)
            {
                formModels[formIndex].SetActive(true);
            }
        }

        // PUBLIC METHODS FOR FEAR DETECTION INTEGRATION

        public void OnPlayerFearDetected(ulong playerId, FearType fearType, float intensity)
        {
            if (!IsServer) return;
            
            if (playerKnowledgeBase.ContainsKey(playerId))
            {
                var knowledge = playerKnowledgeBase[playerId];
                
                // Update fear profile
                if (!knowledge.fearProfile.fearIntensities.ContainsKey(fearType))
                {
                    knowledge.fearProfile.fearIntensities[fearType] = 0f;
                }
                
                knowledge.fearProfile.fearIntensities[fearType] = 
                    Mathf.Max(knowledge.fearProfile.fearIntensities[fearType], intensity);
                
                // Confirm fear if intensity is high enough
                if (intensity > 0.7f && !knowledge.confirmedFears.Contains(fearType))
                {
                    knowledge.confirmedFears.Add(fearType);
                    
                    // Entity learns and becomes more aggressive
                    learningRate += 0.05f;
                    aggressionLevel += 0.1f;
                }
                
                knowledge.totalFearInflicted += intensity;
                knowledge.averageStressLevel = (knowledge.averageStressLevel + intensity) / 2f;
            }
        }

        private void AnalyzePlayerBehavior(ulong playerId)
        {
            var player = GetPlayerData(playerId);
            if (player == null) return;
            
            var knowledge = playerKnowledgeBase[playerId];
            
            // Update position tracking
            Vector3 movement = player.lastKnownPosition - knowledge.lastKnownPosition;
            if (movement.magnitude > 5f)
            {
                knowledge.behaviorPatterns.Add("rapid_movement");
                knowledge.escapeAttempts++;
            }
            
            knowledge.lastKnownPosition = player.lastKnownPosition;
            knowledge.lastSeenTime = Time.time;
        }

        private void UpdateManifestationPower()
        {
            int totalConfirmedFears = 0;
            foreach (var knowledge in playerKnowledgeBase.Values)
            {
                totalConfirmedFears += knowledge.confirmedFears.Count;
            }
            
            manifestationPower = Mathf.Min((float)totalConfirmedFears / 20f, 1f);
        }

        private PlayerData GetPlayerData(ulong clientId)
        {
            return allPlayers.Find(p => p.clientId == clientId);
        }

        private PlayerData SelectRandomAlivePlayer()
        {
            var alivePlayers = allPlayers.FindAll(p => p.isAlive);
            if (alivePlayers.Count > 0)
            {
                return alivePlayers[Random.Range(0, alivePlayers.Count)];
            }
            return null;
        }

        private PlayerData SelectPlayerWithKnownFears()
        {
            PlayerData bestTarget = null;
            int mostFears = 0;
            
            foreach (var player in allPlayers)
            {
                if (player.isAlive && playerKnowledgeBase.ContainsKey(player.clientId))
                {
                    var knowledge = playerKnowledgeBase[player.clientId];
                    if (knowledge.confirmedFears.Count > mostFears)
                    {
                        mostFears = knowledge.confirmedFears.Count;
                        bestTarget = player;
                    }
                }
            }
            
            return bestTarget;
        }

        private Vector3 GetTestPosition(Vector3 playerPosition)
        {
            // Get a position near the player but out of direct sight
            Vector3 offset = Random.insideUnitSphere * 8f;
            offset.y = 0;
            return playerPosition + offset;
        }

        private void TriggerTestFearEvent(ulong playerId)
        {
            // Trigger minor events to test reactions
            int eventType = Random.Range(0, 4);
            
            switch (eventType)
            {
                case 0:
                    // Footsteps
                    PlayFootstepsNearPlayer(playerId);
                    break;
                case 1:
                    // Whispers
                    PlayWhisperNearPlayer(playerId);
                    break;
                case 2:
                    // Object movement
                    MoveObjectNearPlayer(playerId);
                    break;
                case 3:
                    // Shadow glimpse
                    ShowBriefGlimpse(playerId);
                    break;
            }
        }

        private void MakePresenceKnown(ulong playerId)
        {
            // More aggressive presence indicators
            if (Random.value < 0.5f)
            {
                PlayWhisperNearPlayer(playerId);
            }
            else
            {
                ShowBriefGlimpse(playerId);
            }
        }

        private void AttackPlayer(ulong playerId)
        {
            // Deal damage or reduce sanity dramatically
            DrainPlayerSanity(playerId, 30f);
            
            // Play attack animation and sound
            PlayScream();
        }

        private void DrainPlayerSanity(ulong playerId, float amount)
        {
            var player = GetPlayerData(playerId);
            if (player != null)
            {
                player.sanity = Mathf.Max(0, player.sanity - amount);
                
                if (player.sanity <= 0)
                {
                    // Player loses their mind
                    GameManager.Instance.OnPlayerDeath(playerId);
                }
            }
        }

        private void MimicPlayerBehavior(ulong mimicTargetId)
        {
            // Act like the player, possibly lead others astray
            // This would involve more complex behavior patterns
        }

        // AUDIO METHODS

        private void PlayAmbientSound()
        {
            if (ambientClips.Length > 0)
            {
                AudioClip clip = ambientClips[Random.Range(0, ambientClips.Length)];
                entityAudioSource.PlayOneShot(clip, 0.5f);
            }
        }

        private void PlayScream()
        {
            if (screamClips.Length > 0)
            {
                AudioClip clip = screamClips[Random.Range(0, screamClips.Length)];
                entityAudioSource.PlayOneShot(clip, 1f);
            }
        }

        private void PlayFootstepsNearPlayer(ulong playerId)
        {
            // Implementation for 3D positioned audio
        }

        private void PlayWhisperNearPlayer(ulong playerId)
        {
            if (whisperClips.Length > 0)
            {
                AudioClip clip = whisperClips[Random.Range(0, whisperClips.Length)];
                // Position audio near player
            }
        }

        private void MoveObjectNearPlayer(ulong playerId)
        {
            // Find and move physics objects near the player
        }

        private void ShowBriefGlimpse(ulong playerId)
        {
            // Briefly become visible to specific player
            StartCoroutine(BriefVisibilityCoroutine(playerId));
        }

        private IEnumerator BriefVisibilityCoroutine(ulong playerId)
        {
            // Make visible for 0.2 seconds
            SetVisibilityForPlayer(playerId, true);
            yield return new WaitForSeconds(0.2f);
            SetVisibilityForPlayer(playerId, false);
        }

        private void SetVisibilityForPlayer(ulong playerId, bool visible)
        {
            // This would use layer masking or other techniques
            // to show/hide from specific players
        }
    }
}