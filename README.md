# 🎵 Musica

A modern, cross-platform music discovery application built with **React Native** and **Expo**. 

Musica features a complex navigation structure (Drawer + Tabs + Stack) and a global state management system for managing favorite tracks.

## ✨ Features

* **Global Favorites System:** Toggle the "Heart" icon on any song to instantly add/remove it from your "Liked Songs" tab (powered by React Context).
* **Hybrid Navigation:** * **Drawer:** Main menu for app-wide settings and navigation.
    * **Bottom Tabs:** Quick switching between Music Library, Favorites, and Profile.
    * **Stack:** Smooth transitions from the song list to the "Now Playing" detail screen.
* **Dynamic UI:** Custom components for song items with integrated play/like controls.
* **Cross-Platform:** Optimized to run on both Android (Expo Go) and Web.

## 🛠️ Tech Stack

* **Core:** React Native, Expo
* **Navigation:** React Navigation v6 (Stack, Bottom Tabs, Drawer)
* **State Management:** React Context API
* **Icons:** Expo Vector Icons (Ionicons)
* **Animations:** React Native Reanimated & Gesture Handler

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
* Node.js installed
* Expo Go app installed on your phone (for testing)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/musica.git](https://github.com/your-username/musica.git)
    cd musica
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    *Note: This will install core libraries plus `react-navigation`, `safe-area-context`, `screens`, `gesture-handler`, and `reanimated`.*

3.  **Start the server:**
    ```bash
    npx expo start -c
    ```
    *Using the `-c` flag clears the metro bundler cache to prevent stale builds.*

## 📱 How to Use

1.  Scan the QR code with the **Expo Go** app (Android) or Camera app (iOS).
2.  **Home Tab:** Scroll through the song list. Tap a song to see details.
3.  **Like a Song:** Tap the **Heart Icon** on any track.
4.  **Favorites Tab:** Switch to the "Liked" tab to see your saved collection updates in real-time.
5.  **Profile:** View your user stats and info.
