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
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Start the project

```bash
npm run dev
```

## Author
Built by Rakshith Akarapu
