import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Types mimicking our eventual CosmosDB schema
export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  fullName?: string;
  email?: string;
  bio?: string;
}

export interface PlantResult {
  id: string;
  userId: string;
  username: string;
  imageUrl: string;
  plantName: string;
  scientificName: string;
  confidence: number;
  description: string;
  timestamp: string;
}

interface AzureContextType {
  user: User | null;
  feed: PlantResult[];
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, additionalData?: Partial<User>) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<boolean>;
  uploadImage: (file: File) => Promise<string>;
  detectPlant: (imageUrl: string) => Promise<PlantResult>;
  getGallery: (username: string) => Promise<PlantResult[]>;
  isLoading: boolean;
}

const AzureContext = createContext<AzureContextType | undefined>(undefined);

export function AzureProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [feed, setFeed] = useState<PlantResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load user from local storage on mount (simulating session persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem('estufa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Fetch real feed from Azure Functions
    const fetchFeed = async () => {
      try {
        const baseUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:7071';
        const res = await fetch(`${baseUrl}/api/getFeed`);
        if (res.ok) {
          const data = await res.json();
          setFeed(data);
        }
      } catch (err) {
        console.error("Error fetching feed:", err);
      }
    };
    fetchFeed();
  }, []);

  const register = async (username: string, password: string, additionalData?: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const baseUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:7071';
      const res = await fetch(`${baseUrl}/api/registerUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          ...additionalData
        })
      });

      if (!res.ok) {
        setIsLoading(false);
        return false;
      }

      const newUser = await res.json();
      setUser(newUser);
      localStorage.setItem('estufa_user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const baseUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:7071';
      const res = await fetch(`${baseUrl}/api/loginUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        setIsLoading(false);
        return false;
      }

      const loggedInUser = await res.json();
      setUser(loggedInUser);
      localStorage.setItem('estufa_user', JSON.stringify(loggedInUser));
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('estufa_user');
  };

  const updateUser = async (updatedData: Partial<User>): Promise<boolean> => {
    if (!user) return false;
    setIsLoading(true);
    try {
      const baseUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:7071';
      const res = await fetch(`${baseUrl}/api/updateUser`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, ...updatedData })
      });

      if (!res.ok) {
        setIsLoading(false);
        return false;
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      localStorage.setItem('estufa_user', JSON.stringify(updatedUser));
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      return false;
    }
  };

  const getGallery = useCallback(async (username: string): Promise<PlantResult[]> => {
    setIsLoading(true);
    try {
      const baseUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:7071';
      const res = await fetch(`${baseUrl}/api/getGallery?username=${encodeURIComponent(username)}`);
      if (!res.ok) throw new Error("Failed to fetch gallery");
      const data = await res.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      return [];
    }
  }, []);

  // Real: Upload to Azure Blob Storage via SAS Token
  const uploadImage = async (file: File): Promise<string> => {
    setIsLoading(true);
    try {
      const baseUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:7071';
      // 1. Get SAS URL
      const tokenRes = await fetch(`${baseUrl}/api/getUploadToken?fileName=${encodeURIComponent(file.name)}`);
      if (!tokenRes.ok) throw new Error("Failed to get upload token");
      const { sasUrl, blobUrl } = await tokenRes.json();

      // 2. Upload file directly to Azure Blob Storage
      const uploadRes = await fetch(sasUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': file.type
        },
        body: file
      });
      if (!uploadRes.ok) throw new Error("Failed to upload image to Azure Storage");

      setIsLoading(false);
      return blobUrl;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  // Real: Call Azure Function (AI Detection) and Store in CosmosDB
  const detectPlant = async (imageUrl: string): Promise<PlantResult> => {
    setIsLoading(true);
    try {
      const baseUrl = (import.meta as any).env.VITE_API_URL || 'http://localhost:7071';
      const res = await fetch(`${baseUrl}/api/detectPlant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          userId: user?.id,
          username: user?.username
        })
      });
      
      if (!res.ok) throw new Error("AI Detection failed");
      
      const newResult = await res.json();
      
      // Update local feed state
      setFeed((prev) => [newResult, ...prev]);
      setIsLoading(false);
      return newResult;
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  return (
    <AzureContext.Provider value={{ user, feed, login, register, logout, updateUser, uploadImage, detectPlant, getGallery, isLoading }}>
      {children}
    </AzureContext.Provider>
  );
}

export function useAzure() {
  const context = useContext(AzureContext);
  if (context === undefined) {
    throw new Error('useAzure must be used within an AzureProvider');
  }
  return context;
}
