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

// Mock Data for the Feed
const INITIAL_FEED: PlantResult[] = [
  {
    id: '1',
    userId: 'user_01',
    username: 'Ana Silva',
    imageUrl: 'https://images.unsplash.com/photo-1628246498566-c846ce32a5b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbmhvdXNlJTIwcGxhbnRzJTIwc3VjY3VsZW50JTIwZmVybiUyMG1vbnN0ZXJhJTIwaW5kb29yJTIwcGxhbnR8ZW58MXx8fHwxNzcxNTE5MTYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    plantName: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    confidence: 0.98,
    description: 'Conhecida pelas suas folhas fenestradas, é uma planta tropical popular.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '2',
    userId: 'user_02',
    username: 'João Santos',
    imageUrl: 'https://images.unsplash.com/photo-1621512367176-03782e847fa2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjdWxlbnQlMjBwbGFudCUyMHBvdHxlbnwxfHx8fDE3NzE0NDIzOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    plantName: 'Suculenta Echeveria',
    scientificName: 'Echeveria elegans',
    confidence: 0.95,
    description: 'Uma suculenta em forma de roseta originária de habitats semi-desérticos.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '3',
    userId: 'user_03',
    username: 'Maria Costa',
    imageUrl: 'https://images.unsplash.com/photo-1697432123723-9bcdfaab7878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJuJTIwbGVhdmVzJTIwZ3JlZW58ZW58MXx8fHwxNzcxNDU3MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    plantName: 'Feto de Boston',
    scientificName: 'Nephrolepis exaltata',
    confidence: 0.92,
    description: 'Uma planta perene herbácea popular em cestos suspensos.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export function AzureProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [feed, setFeed] = useState<PlantResult[]>(INITIAL_FEED);
  const [isLoading, setIsLoading] = useState(false);

  // Load user from local storage on mount (simulating session persistence)
  useEffect(() => {
    const storedUser = localStorage.getItem('estufa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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

  // Mock: Upload to Azure Blob Storage
  const uploadImage = async (file: File): Promise<string> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a local object URL to simulate the Blob URL
        const blobUrl = URL.createObjectURL(file);
        setIsLoading(false);
        resolve(blobUrl);
      }, 1500); // Simulate network latency
    });
  };

  // Mock: Call Azure Function (AI Detection) and Store in CosmosDB
  const detectPlant = async (imageUrl: string): Promise<PlantResult> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        // Determine a random result for demo purposes
        const mockResults = [
          {
            name: 'Aloe Vera',
            sci: 'Aloe vera',
            desc: 'Planta suculenta conhecida pelas suas propriedades medicinais.',
          },
          {
            name: 'Espada de São Jorge',
            sci: 'Sansevieria trifasciata',
            desc: 'Planta robusta com folhas verticais, muito resistente.',
          },
          {
            name: 'Costela de Adão',
            sci: 'Monstera deliciosa',
            desc: 'Planta tropical com grandes folhas perfuradas.',
          }
        ];
        
        const randomPlant = mockResults[Math.floor(Math.random() * mockResults.length)];

        const newResult: PlantResult = {
          id: Date.now().toString(),
          userId: user?.id || 'guest',
          username: user?.username || 'Visitante',
          imageUrl,
          plantName: randomPlant.name,
          scientificName: randomPlant.sci,
          confidence: 0.85 + Math.random() * 0.14,
          description: randomPlant.desc,
          timestamp: new Date().toISOString(),
        };

        // Update local "CosmosDB" state
        setFeed((prev) => [newResult, ...prev]);
        setIsLoading(false);
        resolve(newResult);
      }, 2000); // Simulate AI processing time
    });
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
