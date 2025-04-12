
import { Separator } from "@/components/ui/separator";
import ContactList from "@/components/ContactList";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import Header from "@/components/Header";
import { useMessaging } from "@/context/MessagingContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LockIcon, Lock, Clock } from "lucide-react";

const ChatInterface = () => {
  const { selectedContact } = useMessaging();
  
  const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full sm:w-80 bg-muted border-r border-white/10">
          <ContactList />
        </div>
        
        <div className="flex-1 flex flex-col">
          {selectedContact && (
            <div className="border-b border-white/10 p-3 flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarFallback className="bg-securechat-secondary text-white">
                    {getInitials(selectedContact.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <div className="text-xs text-muted-foreground">
                    {selectedContact.address.slice(0, 6)}...{selectedContact.address.slice(-4)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5 mr-1 text-securechat-primary" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <MessageList />
          </div>
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
