export function getData(key: string): unknown {
  try {
    if (typeof window !== undefined) {
      const item = localStorage.getItem(key);

      if (!item) {
        return undefined;
      }

      return JSON.parse(item);
    }
  } catch (error) {
    console.error(`ERROR: Failed to parse ${key} from localStorage:`, error);
    return undefined;
  }
}

export function setData(key: string, data: unknown): void {
  try {
    if (data !== undefined) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`ERROR: Failed to set ${key} in localStorage:`, error);
  }
}

export function removeData(key: string): void {
  try {
    if (typeof window !== undefined) {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`ERROR: Failed to parse ${key} from localStorage:`, error);
  }
}

export function clearData(): void {
  try {
    // if (typeof window !== undefined) {
    //   localStorage.clear();
    // }
    localStorage.clear();
  } catch (error) {
    console.error(`ERROR: Failed to clear data from localStorage:`, error);
  }
}
