import { useState, useEffect } from "react";

interface UseEventSourceProps {
  url: string;
  eventTypes?: string[];
}

export function useEventSource<T = any>({
  url,
  eventTypes = ["message"],
}: UseEventSourceProps) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create EventSource instance
    const eventSource = new EventSource(
      `https://abhidomain.projectcpt.store/backend/api/v1/tenant${url}`
    );

    // Connection opened
    eventSource.onopen = () => {
      setIsConnected(true);
      console.log("SSE connection established");
    };

    // Listen for specific event types
    eventTypes.forEach((eventType) => {
      eventSource.addEventListener(eventType, (event: MessageEvent) => {
        try {
          const parsedData = JSON.parse(event.data);
          setData({ ...parsedData, progress: Math.ceil(Math.random() * 100) });
          console.log("SSE response established");
        } catch (err) {
          setData(event.data as unknown as T);
        }
      });
    });

    // Handle errors
    eventSource.onerror = (err) => {
      setError(err instanceof Error ? err : new Error("SSE connection error"));
      setIsConnected(false);
      console.error("SSE connection error:", err);
    };

    // Clean up on unmount
    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  return { data, error, isConnected };
}
