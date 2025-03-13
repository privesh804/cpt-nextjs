importScripts(
  "https://www.gstatic.com/firebasejs/11.4.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.4.0/firebase-messaging-compat.js"
);

// Global Firebase Messaging instance
let messaging;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "INIT") {
    console.log("Initializing Firebase Messaging in Service Worker...");
    self.firebaseConfig = event.data.firebaseConfig;

    try {
      firebase.initializeApp(self.firebaseConfig);
      messaging = firebase.messaging();
      console.log("Firebase Messaging initialized in Service Worker");
    } catch (error) {
      console.error("Firebase initialization failed:", error);
    }
  }
});

// Handle Push Notifications
self.addEventListener("push", (event) => {
  if (!messaging) {
    console.warn("Firebase Messaging is not initialized yet.");
    return;
  }

  if (event.data) {
    const payload = event.data.json();
    console.log("Received push notification:", payload);

    const notificationOptions = {
      body: payload.notification?.body || "New notification",
      icon: payload.notification?.icon || "/default-icon.png",
      badge: "/badge-icon.png",
      data: payload.data || {},
    };

    event.waitUntil(
      self.registration.showNotification(
        payload.notification?.title || "Notification",
        notificationOptions
      )
    );
  }
});

// Handle Notification Clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.notification.data?.click_action) {
    event.waitUntil(clients.openWindow(event.notification.data.click_action));
  }
});
