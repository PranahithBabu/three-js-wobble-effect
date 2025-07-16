# 🎙️ Three.js Wobble Effect – Audio-Reactive 3D Visual

An elegant and immersive **3D wobble animation** built with [Three.js](https://threejs.org/) and GLSL shaders. The visual responds in real-time to microphone input, changing **color based on speaker state** (user or system) and **wobble intensity based on audio frequency** — perfect for voice interfaces, ambient UIs, or interactive installations.

---

## 🌟 Features

- 🔊 Real-time microphone input with smooth audio-reactive animation
- 🎨 Color shift based on speaker role (e.g., user vs system response)
- 📈 Frequency-sensitive wobble intensity for rich, dynamic visuals
- 🌀 Organic 3D pulse effect using custom shaders
- ⚙️ Lightweight and framework-agnostic – runs in any browser

---

## 🎬 Demonstration
<div align="center">
  <img src="audio_viz_demo.gif" alt="Audio visualizer demo" />
</div>
---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/PranahithBabu/three-js-wobble-effect.git
cd three-js-wobble-effect
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
#### Backend
```bash
npm start
```
#### Frontend
```bash
npx parcel ./src/index.html
```
Visit http://localhost:1234 to see the effect in action!

## 🛠️ Built With
- Three.js
- GLSL shaders (vertex + fragment)
- Vite (for fast dev setup)

---

## 🎯 Use Cases
- Voice interface visual feedback (e.g., assistants, bots)
- Audio/music visualisation
- Landing page animations
- Micro-interactions and UI experiments

---

*(Feel free to fork this repository. Please let me know if you want to add **customization instructions** (e.g. how to set different colors), or if you'd like help turning this into a **React component** or **NPM package**.)*
