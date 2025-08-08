using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Unity.Netcode;
using TMPro;
using TheDwelling.Core;

namespace TheDwelling.UI
{
    public class GameUIManager : MonoBehaviour
    {
        [Header("HUD Elements")]
        [SerializeField] private GameObject hudPanel;
        [SerializeField] private Slider sanityBar;
        [SerializeField] private TextMeshProUGUI sanityText;
        [SerializeField] private Image sanityBarFill;
        [SerializeField] private Gradient sanityGradient;
        
        [Header("Fear Indicators")]
        [SerializeField] private GameObject fearIndicatorPanel;
        [SerializeField] private Image heartRateIndicator;
        [SerializeField] private TextMeshProUGUI heartRateText;
        [SerializeField] private AnimationCurve heartbeatAnimation;
        
        [Header("Room Info")]
        [SerializeField] private TextMeshProUGUI roomNameText;
        [SerializeField] private TextMeshProUGUI timerText;
        [SerializeField] private Slider progressBar;
        
        [Header("Effects")]
        [SerializeField] private Image screenOverlay;
        [SerializeField] private AnimationCurve fearOverlayCurve;
        [SerializeField] private Color normalOverlay = new Color(0, 0, 0, 0);
        [SerializeField] private Color fearOverlay = new Color(0.5f, 0, 0, 0.3f);
        [SerializeField] private Color insanityOverlay = new Color(0.8f, 0, 0.2f, 0.5f);
        
        [Header("Death Screen")]
        [SerializeField] private GameObject deathPanel;
        [SerializeField] private TextMeshProUGUI deathReasonText;
        [SerializeField] private Button spectateButton;
        
        [Header("Victory Screen")]
        [SerializeField] private GameObject victoryPanel;
        [SerializeField] private TextMeshProUGUI survivalTimeText;
        [SerializeField] private TextMeshProUGUI fearProfileText;
        
        [Header("Notifications")]
        [SerializeField] private GameObject notificationPrefab;
        [SerializeField] private Transform notificationContainer;
        private Queue<GameObject> notificationPool = new Queue<GameObject>();
        
        private PlayerController localPlayer;
        private FearDetectionSystem fearDetection;
        private float heartbeatTimer = 0f;
        private bool isDead = false;

        private void Start()
        {
            // Initialize UI
            if (hudPanel != null) hudPanel.SetActive(false);
            if (deathPanel != null) deathPanel.SetActive(false);
            if (victoryPanel != null) victoryPanel.SetActive(false);
            
            // Subscribe to game events
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnGameStateChanged.AddListener(OnGameStateChanged);
                GameManager.Instance.OnRoomCompleted.AddListener(OnRoomCompleted);
                GameManager.Instance.OnAllPlayersDead.AddListener(OnAllPlayersDead);
            }
            
            // Initialize notification pool
            for (int i = 0; i < 10; i++)
            {
                GameObject notification = Instantiate(notificationPrefab, notificationContainer);
                notification.SetActive(false);
                notificationPool.Enqueue(notification);
            }
        }

        private void Update()
        {
            if (localPlayer == null)
            {
                FindLocalPlayer();
                return;
            }
            
            if (!isDead)
            {
                UpdateHUD();
                UpdateFearEffects();
            }
        }

        private void FindLocalPlayer()
        {
            if (NetworkManager.Singleton != null && NetworkManager.Singleton.LocalClient != null)
            {
                GameObject playerObj = NetworkManager.Singleton.LocalClient.PlayerObject?.gameObject;
                if (playerObj != null)
                {
                    localPlayer = playerObj.GetComponent<PlayerController>();
                    fearDetection = playerObj.GetComponent<FearDetectionSystem>();
                    
                    if (localPlayer != null)
                    {
                        hudPanel.SetActive(true);
                    }
                }
            }
        }

        private void UpdateHUD()
        {
            // Update sanity
            if (GameManager.Instance != null)
            {
                var playerData = GameManager.Instance.GetPlayerData(NetworkManager.Singleton.LocalClientId);
                if (playerData != null)
                {
                    float sanity = playerData.sanity;
                    sanityBar.value = sanity / 100f;
                    sanityText.text = $"{Mathf.RoundToInt(sanity)}%";
                    sanityBarFill.color = sanityGradient.Evaluate(sanity / 100f);
                    
                    // Update heart rate
                    UpdateHeartRate(playerData.lastHeartRate);
                }
            }
            
            // Update room info
            BaseRoom currentRoom = FindObjectOfType<BaseRoom>();
            if (currentRoom != null)
            {
                roomNameText.text = currentRoom.name;
                
                float timeRemaining = currentRoom.GetTimeRemaining();
                int minutes = Mathf.FloorToInt(timeRemaining / 60f);
                int seconds = Mathf.FloorToInt(timeRemaining % 60f);
                timerText.text = $"{minutes:00}:{seconds:00}";
                
                progressBar.value = currentRoom.GetRoomProgress();
            }
        }

        private void UpdateHeartRate(float heartRate)
        {
            heartRateText.text = $"{Mathf.RoundToInt(heartRate)} BPM";
            
            // Animate heart icon
            heartbeatTimer += Time.deltaTime * (heartRate / 60f);
            float scale = 1f + heartbeatAnimation.Evaluate(heartbeatTimer % 1f) * 0.2f;
            heartRateIndicator.transform.localScale = Vector3.one * scale;
            
            // Color based on heart rate
            Color heartColor = Color.white;
            if (heartRate > 100f)
            {
                heartColor = Color.Lerp(Color.white, Color.red, (heartRate - 100f) / 60f);
            }
            heartRateIndicator.color = heartColor;
        }

