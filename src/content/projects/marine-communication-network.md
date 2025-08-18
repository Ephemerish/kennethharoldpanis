---
title: "Communication Network Prototype for Monitoring of Small Fishing Boats"
description: "An undergraduate thesis project developing a LoRa-based communication prototype for monitoring small fishing boats (bangka) in the Philippines. Despite achieving 882-meter range and functional network operations, the research identified key limitations and provided recommendations for future improvements in maritime IoT systems."
image: "team1.png"
gallery: ["image1.png", "image2.png", "image3.png", "image4.png"]
tags: ["LoRa", "IoT", "Maritime Safety", "ESP32", "Mobile App", "Emergency Response", "GPS Tracking", "Microcontroller", "Thesis", "Hardware"]
category: "iot"
demoUrl: ""
videoUrl: ""
githubUrl: ""
featured: true
status: "completed"
startDate: 2023-09-01
endDate: 2024-05-01
challenges:
  - "Achieving maximum communication range of 882 meters in open sea conditions"
  - "Implementing XOR encryption for secure data transmission"
  - "Developing waterproof enclosures for harsh maritime environments"
  - "Integrating real-time GPS tracking with LoRa communication protocol"
  - "Optimizing power consumption for extended battery operation"
  - "Testing signal quality (RSSI/SNR) across various distances"
technologies: ["ESP32 NodeMCU-32S", "LoRa SX1278 433MHz", "GPS NEO-M8N", "Firebase Realtime Database", "Flutter Mobile App", "C/C++ Arduino", "XOR Encryption", "Serial Communication"]
keyFeatures:
  - "Real-time GPS location tracking and transmission"
  - "Emergency alert system with instant notification"
  - "882-meter maximum communication range tested"
  - "Star network topology with centralized gateway"
  - "Cross-platform mobile application for monitoring"
  - "XOR encryption for data security"
  - "LED indicators for network connection status"
  - "Low-power LoRa technology for extended battery life"
  - "Waterproof enclosures for maritime durability"
  - "RSSI and SNR signal quality monitoring"
team: ["Kenneth Harold Panis", "Daisy Marie Bernante", "Hannah Mae Mascardo"]
institution: "Bohol Island State University"
supervisor: "Julius C. Castro, MEng, CpE"
researchArea: "Maritime IoT Communication Systems"
---

## Project Overview

This undergraduate thesis project presents a comprehensive solution for enhancing maritime safety through the development of a LoRa-based communication network prototype specifically designed for monitoring small fishing boats, locally known as "bangka," in the Philippines.

### Problem Statement

The Philippines, with over 7,000 islands and approximately 2.2 million fisherfolk, faces significant challenges in maritime safety. Small fishing boats operating in remote areas often lack reliable communication systems when cellular coverage is unavailable, putting operators at risk during emergencies, mechanical failures, and adverse weather conditions.

## Key Features

### Hardware Components
- **NodeMCU-32S development board** - ESP32-based microcontroller with Wi-Fi capabilities
- **LoRa 433MHz Module SX1278** - Long-range wireless transceiver for communication
- **NEO-M8N GPS Module** - Accurate positioning and location tracking
- **LED indicators** - Visual feedback for network connection status
- **Emergency buttons** - Quick distress signal activation
- **Waterproof enclosures** - Protection for maritime environments

### Software Features
- **Real-time GPS tracking** - Continuous location monitoring
- **Emergency alert system** - Quick distress signal transmission
- **Mobile application** - Real-time data viewing for emergency responders
- **Historical data logging** - Track boat movements over time
- **Star network topology** - Efficient communication architecture
- **XOR encryption** - Basic data security implementation

## Technical Implementation

### Network Architecture
The system implements a **STAR network topology** where:
- **Node devices** are installed on individual fishing boats
- **Gateway device** serves as the central communication hub
- **Mobile application** provides real-time monitoring capabilities
- **Firebase integration** for cloud data storage and synchronization

### Communication Protocol
- **Frequency**: 433MHz (ISM band)
- **Range**: Successfully tested up to 882 meters
- **Data transmission**: Boat ID, operator name, GPS coordinates, emergency status
- **Signal metrics**: RSSI (Received Signal Strength Indicator) and SNR (Signal-to-Noise Ratio) monitoring

### Mobile Application Features
- **Real-time boat tracking** on interactive maps
- **Historical location data** with timeline visualization
- **Emergency alert notifications** for immediate response
- **Boat and operator information** management
- **Multi-platform compatibility** for emergency responders

## Testing Results

### Performance Metrics
- **Maximum range**: 882 meters in open sea conditions
- **GPS accuracy**: Tested and validated for maritime use
- **Network reliability**: Successful communication establishment
- **Emergency response time**: Real-time alert transmission
- **Signal analysis**: Inverse relationship between distance and signal strength (RSSI/SNR)

