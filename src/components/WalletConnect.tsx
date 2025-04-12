
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/context/WalletContext";
import { Shield, Wallet } from "lucide-react";

const WalletConnect = () => {
  const { connectWallet, isLoading } = useWallet();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="glass-panel w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-securechat-primary/20 p-3 flex items-center justify-center">
            <Shield className="h-10 w-10 text-securechat-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">SecureChat</CardTitle>
          <CardDescription className="text-muted-foreground">
            भारत का सबसे सुरक्षित मैसेजिंग ऐप (India's Most Secure Messaging App)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground mb-6">
            <p>Connect your Martian Aptos Wallet to access SecureChat's end-to-end encrypted messaging.</p>
          </div>
          <Button 
            onClick={connectWallet} 
            className="w-full secure-button group"
            disabled={isLoading}
          >
            <Wallet className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            {isLoading ? "Connecting..." : "Connect Martian Aptos Wallet"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletConnect;