        private void UpdateFearEffects()
        {
            if (fearDetection == null) return;
            
            float stressLevel = fearDetection.GetCurrentStressLevel();
            bool isPanicking = fearDetection.IsPlayerPanicking();
            
            // Update screen overlay
            Color targetColor = normalOverlay;
            if (isPanicking)
            {
                targetColor = insanityOverlay;
            }
            else if (stressLevel > 0.5f)
            {
                targetColor = Color.Lerp(normalOverlay, fearOverlay, stressLevel);
            }
            
            screenOverlay.color = Color.Lerp(screenOverlay.color, targetColor, Time.deltaTime * 2f);
            
            // Add screen distortion effects at high stress
            if (stressLevel > 0.7f)
            {
                // This would apply post-processing effects
                ApplyStressDistortion(stressLevel);
            }
        }

        private void ApplyStressDistortion(float intensity)
        {
            // Apply chromatic aberration, vignette, etc.
            // This would interface with post-processing volume
        }

        private void OnGameStateChanged(GameState newState)
        {
            switch (newState)
            {
                case GameState.WaitingForPlayers:
                    ShowNotification("Waiting for players...");
                    break;
                case GameState.InProgress:
                    ShowNotification("The nightmare begins...");
                    break;
                case GameState.Victory:
                    ShowVictoryScreen();
                    break;
                case GameState.Defeat:
                    if (!isDead)
                    {
                        ShowDefeatScreen("The Entity consumed all souls");
                    }
                    break;
            }
        }

        private void OnRoomCompleted(string roomName)
        {
            ShowNotification($"Escaped {roomName}!");
        }

        private void OnAllPlayersDead()
        {
            ShowNotification("All players have fallen to madness...");
        }

        public void OnPlayerDeath(string reason = "Consumed by fear")
        {
            isDead = true;
            hudPanel.SetActive(false);
            deathPanel.SetActive(true);
            deathReasonText.text = reason;
            
            // Fade screen to black
            StartCoroutine(DeathFadeEffect());
        }

        private IEnumerator DeathFadeEffect()
        {
            float fadeTime = 2f;
            float elapsed = 0f;
            
            while (elapsed < fadeTime)
            {
                elapsed += Time.deltaTime;
                float alpha = Mathf.Lerp(0f, 1f, elapsed / fadeTime);
                screenOverlay.color = new Color(0, 0, 0, alpha);
                yield return null;
            }
        }

        private void ShowVictoryScreen()
        {
            hudPanel.SetActive(false);
            victoryPanel.SetActive(true);
            
            // Display survival stats
            float survivalTime = GameManager.Instance.GetGameTime();
            int minutes = Mathf.FloorToInt(survivalTime / 60f);
            int seconds = Mathf.FloorToInt(survivalTime % 60f);
            survivalTimeText.text = $"Survival Time: {minutes:00}:{seconds:00}";
            
            // Display fear profile
            if (fearDetection != null)
            {
                var profile = fearDetection.GetFearProfile();
                string fearSummary = "Greatest Fears Discovered:\n";
                
                foreach (var fear in profile.fearIntensities)
                {
                    if (fear.Value > 0.5f)
                    {
                        fearSummary += $"- {fear.Key}: {Mathf.RoundToInt(fear.Value * 100)}%\n";
                    }
                }
                
                fearProfileText.text = fearSummary;
            }
        }

        private void ShowDefeatScreen(string reason)
        {
            OnPlayerDeath(reason);
        }

        public void ShowNotification(string message, float duration = 3f)
        {
            if (notificationPool.Count > 0)
            {
                GameObject notification = notificationPool.Dequeue();
                notification.SetActive(true);
                
                TextMeshProUGUI text = notification.GetComponentInChildren<TextMeshProUGUI>();
                if (text != null)
                {
                    text.text = message;
                }
                
                StartCoroutine(HideNotification(notification, duration));
            }
        }

        private IEnumerator HideNotification(GameObject notification, float delay)
        {
            yield return new WaitForSeconds(delay);
            
            // Fade out
            CanvasGroup canvasGroup = notification.GetComponent<CanvasGroup>();
            if (canvasGroup != null)
            {
                float fadeTime = 0.5f;
                float elapsed = 0f;
                
                while (elapsed < fadeTime)
                {
                    elapsed += Time.deltaTime;
                    canvasGroup.alpha = Mathf.Lerp(1f, 0f, elapsed / fadeTime);
                    yield return null;
                }
            }
            
            notification.SetActive(false);
            notificationPool.Enqueue(notification);
        }

        public void OnSpectateClicked()
        {
            deathPanel.SetActive(false);
            // Enter spectator mode
            if (localPlayer != null)
            {
                // This would be implemented in PlayerController
            }
        }

        public void OnReturnToLobbyClicked()
        {
            // Return to main menu or lobby
            NetworkManager.Singleton.Shutdown();
            UnityEngine.SceneManagement.SceneManager.LoadScene("MainMenu");
        }

        private void OnDestroy()
        {
            // Unsubscribe from events
            if (GameManager.Instance != null)
            {
                GameManager.Instance.OnGameStateChanged.RemoveListener(OnGameStateChanged);
                GameManager.Instance.OnRoomCompleted.RemoveListener(OnRoomCompleted);
                GameManager.Instance.OnAllPlayersDead.RemoveListener(OnAllPlayersDead);
            }
        }
    }
}