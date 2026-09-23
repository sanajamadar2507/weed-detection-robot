# WEEDGUARD AI 🌿🤖
### AI-Powered Weed Detection & Smart Spraying System
**Academic Project Title:** AI-Based Weed Detection and Spraying Robot  
**Review Phase:** Mid-Semester Prototype & Software Verification  
**Version:** `1.0.0`

---

## 📌 1. Project Overview & Objective

Conventional weed management in agriculture relies heavily on uniform blanket spraying across entire crop fields. This practice causes severe economic losses through pesticide over-consumption, promotes herbicide-resistant weed varieties, contaminates groundwater, and degrades soil microbiome biodiversity.

**WEEDGUARD AI** is an autonomous smart-farming system engineered to detect, classify, and localize invasive weeds nestled within crop canopies in real-time. By computing confidence thresholds, the system automatically makes a **Spray / No-Spray / Human Review** decision and communicates targeted pulse commands to an autonomous field robot equipped with micro-solenoid valves.

---

## 🔬 2. Current Implementation & Academic Integrity

> [!IMPORTANT]
> **Prototype Stage Disclaimer (Mid-Semester Review):**
> The current mobile application is a complete, fully functional software controller. Real YOLOv8 neural network inference and physical ESP32 robotic hardware are currently **SIMULATED** using dedicated abstraction layers (`MockDetectionService` and `MockRobotService`). This provides an honest, reliable, and verifiable software prototype for mid-semester evaluation without falsifying hardware or inference connections.

```
CURRENT ARCHITECTURE (PROTOTYPE):
Mobile App (React Native / Expo)
   ├── MockDetectionService (Simulated YOLOv8 Computer Vision Pipeline)
   ├── SprayDecisionEngine (Configurable Safety Thresholds: 70% - 90%)
   ├── MockRobotService (Simulated Wi-Fi Command Dispatcher & Logging)
   └── StorageService (AsyncStorage Persistence for History & Settings)
```

---

## 🚀 3. Key Features

- **Autonomous Decision Engine**:
  - `SPRAY REQUIRED`: Weed identified with confidence $\ge$ configured threshold (e.g., $\ge 70\%$).
  - `NO SPRAY REQUIRED`: Clean, healthy crop canopy identified with zero weed intrusion.
  - `REVIEW REQUIRED`: Ambiguous leaf overlap or confidence $<$ safety threshold, prompting farmer visual inspection to prevent accidental crop destruction.
- **Visual AI Bounding Box Overlay**: Renders normalized coordinates, target labels, and confidence percentages over the detected weed.
- **Multi-Source Image Input**:
  - Live phone camera feed.
  - Device photo gallery.
  - **Bundled Demonstration Presets**: 3 field scenarios (*Tomato Crop with Weed*, *Clean Lettuce Canopy*, *Ambiguous Sprout*) for 100% dependable presentation demos.
- **Robot Command Simulator**:
  - Real-time Wi-Fi connection telemetry (Target IP: `192.168.4.1:80`).
  - Spray pulse command generator (`500ms` micro-bursts).
  - Emergency STOP actuator override.
  - Transparent activity logging with safety notices.
- **Persistent Local History**: Full offline archiving of all scans with thumbnail inspection, filtering, and single/batch deletion.
- **Adjustable Safety Thresholds**: On-the-fly threshold tuning (70%, 75%, 80%, 85%, 90%) from Settings.

---

## 🏗️ 4. Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Mobile Client** | React Native, Expo, TypeScript | Multi-platform mobile app (Android, Emulator, Physical Device, Web) |
| **State & Storage** | React Hooks, AsyncStorage | Local offline persistence for history, onboarding, and thresholds |
| **Navigation** | React Navigation v7 | Native Stack + Bottom Tabs (5 core workflows) |
| **Icons & UI** | Expo Vector Icons, Custom CSS | Modern Emerald agri-tech design language |
| **Computer Vision (Future)** | YOLOv8, PyTorch, OpenCV | Real-time object detection and segmentation (`best.pt`) |
| **Robotics & Actuation (Future)** | ESP32, ESP32-CAM, 12V Solenoid | Wireless optical capture and micro-diaphragm pump spraying |

---

## 📁 5. Project Folder Structure

