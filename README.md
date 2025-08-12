# Real Estate Website

A modern, responsive real estate website built with Next.js, TypeScript, Tailwind CSS, and Firebase.

## Features

- 🏠 Browse property listings with filters
- 🔍 Search properties by location, type, price, and status
- 👤 Admin dashboard for property management
- 🔐 User authentication for admin access
- 📱 Responsive design for all devices
- 📝 Contact form for inquiries
- 📊 Featured properties section
- 🖼️ Image galleries for each property

## Tech Stack

- **Frontend**: Next.js 13+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **State Management**: React Hooks
- **Forms**: React Hook Form

## Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication with Email/Password
3. Create a Firestore database
4. Set up Storage for images
5. Add your Firebase config to `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

```
src/
  ├── app/                  # App router pages
  │   ├── page.tsx          # Home page
  │   ├── properties/       # Properties listing and details
  │   ├── contact/          # Contact page
  │   ├── about/            # About page
  │   ├── admin/            # Admin dashboard
  │   └── login/            # Login page
  ├── components/           # Reusable components
  ├── lib/                  # Firebase initialization
  └── utils/                # Utility functions
      ├── auth.ts           # Authentication utilities
      ├── data.ts           # Mock data
      ├── firebase.ts       # Firebase utilities
      └── withAuth.tsx      # Authentication HOC
```

## Firebase Utility Structure

The project uses Firebase for backend functionality with the following organization:

- `src/lib/firebase.ts`: Core Firebase initialization and configuration
- `src/utils/firebaseUtils.ts`: Firebase utility functions for data operations
  - Property CRUD operations
  - Image uploads
  - Contact form submission
  - Database seeding

All Firebase operations should use the utility functions from `firebaseUtils.ts` for consistency.

## Admin Access

For demo purposes, use:
- Email: admin@example.com
- Password: password123

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
