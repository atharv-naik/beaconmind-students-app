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
}

export const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const defaultApiDetails = {
    ip: 'c9fd-14-139-220-33.ngrok-free.app',
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
  const [user, setUser] = useState({});

  useEffect(() => {
    const loadApiDetails = async () => {
      try {
        const savedIp = await AsyncStorage.getItem('api_ip');
        const savedPort = await AsyncStorage.getItem('api_port');
        const savedProtocol = await AsyncStorage.getItem('api_protocol');

        setApiDetails({
          ip: savedIp || defaultApiDetails.ip,
          port: savedPort || defaultApiDetails.port,
          protocol: savedProtocol || defaultApiDetails.protocol,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to load API details.');
      }
    };

    loadApiDetails();
  }, []);

  useEffect(() => {
    const constructBaseUrl = ({ protocol, ip, port }: ApiDetails) => 
      port ? `${protocol}://${ip}:${port}/` : `${protocol}://${ip}/`;

    const newBaseUrl = constructBaseUrl(apiDetails);
    setBaseUrl(newBaseUrl);
    setAuthUrl(`${newBaseUrl}accounts/api/`);
    setChatUrl(`${newBaseUrl}chat/api/chat/`);
  }, [apiDetails]);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const tk = await AsyncStorage.getItem('token');
      setToken(tk || '');
      const logged = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(logged === 'true');
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  function setUserAndTokenIfLoggedIn() {
    if (isLoggedIn) {
      fetch(`${authUrl}profile/`, {
        headers: { Authorization: `Token ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('User:', data);
          setUser(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  useEffect(() => {
    setUserAndTokenIfLoggedIn();
  }, [isLoggedIn]);

  return (
    <ApiContext.Provider value={{ apiDetails, baseUrl, authUrl, chatUrl, token, isLoggedIn, setIsLoggedIn, setApiDetails, setToken, loading, setLoading, user, setUser }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContext;
