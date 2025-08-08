using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Unity.Netcode;
using UnityEngine.Events;

namespace TheDwelling.Core
{
    public class GameManager : NetworkBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Game State")]
        [SerializeField] private GameState currentState = GameState.WaitingForPlayers;
        [SerializeField] private int requiredPlayers = 4;
        [SerializeField] private float gameTimeLimit = 3600f; // 60 minutes

        [Header("Player Management")]
        [SerializeField] private List<PlayerData> connectedPlayers = new List<PlayerData>();
        [SerializeField] private GameObject playerPrefab;
        [SerializeField] private Transform[] spawnPoints;

        [Header("Room Management")]
        [SerializeField] private GameObject[] roomPrefabs;
        [SerializeField] private int currentRoomIndex = 0;
        private BaseRoom currentRoom;

        [Header("Entity Management")]
        [SerializeField] private GameObject entityPrefab;
        private TheEntity entityInstance;

        [Header("Events")]
        public UnityEvent<GameState> OnGameStateChanged;
        public UnityEvent<int> OnPlayerConnected;
        public UnityEvent<int> OnPlayerDisconnected;
        public UnityEvent<string> OnRoomCompleted;
        public UnityEvent OnAllPlayersDead;

        private NetworkVariable<float> gameTimer = new NetworkVariable<float>(0f);
        private NetworkVariable<int> alivePlayers = new NetworkVariable<int>(0);

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void Start()
        {
            if (IsServer)
            {
                NetworkManager.Singleton.OnClientConnectedCallback += OnClientConnected;
                NetworkManager.Singleton.OnClientDisconnectedCallback += OnClientDisconnected;
            }
        }

        private void Update()
        {
            if (!IsServer) return;

            if (currentState == GameState.InProgress)
            {
                gameTimer.Value += Time.deltaTime;

                if (gameTimer.Value >= gameTimeLimit)
                {
                    EndGame(false);
                }
            }
        }

        private void OnClientConnected(ulong clientId)
        {
            if (!IsServer) return;

            PlayerData newPlayer = new PlayerData
            {
                clientId = clientId,
                isAlive = true,
                sanity = 100f,
                fearProfile = new FearProfile()
            };

            connectedPlayers.Add(newPlayer);
            OnPlayerConnected?.Invoke((int)clientId);

            SpawnPlayer(clientId);

            if (connectedPlayers.Count >= requiredPlayers && currentState == GameState.WaitingForPlayers)
            {
                StartGame();
            }
        }

        private void OnClientDisconnected(ulong clientId)
        {
            if (!IsServer) return;

            connectedPlayers.RemoveAll(p => p.clientId == clientId);
            OnPlayerDisconnected?.Invoke((int)clientId);

            if (connectedPlayers.Count == 0)
            {
                ResetGame();
            }
        }

        private void SpawnPlayer(ulong clientId)
        {
            int spawnIndex = (int)(clientId % spawnPoints.Length);
            GameObject playerObj = Instantiate(playerPrefab, spawnPoints[spawnIndex].position, Quaternion.identity);
            playerObj.GetComponent<NetworkObject>().SpawnAsPlayerObject(clientId);
        }

        public void StartGame()
        {
            if (!IsServer) return;

            ChangeGameState(GameState.InProgress);
            alivePlayers.Value = connectedPlayers.Count;

            // Spawn the Entity
            SpawnEntity();

            // Load first room
            LoadRoom(0);

            // Start fear detection for all players
            StartCoroutine(InitializeFearDetection());
        }

        private void SpawnEntity()
        {
            if (entityPrefab != null)
            {
                GameObject entityObj = Instantiate(entityPrefab, Vector3.zero, Quaternion.identity);
                entityObj.GetComponent<NetworkObject>().Spawn();
                entityInstance = entityObj.GetComponent<TheEntity>();
                entityInstance.Initialize(connectedPlayers);
            }
        }

