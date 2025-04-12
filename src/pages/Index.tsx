
import { useWallet } from "@/context/WalletContext";
import { MessagingProvider } from "@/context/MessagingContext";
import WalletConnect from "@/components/WalletConnect";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const { isConnected } = useWallet();
  
  if (!isConnected) {
    return <WalletConnect />;
  }
  
  return (
    <MessagingProvider>
      <ChatInterface />
    </MessagingProvider>
  );
};

export default Index;
