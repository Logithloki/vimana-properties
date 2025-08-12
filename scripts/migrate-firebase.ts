import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
console.log('Looking for .env.local at:', envPath);
dotenv.config({ path: envPath });
console.log("Environment variables loaded. Current working directory:", process.cwd());
console.log("Checking if Firebase variables exist:", {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "exists" : "missing",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "exists" : "missing"
});

// --- Your Old Firebase Project Configuration ---
const oldFirebaseConfig = {
  apiKey: "AIzaSyC15rUk27n0u_69HtDMTWYHVmEcfwifSg8",
  authDomain: "properties-cd846.firebaseapp.com",
  projectId: "properties-cd846",
  storageBucket: "properties-cd846.firebasestorage.app",
  messagingSenderId: "1075562575536",
  appId: "1:1075562575536:web:3b1a315b652c7a8afead75",
  measurementId: "G-WS4YF9LPXR"
};

// --- Your New Firebase Project Configuration (from .env.local) ---
const newFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

console.log("New Firebase Config Loaded from .env.local:", {
    projectId: newFirebaseConfig.projectId,
    apiKey: newFirebaseConfig.apiKey ? 'Loaded' : 'MISSING',
});

// --- Validate that the new config is loaded ---
if (!newFirebaseConfig.apiKey || !newFirebaseConfig.projectId) {
    console.error("❌ CRITICAL ERROR: New Firebase configuration not loaded from .env.local file.");
    console.error("Please ensure the .env.local file is in the root directory and has the correct NEXT_PUBLIC_FIREBASE_ variables.");
    process.exit(1); // Stop the script
}

// --- Helper to initialize Firebase apps ---
const initializeFirebaseApp = (config: any, name: string) => {
  try {
    return initializeApp(config, name);
  } catch (error) {
    if ((error as any)?.code === 'app/duplicate-app') {
      // If the app already exists, Firebase will throw an error
      // We can safely ignore this and return undefined
      return undefined;
    }
    throw error;
  }
};

// --- Initialize both Firebase projects ---
let oldApp, newApp;

try {
  oldApp = initializeApp(oldFirebaseConfig, 'oldApp');
  console.log('✅ Old Firebase app initialized');
} catch (error) {
  console.error('❌ Failed to initialize old Firebase app:', error);
  process.exit(1);
}

try {
  newApp = initializeApp(newFirebaseConfig, 'newApp');
  console.log('✅ New Firebase app initialized');
} catch (error) {
  console.error('❌ Failed to initialize new Firebase app:', error);
  process.exit(1);
}

const oldDb = getFirestore(oldApp);
const newDb = getFirestore(newApp);

// --- Main Migration Function ---
async function migrateCollection(collectionName: string) {
  console.log(`Starting migration for collection: "${collectionName}"...`);

  try {
    // 1. Fetch all documents from the old database
    const oldCollectionRef = collection(oldDb, collectionName);
    const snapshot = await getDocs(oldCollectionRef);

    if (snapshot.empty) {
      console.log(`No documents found in "${collectionName}" in the old database. Nothing to migrate.`);
      return;
    }

    console.log(`Found ${snapshot.docs.length} documents in "${collectionName}" to migrate.`);

    // 2. Write documents to the new database in a batch
    const newCollectionRef = collection(newDb, collectionName);
    const batch = writeBatch(newDb);

    snapshot.docs.forEach((docSnapshot) => {
      const docId = docSnapshot.id;
      const docData = docSnapshot.data();
      // Use the imported `doc` function here
      const newDocRef = doc(newCollectionRef, docId);
      batch.set(newDocRef, docData);
    });

    // 3. Commit the batch
    await batch.commit();

    console.log(`✅ Successfully migrated ${snapshot.docs.length} documents to "${collectionName}" in the new database.`);

  } catch (error) {
    console.error(`❌ Error migrating collection "${collectionName}":`, error);
  }
}

// --- Run the migration ---
async function runMigration() {
  console.log("--- Starting Firebase Data Migration ---");
  
  // Migrate 'contacts' collection
  await migrateCollection('contacts');
  
  // Migrate 'properties' collection
  await migrateCollection('properties');

  console.log("--- Firebase Data Migration Complete ---");
}

runMigration().catch(console.error);
