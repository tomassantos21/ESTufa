import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string, additionalData?: Partial<User>) => boolean;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
  uploadImage: (file: File) => Promise<string>;
  detectPlant: (imageUrl: string) => Promise<PlantResult>;
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

  const register = (username: string, password: string, additionalData?: Partial<User>): boolean => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('estufa_users') || '{}');
    if (users[username]) {
      return false; // User already exists
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      username,
      fullName: additionalData?.fullName || username,
      email: additionalData?.email || `${username.toLowerCase().replace(/\s+/g, '.')}@exemplo.com`,
      bio: additionalData?.bio || 'Entusiasta de plantas em aprendizagem.',
    };

    // Store user credentials (in a real app, this would be hashed and stored securely)
    users[username] = { password, user: newUser };
    localStorage.setItem('estufa_users', JSON.stringify(users));

    // Log the user in
    setUser(newUser);
    localStorage.setItem('estufa_user', JSON.stringify(newUser));
    return true;
  };

  const login = (username: string, password: string): boolean => {
    // In a real app, this would call an Azure Function or AD B2C
    const users = JSON.parse(localStorage.getItem('estufa_users') || '{}');

    if (!users[username] || users[username].password !== password) {
      return false; // Invalid credentials
    }

    const user = users[username].user;
    setUser(user);
    localStorage.setItem('estufa_user', JSON.stringify(user));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('estufa_user');
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('estufa_user', JSON.stringify(updatedUser));
  };

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
    <AzureContext.Provider value={{ user, feed, login, register, logout, updateUser, uploadImage, detectPlant, isLoading }}>
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
