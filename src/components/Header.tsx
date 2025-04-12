
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Header = () => {
  const { walletAddress, disconnectWallet } = useWallet();
  
  return (
    <header className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-securechat-primary" />
        <h1 className="font-bold text-xl">SecureChat</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="hidden md:flex items-center px-3 py-1 rounded-full border border-white/20 bg-securechat-dark text-sm">
          <div className="h-2 w-2 bg-securechat-success rounded-full mr-2 animate-pulse-slow"></div>
          <span className="text-white/70 truncate max-w-[120px]">
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected'}
          </span>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={disconnectWallet}
                className="text-muted-foreground hover:text-white hover:bg-securechat-primary/20"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Disconnect wallet</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Disconnect wallet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};

export default Header;
