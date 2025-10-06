"use client";

import { useState, useRef, useEffect } from "react";
import { random } from "lodash";
import { Input } from "@/common/components/ui/input";
import { Button } from "@/common/components/ui/button";
import { ScrollArea } from "@/common/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/common/components/ui/avatar";
import { Send, Search } from "lucide-react";
import { useGame } from "@/core/store/game-store";
import { api } from "@/api/api";

import { Message } from "@/core/core.types";

export function Chat() {
  const { gameState } = useGame();
  const [characters, setCharacters] = useState(
    gameState.characters.filter((character) =>
      api.util.hasTag(character, "chat")
    )
  );
  const [filteredCharacters, setFilteredCharacters] = useState(characters);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setCharacters(
      gameState.characters.filter((character) =>
        api.util.hasTag(character, "chat")
      )
    );
  }, [gameState.characters]);

  // Format time for display
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredCharacters(
      characters.filter((char) =>
        api.character
          .getFullName(char)
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, characters]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [gameState.chats, selectedCharacter]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    const playerMsg: Message = {
      id: useGame.getState().gameState.world.time!,
      characterId: selectedCharacter.id,
      content: newMessage,
      timestamp: useGame.getState().gameState.world.time!,
      isPlayer: true,
    };
    api.character.addChatMessage(selectedCharacter.id, playerMsg);
    setNewMessage("");
  };

  // Typing animation when player sends a message
  useEffect(() => {
    if (!isTyping) return;
    const typingDelay = random(2000, 5000);
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, typingDelay);
    return () => clearTimeout(timeout);
  }, [isTyping]);

  console.log("Characters", characters);
  console.log("Filtered Characters", filteredCharacters);

  return (
    <div className="flex h-screen w-full">
      {/* Custom Sidebar */}
      <div className="w-64 flex flex-col pr-4">
        <div className="p-4 mb-2">
          <h2 className="text-lg font-bold mb-2">Characters</h2>
          <div className="relative">
            <Input
              placeholder="Search characters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        {filteredCharacters.length > 0 ? (
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-3">
              {filteredCharacters.map((character) => (
                <button
                  key={character.id}
                  onClick={() => setSelectedCharacter(character)}
                  className={`w-full flex items-center gap-3 p-3 rounded-md text-left ${
                    selectedCharacter.id === character.id
                      ? "bg-primary text-primary-foreground font-medium hover:bg-primary/80"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Avatar>
                    <AvatarFallback>
                      {api.character.getInitial(character)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span
                      className={
                        selectedCharacter.id === character.id
                          ? "font-bold"
                          : "font-medium"
                      }
                    >
                      {api.character.getFullName(character)}
                    </span>
                    <span className="text-xs text-muted-foreground"></span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No characters available
          </div>
        )}
      </div>

      {/* Chat Area */}

      {filteredCharacters.length > 0 ? (
        <div className="flex flex-1 flex-col pl-4">
          <div className="p-4 mb-2 flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {api.character.getInitial(selectedCharacter)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">
                {api.character.getFullName(selectedCharacter)}
              </h2>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-6">
              {/* Chat messages */}
              {gameState.chats[selectedCharacter.id]?.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.isPlayer ? "justify-end" : "justify-start"
                  }`}
                >
                  {!message.isPlayer && (
                    <Avatar>
                      <AvatarFallback>
                        {api.character.getInitial(selectedCharacter)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`flex flex-col max-w-[70%] ${
                      message.isPlayer ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.isPlayer ? "bg-popover" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  {message.isPlayer && (
                    <Avatar>
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {/* Typing animation for character (left side only) */}
              {isTyping && (
                <div className="flex gap-4 justify-start">
                  <Avatar>
                    <AvatarFallback>
                      {api.character.getInitial(selectedCharacter)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col max-w-[70%] items-start">
                    <div className="px-4 py-2 rounded-lg bg-muted flex items-center">
                      <span className="animate-pulse flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                      Typing...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 mt-2">
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${api.character.getFullName(
                  selectedCharacter
                )}...`}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          No conversation selected
        </div>
      )}
    </div>
  );
}
