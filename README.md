# CampusFind

A modern web application that helps students report and find lost items easily across a university campus.

## Live Demo
https://campus-find-sigma.vercel.app

## Features
- Add lost and found items
- Upload item images
- Search and filter items by location or description
- Track item status (Open/Returned)
- Detailed dashboard for managing your posts
- Responsive UI

## Tech Stack
- React (Vite)
- TypeScript
- Tailwind CSS
- Firebase (Auth, Firestore)
- Cloudinary (Image handling)

## Run Locally

Clone the project

```bash
git clone https://github.com/rakshith-akarapu/campus-find
```

Install dependencies

```bash
npm install
```

Configure `.env` file with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSyCjALQKjxbtZOq_4ULt5SPhBHJ1o9k2iao
VITE_FIREBASE_AUTH_DOMAIN=campusfind-644ed.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=campusfind-644ed
VITE_FIREBASE_MESSAGING_SENDER_ID=262077684423
VITE_FIREBASE_APP_ID=1:262077684423:web:f883d778f94f053be5fce2
```

Start the project

```bash
npm run dev
```

## Author
Built by Rakshith Akarapu