```
EDI/
├── App.tsx                         # Root component with Providers & Navigation Container
├── app.json                        # Expo application manifest
├── package.json                    # Dependencies and run scripts
├── tsconfig.json                   # Strict TypeScript compiler options
├── README.md                       # Academic documentation & demo guide
└── src/
    ├── constants/
    │   ├── config.ts               # API endpoints, default thresholds, robot network config
    │   ├── theme.ts                # Emerald green agricultural design system
    │   └── samples.ts              # Preset field crop images for presentation demos
    ├── models/
    │   ├── detection.ts            # DetectionResult, BoundingBox, Decision types
    │   ├── robot.ts                # RobotState, CommandLog, ConnectionStatus
    │   └── history.ts              # HistoryItem, DashboardStats
    ├── services/
    │   ├── ai/
    │   │   ├── DetectionService.ts      # Abstract interface for computer vision
    │   │   ├── MockDetectionService.ts  # Prototype simulation service
    │   │   ├── YOLOv8DetectionService.ts# Pre-built REST API client for future backend
    │   │   └── index.ts                 # Service factory and runtime switcher
    │   ├── decision/
    │   │   └── SprayDecisionEngine.ts   # Multi-tier threshold decision logic
    │   └── robot/
    │       ├── RobotService.ts          # Abstract interface for robot commands
    │       ├── MockRobotService.ts      # Prototype simulator with safety disclaimers
    │       ├── ESP32RobotService.ts     # Pre-built Wi-Fi/HTTP controller for ESP32
    │       └── index.ts                 # Service factory and runtime switcher
    ├── storage/
    │   ├── storageKeys.ts          # AsyncStorage key constants
    │   └── storageService.ts       # Type-safe persistent storage wrappers
    ├── components/
    │   ├── BoundingBoxOverlay.tsx  # Dynamic weed localization box over image
    │   ├── StatusBadge.tsx         # Color-coded decision indicator
    │   ├── StatCard.tsx            # Dashboard metric analytics cards
    │   ├── RobotStatusCard.tsx     # Connection indicator & prototype banner
    │   ├── Header.tsx              # Agri-tech header with demo pills
    │   └── SampleImagePicker.tsx   # Fast preset selector for mid-sem reviews
    ├── navigation/
    │   ├── types.ts                # Strict route parameter definitions
    │   ├── BottomTabNavigator.tsx  # 5 Bottom tabs: Dashboard, Detect, Robot, History, Settings
    │   └── AppNavigator.tsx        # Stack: Splash, Onboarding, MainTabs, Result, Details, About
    └── screens/
        ├── SplashScreen.tsx        # Animated agri-tech branding with auto-routing
        ├── OnboardingScreen.tsx    # 3-step workflow guide (Capture -> Detect -> Decide)
        ├── DashboardScreen.tsx     # Central hub: quick actions, recent scan, telemetry
        ├── DetectScreen.tsx        # Plant detection: camera, gallery, sample presets, analyzer
        ├── ResultScreen.tsx        # Visual bounding box, confidence score, decision badges
        ├── DetailsScreen.tsx       # Comprehensive inspection of metadata and coordinates
        ├── RobotScreen.tsx         # Simulated Wi-Fi control panel and spray trigger
        ├── HistoryScreen.tsx       # Saved scan database with filtering and deletion
        ├── SettingsScreen.tsx      # Threshold selector, theme mode, reset defaults
        └── AboutScreen.tsx         # Problem, solution, system architecture diagrams
```

---

