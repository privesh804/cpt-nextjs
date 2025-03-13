"use client";

import { clearData, getData, removeData, setData } from "./localstorage";

// Generate a consistent 32-byte key using SHA-256
async function generateKey(secret: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret);
  return await crypto.subtle.digest("SHA-256", data);
}

const SECRET_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY ||
  "your-unique-secret-key-that-is-long-enough-for-aes";

class CryptoUtils {
  private async getKeyMaterial(): Promise<CryptoKey> {
    // Generate a 32-byte key from the secret
    const keyBuffer = await generateKey(SECRET_KEY);

    return await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM" },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async encrypt(data: string): Promise<string> {
    try {
      const keyMaterial = await this.getKeyMaterial();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(data);

      const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        keyMaterial,
        encodedData
      );

      // Combine IV and encrypted data
      const encryptedArray = new Uint8Array(encryptedData);
      const combined = new Uint8Array(iv.length + encryptedArray.length);
      combined.set(iv);
      combined.set(encryptedArray, iv.length);

      // Convert to base64
      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error("Encryption failed:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  async decrypt(encryptedData: string): Promise<string> {
    try {
      const combined = new Uint8Array(
        atob(encryptedData)
          .split("")
          .map((char) => char.charCodeAt(0))
      );

      const iv = combined.slice(0, 12);
      const encryptedBuffer = combined.slice(12);

      const keyMaterial = await this.getKeyMaterial();

      const decryptedData = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        keyMaterial,
        encryptedBuffer
      );

      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      clearData();
      console.error("Decryption failed:", error);
      return "";
    }
  }
}

// Export a singleton instance
const cryptoUtils = new CryptoUtils();

// Storage utility
export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      const encryptedValue = await cryptoUtils.encrypt(value);

      setData(key, encryptedValue);
    } catch (error) {
      console.error(`Failed to store ${key}:`, error);
      throw new Error(`Failed to store ${key} securely`);
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      const encryptedValue = getData(key) as string;
      if (!encryptedValue) return null;
      return await cryptoUtils.decrypt(encryptedValue);
    } catch (error) {
      console.error(`Failed to retrieve ${key}:`, error);
      throw new Error(`Failed to retrieve ${key} securely`);
    }
  },

  removeItem(key: string): void {
    removeData(key);
  },
};

// Convenience functions for role storage
export const storeRole = async (role: string): Promise<void> => {
  await secureStorage.setItem("role", role);
};

export const getRole = async (): Promise<string | null> => {
  return await secureStorage.getItem("role");
};
