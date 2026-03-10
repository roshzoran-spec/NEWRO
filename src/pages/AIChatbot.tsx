import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, ArrowLeft, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

interface Child {
  id: string;
  name: string;
  date_of_birth: string;
  gender: string | null;
}

const SUGGESTED_QUESTIONS = [
  "My child is 2 years old and not speaking. Is this normal?",
  "What activities improve joint attention?",
  "How to improve eye contact in toddlers?",
  "What are early signs of autism?",
  "What milestones should my 18-month-old have?",
  "How often should speech therapy be done?",
];

const AIChatbot = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load children for context
  useEffect(() => {
    if (!user) return;
    const loadChildren = async () => {
      const { data } = await supabase.from("children").select("id, name, date_of_birth, gender").eq("parent_id", user.id);
      if (data && data.length > 0) {
        setChildren(data);
        setSelectedChildId(data[0].id);
      }
    };
    loadChildren();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const getChildContext = () => {
    if (!selectedChildId) return null;
    const child = children.find((c) => c.id === selectedChildId);
    if (!child) return null;
    const dob = new Date(child.date_of_birth);
    const now = new Date();
    const ageMonths = (now.getFullYear() - dob.getFullYear()) * 12 + (now.getMonth() - dob.getMonth());
    return { name: child.name, ageMonths, gender: child.gender };
  };

  const streamChat = async (allMessages: Msg[]) => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/clinical-chat`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages, childContext: getChildContext() }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Unknown error" }));
      if (resp.status === 429) throw new Error("Rate limit exceeded. Please try again shortly.");
      if (resp.status === 402) throw new Error("AI credits exhausted. Please add credits.");
      throw new Error(err.error || "Failed to connect to AI");
    }
    if (!resp.body) throw new Error("No response stream");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let assistantText = "";

    const updateAssistant = (text: string) => {
      assistantText = text;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: text } : m));
        }
        return [...prev, { role: "assistant", content: text }];
      });
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newlineIdx: number;
      while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
        let line = buffer.slice(0, newlineIdx);
        buffer = buffer.slice(newlineIdx + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") return;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) updateAssistant(assistantText + content);
        } catch {
          buffer = line + "\n" + buffer;
          break;
        }
      }
    }
  };

  const send = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;
    const userMsg: Msg = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-lg px-4 py-3 flex items-center gap-3 shrink-0">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
        </Button>
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="font-display font-bold text-foreground text-base">Newro AI Assistant</h1>
          <p className="text-xs text-muted-foreground">Clinical development guidance</p>
        </div>
        {children.length > 0 && (
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent>
              {children.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <div>
              <h2 className="font-display font-bold text-lg text-foreground mb-1">Ask Newro AI anything</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Get personalized guidance on child development, milestones, speech therapy, and more.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => send(q)}
                  className="text-left text-xs p-3 rounded-xl border border-border bg-card hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-card border border-border rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none text-foreground [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-accent" />
                  </div>
                )}
              </motion.div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/80 backdrop-blur-lg p-4 shrink-0">
        <div className="flex gap-2 items-end max-w-3xl mx-auto">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about development, milestones, therapy..."
            className="min-h-[44px] max-h-[120px] resize-none text-sm"
            rows={1}
          />
          <Button
            onClick={() => send()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="shrink-0 h-[44px] w-[44px]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          Newro AI provides guidance only — always consult a qualified professional for clinical decisions.
        </p>
      </div>
    </div>
  );
};

export default AIChatbot;
