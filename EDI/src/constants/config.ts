export const APP_CONFIG = {
  appName: 'WEEDGUARD AI',
  subtitle: 'AI-Powered Weed Detection & Smart Spraying System',
  projectTitle: 'AI-Based Weed Detection and Spraying Robot',
  version: '1.0.0',
  stage: 'Production Edition',
  
  // Vision Model Backend Configuration
  API_BASE_URL: 'http://api.weedguard.local/api',
  DEFAULT_CONFIDENCE_THRESHOLD: 0.70,
  AVAILABLE_THRESHOLDS: [0.70, 0.75, 0.80, 0.85, 0.90],

  // Robot Controller Hardware Configuration
  DEFAULT_ESP32_IP: '192.168.4.1',
  DEFAULT_ESP32_PORT: 80,
  DEFAULT_ESP32_SSID: 'WeedGuard_Robot_AP',

  // Inference latency (milliseconds)
  SIMULATED_PROCESSING_DELAY: 1100,
};
