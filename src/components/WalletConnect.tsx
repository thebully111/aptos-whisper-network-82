
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/context/WalletContext";
import { Shield, Wallet } from "lucide-react";

const WalletConnect = () => {
  const { connectWallet, isLoading } = useWallet();

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-500/20 p-3 flex items-center justify-center">
            <Shield className="h-10 w-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">root4sec.1</CardTitle>
          <CardDescription className="text-gray-600">
            Secure Messaging Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-500 mb-6">
            <p>Connect your Martian Aptos Wallet to access secure messaging.</p>
          </div>
          <Button 
            onClick={connectWallet} 
            className="w-full"
            disabled={isLoading}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletConnect;