## 💻 6. Installation & Execution Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- NPM or Yarn
- [Expo Go](https://expo.dev/client) app installed on your physical Android phone (optional, for physical testing)

### Step 1: Clone / Open Repository
```powershell
cd c:\Users\sanaj\.gemini\antigravity\scratch\EDI
```

### Step 2: Install Dependencies
```powershell
npm install --legacy-peer-deps
```

### Step 3: Run the Application

#### Option A: Run on Android Physical Phone or Emulator
```powershell
npm run android
```
*Or run `npx expo start` and scan the displayed QR code with the **Expo Go** app on your Android phone.*

#### Option B: Run in Web Browser (Instant Verification)
```powershell
npm run web
```
The application will launch on `http://localhost:8081`.

---

## 🎬 7. Mid-Semester Presentation Demo Script

Follow this sequence during your academic review to demonstrate the full software workflow:

1. **Splash & Onboarding**:
   - Open app $\rightarrow$ View animated agri-tech logo and radar pulse.
   - Observe the 3-step onboarding walkthrough: *1. Capture*, *2. Detect*, *3. Decide*.
   - Tap `GET STARTED` (onboarding completion is persisted in AsyncStorage).
2. **Dashboard Overview**:
   - Point out the **ROBOT STATUS: Disconnected (Prototype)** card, confirming academic honesty.
   - Point out the **Performance Analytics** cards clearly flagged as `DEMO DATA`.
3. **Plant Weed Detection (Case 1: Weed Detected $\rightarrow$ SPRAY REQUIRED)**:
   - Tap `[ UPLOAD IMAGE ]` or navigate to the `Detect` tab.
   - Select the preset **"Tomato Field with Broadleaf Weed"** (or upload any field image).
   - Tap `[ ANALYZE IMAGE ]`.
   - Observe the simulated computer vision loading state: *"Analyzing plant image..."*.
   - View the **AI Detection Result Screen**:
     - Red bounding box dynamically overlaid directly on the weed target.
     - Status Badge: `SPRAY REQUIRED`.
     - Confidence: `91.0%` (exceeds $70\%$ threshold).
     - Tap `[ SAVE RESULT ]` to record into history.
4. **Plant Weed Detection (Case 2: Clean Crop $\rightarrow$ NO SPRAY REQUIRED)**:
   - Go back to `Detect` and select **"Healthy Organic Lettuce Crop"**.
   - Tap `[ ANALYZE IMAGE ]`.
   - Result: Status Badge `NO SPRAY REQUIRED`, Confidence `95.0%`, 0 weeds detected.
5. **Plant Weed Detection (Case 3: Low Confidence $\rightarrow$ REVIEW REQUIRED)**:
   - Go back to `Detect` and select **"Young Seedling / Ambiguous Sprout"**.
   - Tap `[ ANALYZE IMAGE ]`.
   - Result: Status Badge `REVIEW REQUIRED`, Confidence `55.0%`. Explains that safety thresholds prevent accidental herbicide damage on uncertain plants.
6. **Detection History**:
   - Switch to the `History` tab.
   - Filter records by *Spray*, *Review*, or *Clean*.
   - Tap `[ VIEW ]` on any record to inspect full bounding box coordinates $(x, y, w, h)$ and model provenance.
7. **Robot Control Panel Simulation**:
   - Switch to the `Robot` tab.
   - Tap `[ CONNECT ]` $\rightarrow$ Notice safety notice: *"DEMO MODE: ESP32 hardware is not connected"*.
   - Tap `[ SEND SPRAY COMMAND ]` $\rightarrow$ View demo output: *"SPRAY COMMAND GENERATED — Pulse: 500ms"*.
   - Point out the activity log maintaining timestamps of dispatched commands.
8. **Settings & Threshold Tuning**:
   - Switch to `Settings` tab.
   - Change the confidence threshold from $70\%$ to $85\%$ and observe instant persistence.
   - Open `About Project` to review system architecture.

---

## 🔮 8. Future YOLOv8 Backend Integration Guide

Once your custom YOLOv8 model (`best.pt`) is trained on field crop/weed datasets (such as WeedMap or DeepWeeds), connect the app as follows:

### Step 1: Deploy Python/FastAPI Backend
```python
# app.py
from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO
import cv2, numpy as np

app = FastAPI(title="WeedGuard AI YOLOv8 Service")
model = YOLO("best.pt")  # Trained weights

@app.post("/api/predict")
async def predict(image: UploadFile = File(...), confidence_threshold: float = 0.70):
    contents = await image.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    results = model(img, conf=confidence_threshold)
    boxes = []
    has_weed = False
    
    for r in results:
        for box in r.boxes:
            cls_name = model.names[int(box.cls[0])]
            conf = float(box.conf[0])
            xywhn = box.xywhn[0].tolist() # Normalized [x, y, w, h]
            if "weed" in cls_name.lower():
                has_weed = True
            boxes.append({
                "x": xywhn[0] - xywhn[2]/2,
                "y": xywhn[1] - xywhn[3]/2,
                "width": xywhn[2],
                "height": xywhn[3],
                "label": cls_name,
                "confidence": conf
            })
            
    return {
        "detected": has_weed,
        "class_name": "weed" if has_weed else "healthy_crop",
        "confidence": boxes[0]["confidence"] if boxes else 0.95,
        "boxes": boxes,
        "processing_time_ms": 42
    }
```

### Step 2: Switch Mobile App Service
In [src/constants/config.ts](file:///c:/Users/sanaj/.gemini/antigravity/scratch/EDI/src/constants/config.ts):
```typescript
API_BASE_URL: 'http://<YOUR_SERVER_IP>:8000/api'
```
In [src/services/ai/index.ts](file:///c:/Users/sanaj/.gemini/antigravity/scratch/EDI/src/services/ai/index.ts):
```typescript
setDetectionServiceMode('real');
```

---

## ⚡ 9. Future ESP32 Robot Hardware Integration

### Hardware Wiring Architecture
```
Mobile App (Wi-Fi)
        │
        ▼
ESP32 Access Point (192.168.4.1)
        │
        ├── GPIO 4  ───> Relay Module ───> 12V Solenoid Spray Valve
        ├── GPIO 16 ───> L298N Driver ───> Robot Drive Motors
        └── UART/I2C ──> ESP32-CAM (Image Capture Node)
```

### ESP32 Microcontroller Firmware Snippet (Arduino C++)
```cpp
#include <WiFi.h>
#include <WebServer.h>

const char* ssid = "WeedGuard_Robot_AP";
const char* password = "agritechpassword";
WebServer server(80);

const int SPRAY_RELAY_PIN = 4;

void handleSpray() {
  int duration = 500;
  if (server.hasArg("duration")) {
    duration = server.arg("duration").toInt();
  }
  digitalWrite(SPRAY_RELAY_PIN, HIGH);
  delay(duration);
  digitalWrite(SPRAY_RELAY_PIN, LOW);
  server.send(200, "application/json", "{\"status\":\"SPRAY_COMPLETED\"}");
}

void handleStop() {
  digitalWrite(SPRAY_RELAY_PIN, LOW);
  server.send(200, "application/json", "{\"status\":\"EMERGENCY_STOP\"}");
}

void setup() {
  pinMode(SPRAY_RELAY_PIN, OUTPUT);
  digitalWrite(SPRAY_RELAY_PIN, LOW);
  WiFi.softAP(ssid, password);
  server.on("/spray", HTTP_GET, handleSpray);
  server.on("/stop", HTTP_GET, handleStop);
  server.begin();
}

void loop() {
  server.handleClient();
}
```

---

## 🗺️ 10. Development Roadmap

- [x] **Phase 1: Mobile Application Prototype** *(Current Completed Mid-Sem Stage)*
  - Decoupled architecture, simulated AI inference, bounding box visualizer, command simulator, and persistent storage.
- [ ] **Phase 2: Custom YOLOv8 Model Training**
  - Annotating agricultural field datasets, training weed vs. crop classes, optimizing export to ONNX / TensorRT.
- [ ] **Phase 3: Python FastAPI Inference Microservice**
  - High-throughput REST API endpoint for inference with GPU acceleration.
- [ ] **Phase 4: ESP32-CAM Hardware Integration**
  - Mounting optical sensor onto agricultural cart for automated overhead row capture.
- [ ] **Phase 5: Robot Chassis & Wi-Fi Protocol**
  - Four-wheel drive rover with motor drivers and encrypted Wi-Fi communication.
- [ ] **Phase 6: Spraying Mechanism Fabrication**
  - Pressurized chemical reservoir, micro-diaphragm pump, and high-speed solenoid nozzles.
- [ ] **Phase 7: Integrated Field Testing**
  - Real-world validation in university agricultural test plots evaluating herbicide savings and mAP accuracy.

---

## 👥 Academic Project Team & Credits
- **Project Title:** AI-Based Weed Detection and Spraying Robot
- **System Name:** WEEDGUARD AI
- **Review:** Mid-Semester Evaluation Prototype
- **License:** MIT License
