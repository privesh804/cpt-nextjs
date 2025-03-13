import { secureStorage } from "./crypto";
const AUTH_LOCAL_STORAGE_KEY = `${process.env.NEXT_PUBLIC_NAME}-auth-v${process.env.NEXT_PUBLIC_VERSION}`;

const getAuth = async (): Promise<AuthModel | undefined> => {
  try {
    const auth = await secureStorage.getItem(AUTH_LOCAL_STORAGE_KEY);

    if (auth) {
      return JSON.parse(auth);
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("AUTH LOCAL STORAGE PARSE ERROR", error);
  }
};

const setAuth = (auth: AuthModel) => {
  secureStorage.setItem(AUTH_LOCAL_STORAGE_KEY, JSON.stringify(auth));
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    secureStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error("AUTH LOCAL STORAGE REMOVE ERROR", error);
  }
};

export { AUTH_LOCAL_STORAGE_KEY, getAuth, removeAuth, setAuth };
