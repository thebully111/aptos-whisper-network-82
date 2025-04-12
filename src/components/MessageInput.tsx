
import { useState } from "react";
import { useMessaging } from "@/context/MessagingContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Clock, Send, Shield } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const [expiry, setExpiry] = useState<number | null>(null);
  const { selectedContact, sendMessage } = useMessaging();

  const handleSendMessage = () => {
    if (!selectedContact || !message.trim()) return;

    sendMessage(selectedContact.address, message.trim(), expiry || undefined);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedContact) return null;

  const getExpiryLabel = () => {
    if (expiry === null) return "No expiration";
    if (expiry === 5) return "5 minutes";
    if (expiry === 60) return "1 hour";
    if (expiry === 1440) return "24 hours";
    return "Custom";
  };

  return (
    <div className="p-4 border-t border-white/10 flex gap-2">
      <Input
        placeholder="Type a secure message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0">
            <Clock className="h-4 w-4" />
            <span className="sr-only">Message expiry</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setExpiry(null)}>
            <Shield className="h-4 w-4 mr-2" />
            No expiration
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setExpiry(5)}>
            <Clock className="h-4 w-4 mr-2" />
            5 minutes
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setExpiry(60)}>
            <Clock className="h-4 w-4 mr-2" />
            1 hour
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setExpiry(1440)}>
            <Clock className="h-4 w-4 mr-2" />
            24 hours
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button 
        onClick={handleSendMessage} 
        disabled={!message.trim()}
        className="secure-button group"
      >
        <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
        Send {expiry !== null ? `(${getExpiryLabel()})` : ''}
      </Button>
    </div>
  );
};

export default MessageInput;
