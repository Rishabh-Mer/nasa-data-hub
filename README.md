# 🚀 NASA Data Explorer

Explore the universe with this full-stack web application powered by NASA's open APIs. This project allows users to view daily astronomy pictures, Mars rover images, media library assets (images, videos, audio), near-Earth objects, and live Earth imagery from the EPIC camera.

---

## 🛠 Tech Stack

- **Frontend**: React, Material UI, React Router DOM  
- **Backend**: Express (via Express Generator)  
- **API Handling**: Axios  
- **Environment Config**: dotenv  
- **Styling**: Material UI components & custom CSS  

---

## 📁 Project Structure

```
nasa-data-explorer/
│
├── client/        # React frontend
│   └── .env       # Environment variables for client
│
└── server/        # Express backend
    └── .env       # Environment variables for server
```

---

## 🚀 Getting Started

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/nasa-data-explorer.git
cd nasa-data-explorer
```

---

## ⚙️ Server Setup (`server/`)

### 1. Navigate to the Server Folder

```bash
cd server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

Create a `.env` file in the `server/` directory and add:

```env
NASA_API_KEY=YOUR_NASA_API_KEY
```

### 4. Install dotenv

```bash
npm install dotenv
```

Make sure to load dotenv in your app entry (e.g., `app.js` or `bin/www`):

```js
require('dotenv').config();
```

### 5. Start the Server

```bash
npm start
```

---

## 💻 Client Setup (`client/`)

### 1. Navigate to the Client Folder

```bash
cd ../client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

Create a `.env` file in the `client/` directory:

```env
REACT_APP_SERVER_URL=http://localhost:9000/
```

### 4. Start the Client

```bash
npm start
```

---

## 🔑 NASA API Key

- Visit [https://api.nasa.gov](https://api.nasa.gov) to generate a free API key.
- Add the key to your `server/.env` file as shown above.

---

## 🌌 APIs Used

This project utilizes several NASA APIs:

- [Astronomy Picture of the Day (APOD)](https://api.nasa.gov/)
- [Mars Rover Photos](https://api.nasa.gov/)
- [NASA Media Library (Images, Video, Audio)](https://images.nasa.gov/)
- [Near Earth Object Web Service (NeoWS)](https://api.nasa.gov/)
- [EPIC (Earth Polychromatic Imaging Camera)](https://epic.gsfc.nasa.gov/)

---

## 📷 Features

- View daily astronomy image with details
- Browse Mars rover images by date
- Search NASA's image and video library
- View asteroid data near Earth
- Access daily Earth images from space

---

## 👨‍💻 Author

**Rishabh Mer**

Created with 💫 to explore the wonders of space through code.

---

## 📃 License

This project uses NASA's public data. 