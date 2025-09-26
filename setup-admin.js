// Setup script to create admin user
const admin = require('firebase-admin');
const readline = require('readline');

// Initialize Firebase Admin SDK
const serviceAccount = {
  // You'll need to replace these with your actual service account credentials
  // Download from Firebase Console > Project Settings > Service Accounts
  type: "service_account",
  project_id: "libraryapp-36fe6",
  // Add other required fields from your service account key
};

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://libraryapp-36fe6.firebaseio.com"
  });

  const auth = admin.auth();
  const db = admin.firestore();

  async function createAdminUser() {
    console.log('Creating admin user...');

    try {
      // Create user with Firebase Auth
      const userRecord = await auth.createUser({
        email: 'admin@libroreserva.com',
        password: 'Pass123',
        displayName: 'Library Admin'
      });

      console.log('Successfully created new user:', userRecord.uid);

      // Add user document to Firestore
      await db.collection('users').doc(userRecord.uid).set({
        name: 'Library Admin',
        email: 'admin@libroreserva.com',
        role: 'admin',
        avatarUrl: `https://i.pravatar.cc/150?u=${userRecord.uid}`,
        createdAt: new Date()
      });

      console.log('Admin user created successfully!');
      console.log('Username: LibraryAdmin');
      console.log('Email: admin@libroreserva.com');
      console.log('Password: Pass123');

    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log('Admin user already exists!');
      } else {
        console.error('Error creating admin user:', error);
      }
    }

    process.exit(0);
  }

  createAdminUser();

} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  console.log('\nTo use this script:');
  console.log('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.log('2. Generate a new private key');
  console.log('3. Replace the serviceAccount object with your credentials');
  console.log('4. Run: node setup-admin.js');
  process.exit(1);
}