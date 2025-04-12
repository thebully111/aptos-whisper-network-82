
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
  expiresAt?: number;
  isRead: boolean;
  isEncrypted: boolean;
}

interface Contact {
  address: string;
  name?: string;
  lastActive?: number;
}

interface MessagingContextType {
  messages: Message[];
  contacts: Contact[];
  sendMessage: (recipient: string, content: string, expiresInMinutes?: number) => void;
  getMessagesWithContact: (address: string) => Message[];
  markAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  addContact: (address: string, name?: string) => void;
  selectedContact: Contact | null;
  selectContact: (contact: Contact | null) => void;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export function useMessaging() {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
}

// Mock function to simulate E2E encryption
const encryptMessage = (message: string): string => {
  // In a real app, we would use proper E2E encryption here
  return message;
};

// Mock function to simulate decryption
const decryptMessage = (encryptedMessage: string): string => {
  // In a real app, we would use proper decryption here
  return encryptedMessage;
};

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isConnected, walletAddress } = useWallet();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Load messages and contacts from local storage on component mount
  useEffect(() => {
    if (isConnected && walletAddress) {
      const savedMessages = localStorage.getItem(`securechat_messages_${walletAddress}`);
      const savedContacts = localStorage.getItem(`securechat_contacts_${walletAddress}`);
      
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      
      if (savedContacts) {
        setContacts(JSON.parse(savedContacts));
      } else {
        // Add demo contacts with Indian names
        const demoContacts = [
          { 
            address: '0x1CF52AB003BDC14CA1EF074487449DA99941E17D', 
            name: 'Priya',
            lastActive: Date.now() - 5 * 60 * 1000 
          },
          { 
            address: '0x2BC23AB53F713859CA5B5FB745334875A3E9CDE2', 
            name: 'Raj',
            lastActive: Date.now() - 24 * 60 * 60 * 1000 
          },
          { 
            address: '0x3AD43AB9AF724129CB525FB734240875A4E92D41', 
            name: 'Ananya',
            lastActive: Date.now() 
          },
          { 
            address: '0x4BD43FF9EE724129CB525FB734240875A4E92ABC', 
            name: 'Vikram',
            lastActive: Date.now() - 2 * 60 * 60 * 1000 
          }
        ];
        setContacts(demoContacts);
        localStorage.setItem(`securechat_contacts_${walletAddress}`, JSON.stringify(demoContacts));
      }
    }
  }, [isConnected, walletAddress]);

  // Clean up expired messages
  useEffect(() => {
    const now = Date.now();
    const filteredMessages = messages.filter(msg => !msg.expiresAt || msg.expiresAt > now);
    
    if (filteredMessages.length !== messages.length) {
      setMessages(filteredMessages);
      if (walletAddress) {
        localStorage.setItem(`securechat_messages_${walletAddress}`, JSON.stringify(filteredMessages));
      }
    }
    
    // Set interval to check for expired messages
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setMessages(prevMessages => {
        const updated = prevMessages.filter(msg => !msg.expiresAt || msg.expiresAt > currentTime);
        if (updated.length !== prevMessages.length && walletAddress) {
          localStorage.setItem(`securechat_messages_${walletAddress}`, JSON.stringify(updated));
        }
        return updated;
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [messages, walletAddress]);

  const sendMessage = (recipient: string, content: string, expiresInMinutes?: number) => {
    if (!isConnected || !walletAddress) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    const encryptedContent = encryptMessage(content);
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      sender: walletAddress,
      recipient,
      content: encryptedContent,
      timestamp: Date.now(),
      expiresAt: expiresInMinutes ? Date.now() + expiresInMinutes * 60 * 1000 : undefined,
      isRead: false,
      isEncrypted: true
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    
    // Save to local storage (in a real app, this would be stored on the blockchain)
    localStorage.setItem(`securechat_messages_${walletAddress}`, JSON.stringify(updatedMessages));
    
    toast({
      title: "Success",
      description: "Message sent securely",
      variant: "default",
    });
    
    // Simulate receiving a response for demo purposes
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const responseOptions = [
          "Thanks for the message! SecureChat is amazing!",
          "Message received securely. Great technology!",
          "Thanks for contacting me! I love how private this is.",
          "Got it! End-to-end encryption is awesome!",
          "Your message came through perfectly. SecureChat is the best!"
        ];
        
        const responseContent = responseOptions[Math.floor(Math.random() * responseOptions.length)];
        const recipientName = contacts.find(c => c.address === recipient)?.name || "Unknown";
        
        const response: Message = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          sender: recipient,
          recipient: walletAddress,
          content: encryptMessage(responseContent),
          timestamp: Date.now(),
          isRead: false,
          isEncrypted: true
        };
        
        setMessages(prev => {
          const updated = [...prev, response];
          localStorage.setItem(`securechat_messages_${walletAddress}`, JSON.stringify(updated));
          return updated;
        });
        
        toast({
          title: "New Message",
          description: `New message from ${recipientName}`,
          variant: "default",
        });
      }, 3000 + Math.random() * 10000);
    }
  };

  const getMessagesWithContact = (address: string) => {
    return messages.filter(
      msg => (msg.sender === address && msg.recipient === walletAddress) || 
             (msg.sender === walletAddress && msg.recipient === address)
    ).sort((a, b) => a.timestamp - b.timestamp);
  };

  const markAsRead = (messageId: string) => {
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    );
    
    setMessages(updatedMessages);
    if (walletAddress) {
      localStorage.setItem(`securechat_messages_${walletAddress}`, JSON.stringify(updatedMessages));
    }
  };

  const deleteMessage = (messageId: string) => {
    const updatedMessages = messages.filter(msg => msg.id !== messageId);
    setMessages(updatedMessages);
    if (walletAddress) {
      localStorage.setItem(`securechat_messages_${walletAddress}`, JSON.stringify(updatedMessages));
    }
    toast({
      title: "Info",
      description: "Message deleted",
      variant: "default",
    });
  };

  const addContact = (address: string, name?: string) => {
    // Check if contact already exists
    const existingContact = contacts.find(c => c.address === address);
    if (existingContact) {
      toast({
        title: "Error",
        description: "Contact already exists",
        variant: "destructive",
      });
      return;
    }

    const newContact: Contact = {
      address,
      name: name || `User-${address.substring(0, 6)}`,
      lastActive: Date.now()
    };

    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    
    if (walletAddress) {
      localStorage.setItem(`securechat_contacts_${walletAddress}`, JSON.stringify(updatedContacts));
    }
    
    toast({
      title: "Success",
      description: "Contact added",
      variant: "default",
    });
  };

  const selectContact = (contact: Contact | null) => {
    setSelectedContact(contact);
    
    // Mark unread messages as read
    if (contact && walletAddress) {
      const updatedMessages = messages.map(msg => 
        msg.sender === contact.address && msg.recipient === walletAddress && !msg.isRead
          ? { ...msg, isRead: true }
          : msg
      );
      
      if (updatedMessages.some(msg => msg.isRead !== messages.find(m => m.id === msg.id)?.isRead)) {
        setMessages(updatedMessages);
        localStorage.setItem(`securechat_messages_${walletAddress}`, JSON.stringify(updatedMessages));
      }
    }
  };

  const value = {
    messages,
    contacts,
    sendMessage,
    getMessagesWithContact,
    markAsRead,
    deleteMessage,
    addContact,
    selectedContact,
    selectContact
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};
