
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const savedAddress = localStorage.getItem('securechat_wallet_address');
        if (savedAddress) {
          setWalletAddress(savedAddress);
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Failed to check wallet connection", error);
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Use the wallet address provided by the user
      const mockAddress = "0xc6d2cf7abab25cecc877c19e7cf7a297ce72f84750084fd631678e938b00e9f4";
      setWalletAddress(mockAddress);
      setIsConnected(true);
      localStorage.setItem('securechat_wallet_address', mockAddress);
      
      toast({
        title: "Success",
        description: "Wallet connected successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    localStorage.removeItem('securechat_wallet_address');
    toast({
      title: "Info",
      description: "Wallet disconnected",
      variant: "default",
    });
  };

  const value = {
    isConnected,
    walletAddress,
    connectWallet,
    disconnectWallet,
    isLoading
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