### Testing Location & Methodology
Testing was conducted in the sea areas around Loon and Calape, Bohol, chosen for their representative maritime conditions and proximity to fishing communities. The open sea environment provided ideal conditions for range testing without physical barriers, allowing for accurate measurement of the 882-meter maximum communication distance.

### Actual Test Results
Based on comprehensive field testing, the system demonstrated:
- **Communication Network Functionality**: 100% success rate across all three nodes
- **LED Network Indicators**: 100% accuracy in status indication
- **GPS Location Accuracy**: All measurements within 5-meter threshold (range: 0.21m to 1.81m)
- **Maximum Range Achievement**: 882 meters with intermittent connectivity
- **Signal Degradation**: Consistent inverse relationship between distance and signal quality

## Technical Challenges & Solutions

### Challenge 1: Data Transmission Method
**Issue**: Direct data transmission from ESP32 to Firebase proved ineffective  
**Solution**: Implemented serial communication with PC running Python program for data processing

### Challenge 2: Communication Range Limitations
**Issue**: Achieved range of 882 meters fell short of initial expectations  
**Solution**: Identified need for antenna testing and potential upgrades for improved performance

### Challenge 3: Signal Quality at Distance
**Issue**: Rapidly declining SNR and RSSI values as distance increased  
**Solution**: Documented inverse relationship for future optimization efforts

### Challenge 4: Device Waterproofing
**Issue**: Need for protection against water damage in maritime environments  
**Solution**: Identified requirement for upgraded waterproof casing in recommendations

## Project Impact

### Safety Enhancement
- **Immediate emergency response** capability for fishing boats
- **Real-time location tracking** for search and rescue operations
- **Peace of mind** for families of fisherfolk
- **Improved coordination** between boats and emergency services

### Economic Benefits
- **Reduced search and rescue costs** through precise location data
- **Increased fishing productivity** with safety assurance
- **Insurance cost reduction** potential
- **Support for sustainable fishing** practices

### Technological Contribution
- **Proof of concept** for LoRa in maritime applications
- **Scalable architecture** for larger deployment
- **Open-source potential** for community development
- **Foundation for future research** in maritime IoT

## Cost Analysis

### Hardware Costs (Per Unit)
- NodeMCU-32S: ₱349
- LoRa Module SX1278: ₱275
- GPS Module NEO-M8N: ₱599
- Antennas: ₱99
- Additional components: ₱258
- **Total per device**: ₱1,580

### System Deployment (4 units)
- **Total hardware cost**: ₱6,480
- **Development time**: 8 months
- **Testing phase**: Comprehensive field testing

## Research Limitations & Findings

Based on the actual research conducted at Bohol Island State University, the study demonstrated the feasibility of developing a networking prototype for monitoring small fishing boats. However, several limitations were identified:

### Key Limitations Encountered
1. **Data Transmission Inefficiency**: Direct ESP32 to Firebase communication proved ineffective
2. **Range Expectations**: The 882-meter maximum range fell short of initial expectations  
3. **Signal Quality Issues**: SNR measurements consistently showed very poor signal quality
4. **Hardware Limitations**: Need for waterproofing and antenna improvements identified
5. **Network Topology**: Star network showed limitations requiring mesh network consideration

### Validated Research Outcomes
- **Functional Prototype**: Successfully developed with minor adjustments needed
- **Communication Performance**: 100% functionality achieved for network operations
- **GPS Accuracy**: All location measurements within acceptable 5-meter threshold
- **Real-time Capabilities**: Emergency alerts and GPS transmission successfully implemented
- **Cost Analysis**: Complete 4-node system developed for ₱6,480 total cost

### Performance Analysis
The study findings indicate that data delivery speed is dependent on distance. When nodes are positioned closer to the gateway, transmission occurs rapidly. However, as distance increases, there is a slower process of receiving data. Since testing was conducted at sea with no physical barriers, smooth data transmission was achieved as long as nodes remained within the operational range of 882 meters.

### Signal Quality Results
- **RSSI Performance**: Ranged from -59 dBm (excellent at 235m) to -93 dBm (fair at 882m)
- **SNR Performance**: All measurements showed very poor signal quality (below -3.75 dB)
- **Distance vs Signal**: Strong negative correlation (-0.93) between distance and RSSI
- **Network Functionality**: 100% success rate for all communication network functions tested

## Research Recommendations

Based on the study conclusions, the researchers provided the following specific recommendations:

### 1. Antenna Enhancement
Explore alternative antennas for LoRa to assess their impact on network performance and improve signal strength.

### 2. Network Topology Upgrade  
Transition from star network to mesh network configuration to enhance range, redundancy, and security.

### 3. Application Development
Develop a more advanced application to leverage collected data effectively and provide enhanced functionality.

### 4. Hardware Integration
Replace the intermediary computer for data transmission with the gateway node and database, preferably on a Raspberry Pi or similar single-board computer to streamline the process.

