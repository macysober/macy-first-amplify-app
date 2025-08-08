using UnityEngine;
using UnityEngine.InputSystem;

namespace TheDwelling.Player
{
    // This is a simplified version for the new Input System
    // In production, you'd generate this from Input Actions asset
    public class PlayerInput : IInputActionCollection
    {
        private InputActionAsset asset;
        private InputActionMap playerMap;
        
        // Actions
        public InputAction Move { get; private set; }
        public InputAction Look { get; private set; }
        public InputAction Jump { get; private set; }
        public InputAction Run { get; private set; }
        public InputAction Crouch { get; private set; }
        public InputAction Interact { get; private set; }
        
        public PlayerInput()
        {
            asset = ScriptableObject.CreateInstance<InputActionAsset>();
            
            // Create Player action map
            playerMap = asset.AddActionMap("Player");
            
            // Movement
            Move = playerMap.AddAction("Move", binding: "<Gamepad>/leftStick");
            Move.AddCompositeBinding("2DVector")
                .With("Up", "<Keyboard>/w")
                .With("Down", "<Keyboard>/s")
                .With("Left", "<Keyboard>/a")
                .With("Right", "<Keyboard>/d");
            
            // Look
            Look = playerMap.AddAction("Look", binding: "<Gamepad>/rightStick");
            Look.AddBinding("<Mouse>/delta");
            
            // Jump
            Jump = playerMap.AddAction("Jump", binding: "<Gamepad>/buttonSouth");
            Jump.AddBinding("<Keyboard>/space");
            
            // Run
            Run = playerMap.AddAction("Run", binding: "<Gamepad>/leftTrigger");
            Run.AddBinding("<Keyboard>/leftShift");
            
            // Crouch
            Crouch = playerMap.AddAction("Crouch", binding: "<Gamepad>/buttonEast");
            Crouch.AddBinding("<Keyboard>/leftCtrl");
            
            // Interact
            Interact = playerMap.AddAction("Interact", binding: "<Gamepad>/buttonWest");
            Interact.AddBinding("<Keyboard>/e");
        }
        
        public void Enable()
        {
            asset.Enable();
        }
        
        public void Disable()
        {
            asset.Disable();
        }
        
        public void Dispose()
        {
            Object.Destroy(asset);
        }
        
        // IInputActionCollection implementation
        public InputBinding? bindingMask { get; set; }
        public ReadOnlyArray<InputDevice>? devices { get; set; }
        public ReadOnlyArray<InputControlScheme> controlSchemes => asset.controlSchemes;
        public bool Contains(InputAction action) => asset.Contains(action);
        public IEnumerator<InputAction> GetEnumerator() => asset.GetEnumerator();
        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator() => GetEnumerator();
    }
}