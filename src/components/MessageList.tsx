
import { useMessaging } from "@/context/MessagingContext";
import { useWallet } from "@/context/WalletContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Clock, Lock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const MessageList = () => {
  const { selectedContact, getMessagesWithContact, deleteMessage } = useMessaging();
  const { walletAddress } = useWallet();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const messages = selectedContact 
    ? getMessagesWithContact(selectedContact.address) 
    : [];
  
  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);
  
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatExpiryTime = (expiresAt?: number) => {
    if (!expiresAt) return null;
    
    const now = Date.now();
    const timeLeft = expiresAt - now;
    
    if (timeLeft <= 0) return "Expired";
    if (timeLeft < 60000) return "< 1m left";
    if (timeLeft < 3600000) return `${Math.floor(timeLeft / 60000)}m left`;
    
    return `${Math.floor(timeLeft / 3600000)}h ${Math.floor((timeLeft % 3600000) / 60000)}m left`;
  };
  
  if (!selectedContact) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center text-muted-foreground">
        <div>
          <Lock className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-medium mb-1">Select a contact</h3>
          <p className="text-sm max-w-xs mx-auto">
            Choose a contact from the list to start a secure, end-to-end encrypted conversation
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <ScrollArea ref={scrollAreaRef} className="h-full p-4">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Lock className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>No messages yet. Start a secure conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.sender === walletAddress;
            const expiryTime = formatExpiryTime(message.expiresAt);
            
            return (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  isOwnMessage ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3 shadow-sm",
                    isOwnMessage 
                      ? "bg-securechat-primary/90 text-white rounded-br-none" 
                      : "bg-securechat-dark border border-white/10 rounded-bl-none"
                  )}
                >
                  <div className="flex items-center gap-1 mb-1 text-xs opacity-70">
                    <Lock className="h-3 w-3" />
                    <span>End-to-end encrypted</span>
                  </div>
                  <p className="mb-1">{message.content}</p>
                  <div className="flex items-center justify-end gap-1.5 text-xs opacity-70">
                    {expiryTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {expiryTime}
                      </span>
                    )}
                    <span>{formatTimestamp(message.timestamp)}</span>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 rounded-full hover:bg-white/10"
                            onClick={() => deleteMessage(message.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Delete message</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete message</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
