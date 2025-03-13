"use client";

import { initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

let app;
let messaging: Messaging;

if (typeof window !== "undefined") {
  app = initializeApp(firebaseConfig);
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.error("Firebase messaging setup error:", error);
  }
}

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then(async (registration) => {
      console.log("Service Worker registered:", registration);

      if (registration.active) {
        console.log("Sending INIT message to Service Worker...");
        registration.active.postMessage({
          type: "INIT",
          firebaseConfig: firebaseConfig,
        });
      } else {
        console.log("Waiting for Service Worker to be ready...");
        navigator.serviceWorker.ready.then((swRegistration) => {
          swRegistration.active?.postMessage({
            type: "INIT",
            firebaseConfig: firebaseConfig,
          });
        });
      }
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

export { app, messaging };
