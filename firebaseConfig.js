const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean);

const getFirebaseSdk = () => {
  try {
    const dynamicRequire = Function("moduleName", "return require(moduleName);");
    const appModule = dynamicRequire("firebase/app");
    const firestoreModule = dynamicRequire("firebase/firestore");
    return { appModule, firestoreModule };
  } catch (_error) {
    return null;
  }
};

const getFirestoreDb = () => {
  if (!hasFirebaseConfig) return null;

  const sdk = getFirebaseSdk();
  if (!sdk) return null;

  const { appModule, firestoreModule } = sdk;
  const app = appModule.getApps().length
    ? appModule.getApp()
    : appModule.initializeApp(firebaseConfig);

  return {
    db: firestoreModule.getFirestore(app),
    firestoreModule,
  };
};

const loadRemoteState = async () => {
  const firestore = getFirestoreDb();
  if (!firestore) return null;

  const { db, firestoreModule } = firestore;
  const { doc, getDoc } = firestoreModule;
  const appStateRef = doc(db, "appState", "main");
  const snapshot = await getDoc(appStateRef);
  return snapshot.exists() ? snapshot.data() : null;
};

const saveRemoteState = async (payload) => {
  const firestore = getFirestoreDb();
  if (!firestore) return false;

  const { db, firestoreModule } = firestore;
  const { doc, setDoc, serverTimestamp } = firestoreModule;
  const appStateRef = doc(db, "appState", "main");

  await setDoc(
    appStateRef,
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return true;
};

export { hasFirebaseConfig, loadRemoteState, saveRemoteState };
