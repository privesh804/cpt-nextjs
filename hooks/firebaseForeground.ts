"use client";

import { onMessage } from "firebase/messaging";
import { useEffect } from "react";
import useFcmToken from "./useFCMToken";
import { messaging } from "@/utils/firebase";

export default function FcmTokenComp() {
  const { notificationPermissionStatus } = useFcmToken();

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (notificationPermissionStatus === "granted") {
        const unsubscribe = onMessage(messaging, (payload) =>
          console.log("Foreground push notification received:", payload)
        );
        return () => {
          unsubscribe(); // Unsubscribe from the onMessage event on cleanup
        };
      }
    }
  }, [notificationPermissionStatus]);

  return null; // This component is primarily for handling foreground notifications
}
