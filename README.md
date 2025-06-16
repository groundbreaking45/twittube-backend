# Twittube Backend

This is a simple backend API for a social media-style app built while learning from the **Chai aur Code** YouTube course. It uses **Node.js**, **Express**, and **MongoDB**, and includes basic features like user authentication, post creation, and media uploads.

---

## 🔧 Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT (for auth)
- Cloudinary (for file uploads)
- dotenv

---

## 📁 Folder Structure

```
twittube-backend/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── uploads/
├── index.js
└── .env.example
```

---

## 🔑 Features

- User sign-up and login
- JWT-based authentication
- CRUD operations for posts
- Media upload to Cloudinary
- Modular code structure

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/groundbreaking45/twittube-backend
cd twittube-backend
npm install
```

### 2. Setup environment variables

Create a `.env` file using the provided `.env.example` as a guide:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start the server

```bash
npm run dev
```

The server will run at `http://localhost:5000`.

---

## 📚 Source

This project was made as part of a tutorial from the  
[Chai aur Code](https://www.youtube.com/@chaiAurCode) YouTube channel.

---

## 👤 Author

**Deepak Sharma**  
GitHub: [@groundbreaking45](https://github.com/groundbreaking45)
