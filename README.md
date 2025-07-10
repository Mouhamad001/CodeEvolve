# CodeEvolve: Quantum Refactor

![CodeEvolve Logo](https://raw.githubusercontent.com/Mouhamad001/CodeEvolve/master/assets/codeevolve_logo.png)

**AI-Powered Code Transformation**

## 🚀 Project Overview

CodeEvolve: Quantum Refactor is a cutting-edge, AI-powered mobile application designed to revolutionize code transformation and refactoring. Built with React Native, it provides a futuristic and intuitive interface for developers to analyze, plan, refactor, and validate their codebase with the assistance of intelligent agents.

**Version:** Q1.0
**Environment:** React Native
**UI Theme:** Neon Cyberpunk
**Platform Targets:** iOS, Android

## ✨ Key Features

### 💻 Monaco Editor Integration
- Full-featured code editor with syntax highlighting for various languages.
- Theme switching, font size adjustment, and template insertion.
- Auto-completion, IntelliSense, and keyboard shortcuts.

### 🔮 Three.js Holographic Visualizer
- Real-time 3D code visualization (Abstract Syntax Tree, Code Diff).
- Interactive controls for exploring the holographic representation of code.
- Post-processing effects for an immersive experience.

### 🐙 Real GitHub API Integration
- Seamlessly import code from GitHub repositories using Personal Access Tokens.
- Browse repositories, select files, and import code with real-time progress tracking.
- Supports public and private repositories.

### 🤖 WebSocket Agent Communication
- Real-time bidirectional communication with a Flask backend.
- Live monitoring of intelligent agents (Analyzer, Planner, Coder, Validator).
- Asynchronous execution of code analysis, refactoring, and validation tasks.

### 📊 Performance Monitoring
- Real-time display of CPU, memory, GPU, and battery usage.
- Dynamic agent offloading for thermal management.

### 🔒 Security Features
- Code encryption (AES-256-GCM) and end-to-end encryption for cloud transfer.
- Isolated VM for code execution and secure enclave for LLM operations.

### ⚙️ Comprehensive Workflows
- **Code Import**: GitHub, Local Storage, Camera OCR.
- **Refactoring Flow**: Goal selection, AST visualization, agent collaboration, holographic diff, validation matrix.
- **Output**: Export formats including Git push, ZIP, and AR snapshot.

## 🛠️ Tech Stack

**Core:** React Native 0.74
**State Management:** MobX
**UI Kit:** Custom Cyberpunk Components
**AI Backend:** Flask API (Python)

**Native Dependencies:**
- **Shared:** `react-native-reanimated`, `react-native-gesture-handler`, `react-native-tree-sitter`, `react-native-fs`
- **iOS Specific:** `@react-native-arkit`
- **Android Specific:** `react-native-arcore`

## 🧠 Agent System

CodeEvolve leverages a sophisticated multi-agent system for intelligent code transformation:

- **Analyzer:** Cloud-based, with AST fingerprint caching for mobile support.
- **Planner:** Hybrid execution environment, utilizing Phi-3-Mini-4K (ONNX) for mobile models.
- **Coder:** Cloud-based, with diff patching for mobile optimization.
- **Validator:** Device-based, using NativeContainer for testing.

**Communication:** WebSockets + MessageQueue

## 🎨 UI/UX

**Theme:** Neon Cyberpunk
- **Colors:** Primary (`#00ffcc`), Secondary (`#ff00ff`), Background (`#0a0a18`), Error Glow (`#ff5555`)
- **Fonts:** Monospace (`JetBrainsMono-NF`), Holographic (`Quantico-Bold`)
- **Effects:** Neon shadows, scan lines, particle effects (low power mode).

**Components:**
- **Code Editor:** Monaco (integrated)
- **Holographic Visualizer:** Three.js (fallback for ARKit/ARCore)
- **Input Modes:** Voice, Gesture, Neural Impulse

## ⚡ Performance

- **Cross-Platform Optimizations:** Semantic boundaries for AST processing, LRU cache, adaptive hologram FPS (30-60fps), GPU acceleration.
- **Platform-Specific Optimizations:** Metal optimization (iOS), Neural Engine (CoreML), Vulkan support (Android), NPU acceleration (Qualcomm Hexagon).
- **Battery Optimization:** Background throttling, power-saver mode for LLM, balanced AR power profile.
- **Thermal Management:** Dynamic agent offloading based on CPU threshold (70°C).

**Performance Benchmarks:**
- Startup Time: <2s
- AST Parse (100KB): <500ms
- LLM Response: <3s

## 🛡️ Security

- **Data Handling:** AES-256-GCM code encryption, end-to-end encryption for cloud transfer.
- **Permissions:** Requires camera and filesystem access; never requests root access.
- **Sandboxing:** Isolated VM for code execution, secure enclave for LLM operations.

## 🧪 Testing

- **Unit Tests:** Jest
- **Integration Tests:** Detox

## 🌌 Futuristic Features

- **Neural Feedback:** Haptic patterns for refactoring rhythm, EEG adaptive UI for cognitive load.
- **Quantum UI:** Superposition rendering, entangled animations.
- **Temporal Debugging:** Code timeline view.

## 🚀 Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Mouhamad001/CodeEvolve.git
    cd CodeEvolve
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Start the development server:**
    ```bash
    pnpm run dev
    ```

4.  **For the Flask backend (Agent System):**
    ```bash
    cd CodeEvolveBackend
    source venv/bin/activate
    pip install -r requirements.txt
    python src/main.py
    ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

For any inquiries, please contact [Your Name/Email/GitHub Profile].


