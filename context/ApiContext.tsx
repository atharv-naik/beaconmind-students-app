// context/ApiContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface ApiDetails {
  ip: string;
  port: string;
  protocol: string;
}

interface ApiContextType {
  apiDetails: ApiDetails;
  baseUrl: string;
  authUrl: string;
  chatUrl: string;
  token: string;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  setApiDetails: (details: ApiDetails) => void;
  setToken: (token: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  user: any;
  setUser: (user: any) => void;
  isProfileSetup: boolean;
  setIsProfileSetup: (isProfileSetup: boolean) => void;
  status: string;
  setStatus: (status: string) => void;
}

export const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const defaultApiDetails = {
    ip: 'students.beaconmind.net',
    port: '',
    protocol: 'https',
  };

  const [apiDetails, setApiDetails] = useState<ApiDetails>(defaultApiDetails);
  const [baseUrl, setBaseUrl] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [chatUrl, setChatUrl] = useState('');
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isProfileSetup, setIsProfileSetup] = useState(false);
  const [user, setUser] = useState({});
  const [status, setStatus] = useState('chat');

  useEffect(() => {
    const initialize = async () => {
      try {
        // Step 1: Load saved API details
        const savedIp = await AsyncStorage.getItem('api_ip');
        const savedPort = await AsyncStorage.getItem('api_port');
        const savedProtocol = await AsyncStorage.getItem('api_protocol');

        const details: ApiDetails = {
          ip: savedIp || defaultApiDetails.ip,
          port: savedPort || defaultApiDetails.port,
          protocol: savedProtocol || defaultApiDetails.protocol,
        };
        setApiDetails(details);

        // Step 2: Construct URLs
        const constructedBaseUrl = details.port
          ? `${details.protocol}://${details.ip}:${details.port}/`
          : `${details.protocol}://${details.ip}/`;
        const constructedAuthUrl = `${constructedBaseUrl}accounts/api/`;
        const constructedChatUrl = `${constructedBaseUrl}chat/api/chat/`;

        setBaseUrl(constructedBaseUrl);
        setAuthUrl(constructedAuthUrl);
        setChatUrl(constructedChatUrl);

        // Load saved status from AsyncStorage
        const savedStatus = await AsyncStorage.getItem('status');
        if (savedStatus) setStatus(savedStatus);

        // Step 3: Load login state and token
        const storedToken = await AsyncStorage.getItem('token');
        const storedLoggedIn = await AsyncStorage.getItem('isLoggedIn');

        if (storedToken && storedLoggedIn === 'true') {
          setToken(storedToken);
          setIsLoggedIn(true);

          // Step 4: Fetch user profile
          const constructedAuthUrl = `${constructedBaseUrl}accounts/api/`;
          const res = await fetch(`${constructedAuthUrl}profile/`, {
            headers: { Authorization: `Token ${storedToken}` },
          });

          if (res.ok) {
            const userData = await res.json();
            console.log("ApiContext: fetched user data:", userData);
            setUser(userData);
            setIsProfileSetup(userData.profile_setup_complete === true);
          } else {
            throw new Error('Invalid token or user fetch failed.');
          }
        } else {
          setIsLoggedIn(false);
          setToken('');
          setUser({});
        }
      } catch (err) {
        console.error('ApiContext Init Error:', err);
        setIsLoggedIn(false);
        setToken('');
        setUser({});
        await AsyncStorage.multiRemove(['token', 'isLoggedIn']);
      } finally {
        setLoading(false); // Let app navigate only after everything finishes
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!loading) {
      console.log('status changed:', status);
      AsyncStorage.setItem('status', status).catch((err) =>
        console.error('Failed to save status to storage', err)
      );
    }
  }, [status]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isLoggedIn || !token || !authUrl) return;
  
      try {
        setLoading(true);
        const res = await fetch(`${authUrl}profile/`, {
          headers: { Authorization: `Token ${token}` },
        });
  
        if (!res.ok) throw new Error(`Failed to fetch profile. Status ${res.status}`);
  
        const userData = await res.json();
        console.log("Fetched new user:", userData);
        setUser(userData);
        setIsProfileSetup(userData.profile_setup_complete === true);
      } catch (error) {
        console.error("Failed to fetch user after login:", error);
        setIsLoggedIn(false);
        setToken('');
        setUser({});
        await AsyncStorage.multiRemove(['token', 'isLoggedIn']);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserProfile();
  }, [token, isLoggedIn, authUrl]);
  


  return (
    <ApiContext.Provider
      value={{
        apiDetails,
        baseUrl,
        authUrl,
        chatUrl,
        token,
        isLoggedIn,
        setIsLoggedIn,
        setApiDetails,
        setToken,
        loading,
        setLoading,
        user,
        setUser,
        isProfileSetup,
        setIsProfileSetup,
        status,
        setStatus,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
