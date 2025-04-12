
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Shield, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Header = () => {
  const { walletAddress, disconnectWallet } = useWallet();
  
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-blue-600" />
        <h1 className="font-bold text-xl">root4sec.1</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="hidden md:flex items-center px-3 py-1 rounded-full border text-sm">
          <span className="text-gray-700 truncate max-w-[120px]">
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
                className="text-gray-500 hover:bg-gray-100"
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
