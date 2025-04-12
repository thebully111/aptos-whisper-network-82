
import { useMessaging } from "@/context/MessagingContext";
import { useWallet } from "@/context/WalletContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, User } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const ContactList = () => {
  const { contacts, selectContact, selectedContact, getMessagesWithContact } = useMessaging();
  const { walletAddress } = useWallet();
  const [searchQuery, setSearchQuery] = useState("");
  const [newContactAddress, setNewContactAddress] = useState("");
  const [newContactName, setNewContactName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { addContact } = useMessaging();

  const handleAddContact = () => {
    if (newContactAddress.trim()) {
      addContact(newContactAddress, newContactName);
      setNewContactAddress("");
      setNewContactName("");
      setDialogOpen(false);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    contact.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
  };

  const getUnreadCount = (contactAddress: string) => {
    const messages = getMessagesWithContact(contactAddress);
    return messages.filter(msg => 
      !msg.isRead && msg.recipient === walletAddress && msg.sender === contactAddress
    ).length;
  };

  const formatLastActive = (timestamp?: number) => {
    if (!timestamp) return "Never";
    
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-9 bg-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {filteredContacts.length > 0 ? (
          <div className="p-2">
            {filteredContacts.map(contact => {
              const unreadCount = getUnreadCount(contact.address);
              
              return (
                <Button
                  key={contact.address}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start mb-1 p-2 h-auto",
                    selectedContact?.address === contact.address 
                      ? "bg-securechat-primary/20 text-white" 
                      : "hover:bg-securechat-primary/10"
                  )}
                  onClick={() => selectContact(contact)}
                >
                  <div className="flex items-center w-full">
                    <Avatar className="h-9 w-9 mr-2">
                      <AvatarFallback className={cn(
                        "bg-securechat-secondary text-white",
                        contact.lastActive && Date.now() - contact.lastActive < 300000 
                          ? "border-2 border-securechat-success" 
                          : ""
                      )}>
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {contact.address.slice(0, 6)}...{contact.address.slice(-4)} • {formatLastActive(contact.lastActive)}
                      </div>
                    </div>
                    {unreadCount > 0 && (
                      <div className="bg-securechat-primary text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <h3 className="text-lg font-medium mb-1">No contacts found</h3>
            <p className="text-sm">Try a different search or add a new contact</p>
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t border-white/10 mt-auto">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full secure-button">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div className="space-y-2">
                <Label htmlFor="address">Wallet Address</Label>
                <Input 
                  id="address" 
                  placeholder="0x..." 
                  value={newContactAddress}
                  onChange={(e) => setNewContactAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Display Name (Optional)</Label>
                <Input 
                  id="name" 
                  placeholder="Enter a name" 
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="secure-button" onClick={handleAddContact}>Add Contact</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ContactList;
