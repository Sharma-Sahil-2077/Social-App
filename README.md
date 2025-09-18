# Social App

A full-stack social media application with a **Node.js + Express backend** and an **Expo (React Native) frontend**.  
The backend is hosted on **Vercel**, while the frontend can be run locally with Expo.

---

## 🚀 Features
- User authentication (signup & login)
- Create and edit posts
- Real-time connection with hosted backend
- Mobile-ready with Expo

---

## 📂 Project Structure
/frontend → Expo React Native app (UI)
/backend → Node.js + Express API (hosted on Vercel)


---

## 🛠️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Sharma-Sahil-2077/Social-App.git
cd social-app
```

2️⃣ Backend (API)
The backend is already deployed on Vercel.
If you want to run it locally:

```bash
cd backend
npm install
npm start
```
By default, it runs on:

```bash
http://localhost:5000
```

3️⃣ Frontend (Expo App)

```bash
cd frontend
npm install
npx expo start
```

This will start the Expo development server.
You can:

Press a to run on Android emulator

Press i to run on iOS simulator (Mac only)

Scan the QR code with the Expo Go app on your phone

📦 Building APK
To generate a standalone APK:

```bash
npx expo build:android
```

Or for newer Expo versions (EAS):

```bash
npx expo run:android
```
