"use client";
import { useEffect, useState } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "@/utils/firebase";

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("");

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
          // Register service worker
          const registration = await navigator.serviceWorker.register(
            "firebase-messaging-sw.js"
          );

          // Request notification permission
          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          if (permission === "granted") {
            const currentToken = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY, // Replace with your Firebase project's VAPID key
              serviceWorkerRegistration: registration,
            });

            if (currentToken) {
              setToken(currentToken);
              console.log("FCM Token:", currentToken);
            } else {
              console.log(
                "No registration token available. Request permission to generate one."
              );
            }
          }
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };

    retrieveToken();
  }, []);

  return { token, notificationPermissionStatus };
};

export default useFcmToken;
