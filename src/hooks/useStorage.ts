import { useEffect, useState } from "react";

const Storage = {
  getItem: async (key: string) => await localStorage.getItem(key),
  setItem: (key: string, value: string) => localStorage.setItem(key, value),
  removeItem: (key: string) => localStorage.removeItem(key),
  serialize: JSON.stringify,
  deserialize: JSON.parse,
};

export const getStorage = async <T>(name: string, defaultValue: T): Promise<T> => {
  const data = await Storage.getItem(name);
  if (!data) return defaultValue;
  return Storage.deserialize(data);
};

export const setStorage = <T>(name: string, data: T) => {
  Storage.setItem(name, Storage.serialize(data)); //
};

const useStorage = <T>(name: string, defaultValue: T) => {
  const [localData, setLocalData] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  const setData = (data: T) => {
    setStorage(name, data);
    setLocalData(data);
  };

  useEffect(() => {
    getStorage(name, defaultValue).then((data) => {
      setLocalData(data);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === name) {
        setLocalData(event.newValue ? Storage.deserialize(event.newValue) : defaultValue);
      }
    };
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, [name, defaultValue]);

  return { data: localData, setData, isLoading };
};

export default useStorage;
