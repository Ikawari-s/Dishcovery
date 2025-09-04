# 🍽️ Dishcovery

A full-stack social platform for discovering restaurants, creating lists, and sharing reviews. Built with **MongoDB**, **Express**, **Node.js**, **React**, and **Tailwind CSS**. Users can follow each other, post reviews, create restaurant lists, and interact in a social feed.

---

## 🚀 Features

- **User Authentication**
  - Registration and login
  - Password hashing and secure storage
  - Two-Factor Authentication (2FA)
  - Password reset via OTP

- **User Profiles**
  - View and update profile
  - Upload profile picture
  - Follow/unfollow other users
  - View followers, following, and user stats
  - Track favorite restaurants

- **Restaurant Discovery**
  - Browse all restaurants
  - Search restaurants by name, cuisine, or tags
  - View detailed restaurant info
  - Track ratings and tags

- **Reviews**
  - Add, update, delete reviews
  - Like/unlike reviews
  - View reviews by user or by restaurant
  - Popular reviews and rating statistics

- **Lists**
  - Create, view, and delete custom restaurant lists
  - Add restaurants with notes and optional ranking
 

---

## 🛠️ Tech Stack

- **Frontend:** React, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcrypt, optional 2FA
- **File Uploads:** Multer for profile pictures
- **Async Operations:** Express APIs

---

## 🏃 How to Run
### Installation
1️⃣ Clone the repository
```bash
git clone https://github.com/Ikawari-s/Dishcovery.git
cd Dishcovery
```

2️⃣ Install dependencies
```bash
#Backend (server)
cd server
npm install

#Frontend (React app)
cd ../main
npm install
```

3️⃣ Configure environment variables
Create a file named .env inside the frontend folder.
For local development, replace the deployed API URLs with your localhost server:
```bash
REACT_APP_AUTH_API_URL=http://localhost:5000/api/authentication
REACT_APP_LISTS_API_URL=http://localhost:5000/api/lists
REACT_APP_RESTAURANTS_API_URL=http://localhost:5000/api/restaurants
REACT_APP_REVIEWS_API_URL=http://localhost:5000/api/reviews
REACT_APP_USERS_API_URL=http://localhost:5000/api/users
REACT_APP_API_BASE_URL=http://localhost:5000
```
Create a file named .env inside the server folder.
Here’s an example setup (replace with your own values):
```bash
PORT=5000
# MongoDB connection (replace with your cluster URI)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.hqscurq.mongodb.net/dishcovery?retryWrites=true&w=majority

# JWT secret for authentication
JWT_SECRET=yourSecretKeyHere

# Email service credentials (for password reset, 2FA, etc.)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=yourEmail@gmail.com
EMAIL_PASS=yourAppPassword
```

4️⃣ Start the backend (server)
```bash
#From the server folder:
npm run dev
```

5️⃣ Start the frontend (React app)
```bash
#From the main folder:
npm start
```


