import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { getCurrentUser, getCurrentDriverUser } from "../lib/appwrite";
import { router } from "expo-router";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isDriver, setIsDriver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getCurrentUser();
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const checkDriverUser = async () => {
      try {
        const res = await getCurrentDriverUser();
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
          setIsDriver(true);
          router.push("/home-dri"); // Use push to redirect to driver portal
        } else {
          setIsDriver(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDriverUser();
  }, [navigation]);

  useEffect(() => {
    if (isLoggedIn && !isDriver) {
      router.push("./home"); // Use push to redirect to user portal if not a driver
    }
  }, [isLoggedIn, isDriver, navigation]);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isDriver,
        isLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
