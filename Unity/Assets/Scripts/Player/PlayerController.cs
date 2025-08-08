using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Unity.Netcode;
using UnityEngine.InputSystem;
using TheDwelling.Core;

namespace TheDwelling.Player
{
    public class PlayerController : NetworkBehaviour
    {
        [Header("Movement")]
        [SerializeField] private float walkSpeed = 5f;
        [SerializeField] private float runSpeed = 8f;
        [SerializeField] private float crouchSpeed = 2f;
        [SerializeField] private float jumpForce = 5f;
        [SerializeField] private float mouseSensitivity = 2f;
        [SerializeField] private float gravity = -9.81f;
        
        [Header("Interaction")]
        [SerializeField] private float interactionDistance = 3f;
        [SerializeField] private LayerMask interactableLayer;
        [SerializeField] private GameObject interactionPrompt;
        
        [Header("Fear Effects")]
        [SerializeField] private float fearMovementPenalty = 0.5f;
        [SerializeField] private float fearShakeIntensity = 0.1f;
        [SerializeField] private AnimationCurve heartbeatCurve;
        
        [Header("Components")]
        private CharacterController characterController;
        private Camera playerCamera;
        private AudioSource audioSource;
        private FearDetectionSystem fearDetection;
        
        // Input
        private PlayerInput playerInput;
        private Vector2 moveInput;
        private Vector2 lookInput;
        private bool isRunning;
        private bool isCrouching;
        private bool isJumping;
        
        // Movement state
        private Vector3 velocity;
        private float currentSpeed;
        private bool isGrounded;
        private float originalHeight;
        
        // Camera
        private float xRotation = 0f;
        private Vector3 originalCameraPosition;
        private float cameraShakeTimer = 0f;
        
        // Interaction
        private GameObject currentInteractable;
        private Coroutine interactionCheckCoroutine;
        
        // Network
        private NetworkVariable<float> networkSanity = new NetworkVariable<float>(100f);
        private NetworkVariable<bool> networkIsAlive = new NetworkVariable<bool>(true);

        private void Awake()
        {
            characterController = GetComponent<CharacterController>();
            playerCamera = GetComponentInChildren<Camera>();
            audioSource = GetComponent<AudioSource>();
            fearDetection = GetComponent<FearDetectionSystem>();
            
            originalHeight = characterController.height;
            
            if (playerCamera != null)
            {
                originalCameraPosition = playerCamera.transform.localPosition;
            }
        }

        public override void OnNetworkSpawn()
        {
            if (!IsOwner)
            {
                // Disable camera and audio listener for non-local players
                if (playerCamera != null)
                {
                    playerCamera.enabled = false;
                    playerCamera.GetComponent<AudioListener>().enabled = false;
                }
                return;
            }

            // Setup input
            playerInput = new PlayerInput();
            playerInput.Enable();
            
            playerInput.Player.Move.performed += ctx => moveInput = ctx.ReadValue<Vector2>();
            playerInput.Player.Move.canceled += ctx => moveInput = Vector2.zero;
            
            playerInput.Player.Look.performed += ctx => lookInput = ctx.ReadValue<Vector2>();
            playerInput.Player.Look.canceled += ctx => lookInput = Vector2.zero;
            
            playerInput.Player.Run.performed += ctx => isRunning = true;
            playerInput.Player.Run.canceled += ctx => isRunning = false;
            
            playerInput.Player.Crouch.performed += ctx => ToggleCrouch();
            playerInput.Player.Jump.performed += ctx => Jump();
            playerInput.Player.Interact.performed += ctx => Interact();
            
            // Lock cursor
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
            
            // Start interaction checking
            interactionCheckCoroutine = StartCoroutine(CheckForInteractables());
        }

        private void Update()
        {
            if (!IsOwner) return;
            
            HandleMovement();
            HandleLook();
            HandleFearEffects();
            UpdateSanityDisplay();
        }

        private void HandleMovement()
        {
            // Ground check
            isGrounded = characterController.isGrounded;
            if (isGrounded && velocity.y < 0)
            {
                velocity.y = -2f;
            }

            // Calculate movement
            Vector3 move = transform.right * moveInput.x + transform.forward * moveInput.y;
            
            // Apply speed based on state
            if (isCrouching)
            {
                currentSpeed = crouchSpeed;
            }
            else if (isRunning && !isCrouching)
            {
                currentSpeed = runSpeed;
            }
            else
            {
                currentSpeed = walkSpeed;
            }
            
            // Apply fear movement penalty
            float fearMultiplier = 1f - (fearMovementPenalty * (1f - networkSanity.Value / 100f));
            currentSpeed *= fearMultiplier;
            
            // Move character
            characterController.Move(move * currentSpeed * Time.deltaTime);
            
            // Apply gravity
            velocity.y += gravity * Time.deltaTime;
            characterController.Move(velocity * Time.deltaTime);
            
            // Send position to server
            if (Time.frameCount % 5 == 0) // Every 5 frames
            {
                UpdatePlayerPositionServerRpc(transform.position);
            }
        }

        private void HandleLook()
        {
            float mouseX = lookInput.x * mouseSensitivity;
            float mouseY = lookInput.y * mouseSensitivity;
            
            // Rotate player body
            transform.Rotate(Vector3.up * mouseX);
            
            // Rotate camera
            xRotation -= mouseY;
            xRotation = Mathf.Clamp(xRotation, -90f, 90f);
            playerCamera.transform.localRotation = Quaternion.Euler(xRotation, 0f, 0f);
        }