### 5. Security Improvements
Improve the existing encryption method to bolster data security and integrity.

### 6. Waterproofing Enhancement
Upgrade the casing to waterproof the device, preventing water ingress and ensuring operational integrity in maritime conditions.

### 7. Enhanced Authentication
While the current design allows access to authorized individuals and authorities for monitoring fishermen's locations, there remains a possibility of unauthorized access if the mobile device is compromised. Future researchers should implement additional security measures such as biometric verification or multi-factor authentication to safeguard sensitive information and ensure system integrity.

## Technical Implementation

### Hardware Components Used
| Component | Description | Unit Cost (₱) | Quantity |
|-----------|-------------|---------------|----------|
| NodeMCU-32S | Development board with Wi-Fi | 349 | 4 |
| SX1278 LoRa Module | 433MHz wireless transceiver | 275 | 4 |
| NEO-M8N GPS | Flight controller GPS module | 599 | 4 |
| Antennas | Signal transmission/reception | 99 | 4 |
| LED Modules | Visual status indicators | 15 | 4 |
| Buttons | User input interface | 10 | 4 |
| Battery | Power source | 99 | 4 |
| Wiring & Connectors | Electrical connections | 99 | 4 |
| Enclosure | Protective housing | 75 | 4 |
| **Total System Cost** | | **₱6,480** | |

## Conclusions

Based on the research conducted, the study demonstrated the feasibility of developing a networking prototype for monitoring small fishing boats. Despite encountering challenges such as ineffective data transmission methods and limitations in range and signal quality, the prototype showcases potential for further refinement and deployment. 

The speed of data delivery depends on the distance - if the node is near the gateway, transmission is fast, but as distance increases, there's a slower process of receiving data. Since testing was conducted at sea with no barriers, there was smooth data transmission as long as nodes remained within operational range.

### Key Research Findings:
1. **Successful prototype development** with minor adjustments required for optimal functionality
2. **Communication network functionality** - overall network, LED indicators, and mobile application functioned as expected
3. **Range limitations** - achieved maximum distance of 882 meters, which fell short of expectations
4. **Signal quality analysis** - demonstrated inverse relationship between distance and both RSSI and SNR
5. **Data transmission challenges** - addressed ineffective direct transmission by implementing serial communication with PC
6. **Waterproofing needs** - essential for device durability in maritime environments

## Recommendations

Based on the conclusions reached, the researchers suggest the following recommendations:

### 1. Antenna Enhancement
Explore alternative antennas for LoRa to assess their impact on network performance and improve signal strength.

### 2. Network Topology Upgrade
Transition from a star network to a mesh network configuration to enhance range, redundancy, and security.

### 3. Application Development Enhancement
Develop a more advanced application to leverage collected data effectively and provide enhanced functionality.

### 4. Hardware Integration Improvement
Replace the intermediary computer for data transmission with the gateway node and database, preferably on a Raspberry Pi or similar single-board computer, to streamline the process.

### 5. Security Enhancement
Improve the existing encryption method to bolster data security and integrity.

### 6. Waterproofing Implementation
Upgrade the casing to waterproof the device, preventing water ingress and ensuring operational integrity in maritime conditions.

### 7. Enhanced Authentication Security
While the current design of the application allows access to authorized individuals and authorities for the purpose of monitoring fishermen's locations, there remains a possibility of unauthorized personnel gaining access to the application if the mobile device is compromised. To mitigate this risk, future researchers may implement additional security measures to safeguard sensitive information and ensure the integrity of the system by implementing enhanced authentication mechanisms, such as biometric verification or multi-factor authentication.

## Academic Achievement

This project was successfully completed at **Bohol Island State University** as an undergraduate thesis for the Bachelor of Science in Computer Engineering program in **April 2024**.

### Research Team Roles
- **Kenneth Harold Panis**
- **Daisy Marie Bernante**
- **Hannah Mae Mascardo**

### Academic Supervision
- **Research Adviser**: Julius C. Castro, MEng, CpE 
- **Institution**: Bohol Island State University - Main Campus
- **Department**: Computer Engineering
- **Defense Date**: April 29, 2024
- **Completion**: May 2024

## Research Significance

This project contributes to:

- **Maritime Safety**: Enhanced safety protocols for small-scale fishing operations
- **IoT Applications**: Practical implementation of LoRa technology in challenging environments
- **Emergency Response**: Improved coordination for search and rescue operations
- **Academic Research**: Foundation for future studies in maritime communication systems
- **Community Impact**: Direct benefit to local fishing communities in the Philippines

## Project Links

- [Live Demo](https://your-demo-link.com)
- [GitHub Repository](https://github.com/your-username/marine-communication-network)
- [Technical Documentation](https://docs.your-project.com)

---

*This project represents the successful application of LoRa wireless technology for maritime safety, demonstrating how modern IoT solutions can address real-world challenges faced by fishing communities in the Philippines.*