        private void LoadRoom(int roomIndex)
        {
            if (roomIndex >= roomPrefabs.Length)
            {
                EndGame(true); // All rooms completed
                return;
            }

            if (currentRoom != null)
            {
                Destroy(currentRoom.gameObject);
            }

            GameObject roomObj = Instantiate(roomPrefabs[roomIndex], Vector3.zero, Quaternion.identity);
            roomObj.GetComponent<NetworkObject>().Spawn();
            currentRoom = roomObj.GetComponent<BaseRoom>();
            currentRoom.OnRoomCompleted += OnRoomComplete;
            currentRoom.InitializeRoom(connectedPlayers);

            currentRoomIndex = roomIndex;
        }

        private void OnRoomComplete(string roomName)
        {
            if (!IsServer) return;

            OnRoomCompleted?.Invoke(roomName);
            
            // Give players a brief respite
            StartCoroutine(TransitionToNextRoom());
        }

        private IEnumerator TransitionToNextRoom()
        {
            // Fade to black, show completion message
            yield return new WaitForSeconds(5f);
            
            LoadRoom(currentRoomIndex + 1);
        }

        public void OnPlayerDeath(ulong clientId)
        {
            if (!IsServer) return;

            var player = connectedPlayers.Find(p => p.clientId == clientId);
            if (player != null)
            {
                player.isAlive = false;
                alivePlayers.Value--;

                if (alivePlayers.Value <= 0)
                {
                    OnAllPlayersDead?.Invoke();
                    EndGame(false);
                }
            }
        }

        private void EndGame(bool victory)
        {
            if (!IsServer) return;

            ChangeGameState(victory ? GameState.Victory : GameState.Defeat);
            
            // Show end game stats
            StartCoroutine(ShowEndGameStats());
        }

        private IEnumerator ShowEndGameStats()
        {
            // Display fear profiles, survival time, etc.
            yield return new WaitForSeconds(10f);
            
            // Return to lobby
            ResetGame();
        }

        private void ResetGame()
        {
            ChangeGameState(GameState.WaitingForPlayers);
            gameTimer.Value = 0f;
            currentRoomIndex = 0;
            
            if (currentRoom != null)
            {
                Destroy(currentRoom.gameObject);
            }
            
            if (entityInstance != null)
            {
                Destroy(entityInstance.gameObject);
            }
        }

        private void ChangeGameState(GameState newState)
        {
            currentState = newState;
            OnGameStateChanged?.Invoke(newState);
        }

        private IEnumerator InitializeFearDetection()
        {
            yield return new WaitForSeconds(2f);
            
            // Enable fear detection for all players
            foreach (var player in connectedPlayers)
            {
                EnableFearDetectionClientRpc(player.clientId);
            }
        }

        [ClientRpc]
        private void EnableFearDetectionClientRpc(ulong targetClientId)
        {
            if (NetworkManager.Singleton.LocalClientId == targetClientId)
            {
                var fearDetector = GameObject.FindObjectOfType<FearDetectionSystem>();
                if (fearDetector != null)
                {
                    fearDetector.EnableDetection();
                }
            }
        }

        public PlayerData GetPlayerData(ulong clientId)
        {
            return connectedPlayers.Find(p => p.clientId == clientId);
        }

        public List<PlayerData> GetAllPlayers()
        {
            return new List<PlayerData>(connectedPlayers);
        }

        public float GetGameTime()
        {
            return gameTimer.Value;
        }

        public TheEntity GetEntity()
        {
            return entityInstance;
        }
    }

    public enum GameState
    {
        WaitingForPlayers,
        InProgress,
        Victory,
        Defeat
    }

    [System.Serializable]
    public class PlayerData
    {
        public ulong clientId;
        public bool isAlive;
        public float sanity;
        public FearProfile fearProfile;
        public Vector3 lastKnownPosition;
        public float lastHeartRate;
    }
}