        private void HandleFearEffects()
        {
            if (fearDetection == null) return;
            
            float stressLevel = fearDetection.GetCurrentStressLevel();
            
            // Camera shake based on fear
            if (stressLevel > 0.5f)
            {
                cameraShakeTimer += Time.deltaTime;
                float shakeAmount = fearShakeIntensity * stressLevel;
                
                Vector3 shakeOffset = new Vector3(
                    Mathf.PerlinNoise(cameraShakeTimer * 10f, 0f) - 0.5f,
                    Mathf.PerlinNoise(0f, cameraShakeTimer * 10f) - 0.5f,
                    0f
                ) * shakeAmount;
                
                playerCamera.transform.localPosition = originalCameraPosition + shakeOffset;
            }
            else
            {
                playerCamera.transform.localPosition = Vector3.Lerp(
                    playerCamera.transform.localPosition,
                    originalCameraPosition,
                    Time.deltaTime * 5f
                );
            }
            
            // Heartbeat audio based on fear
            if (fearDetection.IsPlayerPanicking())
            {
                if (!audioSource.isPlaying)
                {
                    PlayHeartbeat();
                }
            }
        }

        private void ToggleCrouch()
        {
            isCrouching = !isCrouching;
            
            if (isCrouching)
            {
                characterController.height = originalHeight * 0.5f;
                playerCamera.transform.localPosition = new Vector3(0, originalHeight * 0.25f, 0);
            }
            else
            {
                characterController.height = originalHeight;
                playerCamera.transform.localPosition = originalCameraPosition;
            }
        }

        private void Jump()
        {
            if (isGrounded && !isCrouching)
            {
                velocity.y = Mathf.Sqrt(jumpForce * -2f * gravity);
            }
        }

        private void Interact()
        {
            if (currentInteractable != null)
            {
                InteractWithObjectServerRpc(currentInteractable.GetComponent<NetworkObject>().NetworkObjectId);
            }
        }

        private IEnumerator CheckForInteractables()
        {
            while (true)
            {
                RaycastHit hit;
                if (Physics.Raycast(playerCamera.transform.position, playerCamera.transform.forward, 
                    out hit, interactionDistance, interactableLayer))
                {
                    GameObject hitObject = hit.collider.gameObject;
                    
                    if (hitObject != currentInteractable)
                    {
                        currentInteractable = hitObject;
                        ShowInteractionPrompt(true);
                    }
                }
                else
                {
                    if (currentInteractable != null)
                    {
                        currentInteractable = null;
                        ShowInteractionPrompt(false);
                    }
                }
                
                yield return new WaitForSeconds(0.1f);
            }
        }

        private void ShowInteractionPrompt(bool show)
        {
            if (interactionPrompt != null)
            {
                interactionPrompt.SetActive(show);
            }
        }

        private void UpdateSanityDisplay()
        {
            // Update UI based on sanity level
            // This would connect to a UI manager
        }

        private void PlayHeartbeat()
        {
            // Play heartbeat sound effect
            // Intensity based on fear level
        }

        [ServerRpc]
        private void UpdatePlayerPositionServerRpc(Vector3 position)
        {
            var playerData = GameManager.Instance.GetPlayerData(OwnerClientId);
            if (playerData != null)
            {
                playerData.lastKnownPosition = position;
            }
        }

        [ServerRpc]
        private void InteractWithObjectServerRpc(ulong objectId)
        {
            NetworkObject netObj = NetworkManager.Singleton.SpawnManager.SpawnedObjects[objectId];
            if (netObj != null)
            {
                // Check if it's in a room
                BaseRoom currentRoom = FindObjectOfType<BaseRoom>();
                if (currentRoom != null)
                {
                    currentRoom.OnPlayerInteract(OwnerClientId, netObj.gameObject);
                }
            }
        }

        public void TakeDamage(float amount)
        {
            if (!IsOwner) return;
            
            networkSanity.Value = Mathf.Max(0, networkSanity.Value - amount);
            
            if (networkSanity.Value <= 0)
            {
                Die();
            }
        }

        private void Die()
        {
            if (!IsOwner) return;
            
            networkIsAlive.Value = false;
            
            // Notify game manager
            NotifyDeathServerRpc();
            
            // Disable controls
            playerInput.Disable();
            
            // Death camera effect
            StartCoroutine(DeathSequence());
        }

        [ServerRpc]
        private void NotifyDeathServerRpc()
        {
            GameManager.Instance.OnPlayerDeath(OwnerClientId);
        }

        private IEnumerator DeathSequence()
        {
            // Fade to black, show death screen
            yield return new WaitForSeconds(3f);
            
            // Switch to spectator mode
            EnterSpectatorMode();
        }

        private void EnterSpectatorMode()
        {
            // Implement spectator camera
            characterController.enabled = false;
            // Allow free camera movement to watch other players
        }

        public override void OnNetworkDespawn()
        {
            if (IsOwner)
            {
                playerInput?.Disable();
                Cursor.lockState = CursorLockMode.None;
                Cursor.visible = true;
                
                if (interactionCheckCoroutine != null)
                {
                    StopCoroutine(interactionCheckCoroutine);
                }
            }
        }

        private void OnDestroy()
        {
            playerInput?.Dispose();
        }
    }
}