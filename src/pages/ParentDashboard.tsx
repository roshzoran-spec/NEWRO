import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain, Baby, Plus, Bell, Calendar, ClipboardList, TrendingUp,
  Trash2, Edit, ChevronRight, User, LogOut, Loader2, CheckCircle2, AlertCircle, Video, Activity, ArrowUpRight, MessageCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, differenceInMonths, isPast, isToday, addDays } from "date-fns";
import { calculateAchievement, getMilestonesForAge } from "@/data/milestones";
import type { Database } from "@/integrations/supabase/types";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

interface Child {
  id: string;
  name: string;
  date_of_birth: string;
  gender: string;
  notes: string;
}

interface Assessment {
  id: string;
  child_id: string;
  assessment_type: string;
  title: string;
  summary: string;
  scores: Record<string, unknown>;
  created_at: string;
}

interface Reminder {
  id: string;
  child_id: string;
  title: string;
  description: string;
  reminder_date: string;
  is_completed: boolean;
  reminder_type: string;
}

type ChildInsert = Database["public"]["Tables"]["children"]["Insert"];
const SELECTED_CHILD_STORAGE_KEY = "newro_selected_child_id";

const ParentDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [addingChild, setAddingChild] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newChild, setNewChild] = useState({ name: "", dob: "", gender: "unknown", notes: "" });
  const [newReminder, setNewReminder] = useState({ title: "", description: "", date: "", type: "milestone" });
  const [activeMainTab, setActiveMainTab] = useState("overview");

  // Fetch data
  useEffect(() => {
    if (user) {
      fetchChildren();
      fetchReminders();
    }
    // Safety exit for buffering
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    if (selectedChild) fetchAssessments(selectedChild.id);
  }, [selectedChild]);

  useEffect(() => {
    if (!selectedChild) {
      sessionStorage.removeItem(SELECTED_CHILD_STORAGE_KEY);
      return;
    }
    sessionStorage.setItem(SELECTED_CHILD_STORAGE_KEY, selectedChild.id);
  }, [selectedChild]);

  useEffect(() => {
    if (!addingChild) return;
    const timer = window.setTimeout(() => {
      setAddingChild(false);
      toast.error("Creating profile timed out. Please try again.");
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [addingChild]);

  const fetchChildren = async () => {
    if (user?.id === "guest-user-123") {
      const guestChildren: Child[] = [
        { id: "c1", name: "Leo", date_of_birth: addDays(new Date(), -1250).toISOString(), gender: "male", notes: "Bright and active" },
        { id: "c2", name: "Mia", date_of_birth: addDays(new Date(), -700).toISOString(), gender: "female", notes: "Loves music" }
      ];
      const preferredGuestId = sessionStorage.getItem(SELECTED_CHILD_STORAGE_KEY);
      const preferredGuestChild = guestChildren.find((child) => child.id === preferredGuestId) ?? guestChildren[0];
      setChildren(guestChildren);
      setSelectedChild(preferredGuestChild);
      setLoading(false);
      return;
    }
    try {
      const result = await Promise.race([
        supabase.from("children").select("*").order("created_at", { ascending: false }),
        new Promise<{ data: null; error: Error }>((resolve) => {
          window.setTimeout(() => resolve({ data: null, error: new Error("Fetching profiles timed out.") }), 10000);
        }),
      ]);

      if (result.error) {
        toast.error(result.error.message);
        return;
      }

      if (result.data) {
        const loadedChildren = result.data as Child[];
        setChildren(loadedChildren);

        if (loadedChildren.length > 0) {
          const preferredChildId = sessionStorage.getItem(SELECTED_CHILD_STORAGE_KEY);
          const preferredChild = loadedChildren.find((child) => child.id === preferredChildId) ?? loadedChildren[0];
          setSelectedChild(preferredChild);
        } else {
          setSelectedChild(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessments = async (childId: string) => {
    const { data } = await supabase
      .from("assessment_history")
      .select("*")
      .eq("child_id", childId)
      .order("created_at", { ascending: false });
    if (data) setAssessments(data as Assessment[]);
  };

  const fetchReminders = async () => {
    if (user?.id === "guest-user-123") {
      setReminders([
        { id: "r1", child_id: "c1", title: "Speech Therapy", description: "Practice 's' sounds", reminder_date: addDays(new Date(), 1).toISOString(), is_completed: false, reminder_type: "therapy" },
        { id: "r2", child_id: "c1", title: "Milestone Check", description: "18-month checkup", reminder_date: addDays(new Date(), 5).toISOString(), is_completed: false, reminder_type: "milestone" }
      ]);
      return;
    }
    const { data } = await supabase.from("therapy_reminders").select("*").order("reminder_date");
    if (data) setReminders(data as Reminder[]);
  };

  const handleAddChild = async () => {
    // Fallback to DOM value in case controlled state didn't update (e.g. browser date picker)
    const dobValue = newChild.dob || (document.querySelector('input[type="date"]') as HTMLInputElement)?.value || "";
    if (!newChild.name || !dobValue) {
      toast.error("Please fill in name and date of birth");
      return;
    }

    setAddingChild(true);
    try {
      if (!user) {
        toast.error("Please sign in again before adding a child profile.");
        navigate("/login", { replace: true });
        return;
      }

      if (user.id === "guest-user-123") {
        const guestChild: Child = {
          id: `guest-${Date.now()}`,
          name: newChild.name.trim(),
          date_of_birth: dobValue,
          gender: newChild.gender,
          notes: newChild.notes,
        };
        setChildren((prev) => [guestChild, ...prev]);
        setSelectedChild(guestChild);
        setShowAddChild(false);
        setNewChild({ name: "", dob: "", gender: "unknown", notes: "" });
        toast.success(`${guestChild.name} added!`);
        return;
      }

      const payload: ChildInsert = {
        parent_id: user.id,
        name: newChild.name.trim(),
        date_of_birth: dobValue,
        gender: newChild.gender || "unknown",
        notes: newChild.notes.trim(),
      };

      const insertResult = await Promise.race([
        supabase.from("children").insert(payload),
        new Promise<{ data: null; error: Error }>((resolve) => {
          window.setTimeout(() => {
            resolve({ data: null, error: new Error("Create profile request timed out. Please retry.") });
          }, 10000);
        }),
      ]);

      if (insertResult.error) {
        const err = insertResult.error as any;
        const errorText = [
          err.message,
          err.code ? `(code: ${err.code})` : "",
          err.hint ? `Hint: ${err.hint}` : "",
        ]
          .filter(Boolean)
          .join(" ");

        const normalizedError = err.message.toLowerCase();

        if (normalizedError.includes("jwt") || normalizedError.includes("auth") || err.code === "PGRST301") {
          toast.error("Your session has expired. Please sign in again.");
          navigate("/login", { replace: true });
          return;
        }

        if (normalizedError.includes("row-level security")) {
          toast.error("You don't have permission to create this child profile. Please sign out and sign back in.");
        } else {
          toast.error(`Unable to add child profile: ${errorText}`);
        }
        return;
      }
      setShowAddChild(false);
      setNewChild({ name: "", dob: "", gender: "unknown", notes: "" });
      toast.success(`${payload.name} added!`);
      await fetchChildren();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to add child profile.");
    } finally {
      setAddingChild(false);
    }
  };

  const handleDeleteChild = async (id: string) => {
    const { error } = await supabase.from("children").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Child removed");
      fetchChildren();
      if (selectedChild?.id === id) setSelectedChild(null);
    }
  };

  const handleAddReminder = async () => {
    if (!newReminder.title || !newReminder.date || !selectedChild) {
      toast.error("Please fill in all fields and select a child");
      return;
    }
    const { error } = await supabase.from("therapy_reminders").insert({
      user_id: user!.id,
      child_id: selectedChild.id,
      title: newReminder.title,
      description: newReminder.description,
      reminder_date: new Date(newReminder.date).toISOString(),
      reminder_type: newReminder.type,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Reminder added!");
      setShowAddReminder(false);
      setNewReminder({ title: "", description: "", date: "", type: "milestone" });
      fetchReminders();
      requestNotificationPermission();
    }
  };

  const toggleReminder = async (id: string, completed: boolean) => {
    await supabase.from("therapy_reminders").update({ is_completed: completed }).eq("id", id);
    fetchReminders();
  };

  const deleteReminder = async (id: string) => {
    await supabase.from("therapy_reminders").delete().eq("id", id);
    fetchReminders();
  };

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const handleSignOut = async () => {
    setLoggingOut(true);
    const { error } = await signOut();
    setLoggingOut(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Logged out successfully.");
    navigate("/login", { replace: true });
  };

  const handleDashboardTabChange = (value: string) => {
    if (value === "video-screening") {
      navigate("/video-screening");
      return;
    }

    setActiveMainTab(value);
  };

  // Calculate child age
  const getChildAge = (dob: string) => {
    const months = differenceInMonths(new Date(), new Date(dob));
    if (months < 12) return `${months} months`;
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return remMonths > 0 ? `${years} yr ${remMonths} mo` : `${years} years`;
  };

  const getChildMonths = (dob: string) => differenceInMonths(new Date(), new Date(dob));

  // Mock milestone scores for demo (in real app, pull from assessment_history)
  const getMilestoneProgress = (childMonths: number) => {
    const speechProgress = Math.min(100, 50 + Math.random() * 40);
    const motorProgress = Math.min(100, 60 + Math.random() * 35);
    return { speech: Math.round(speechProgress), motor: Math.round(motorProgress) };
  };

  const childReminders = reminders.filter(r => r.child_id === selectedChild?.id);
  const upcomingReminders = childReminders.filter(r => !r.is_completed && !isPast(new Date(r.reminder_date)));
  const overdueReminders = childReminders.filter(r => !r.is_completed && isPast(new Date(r.reminder_date)) && !isToday(new Date(r.reminder_date)));

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" strokeWidth={3} />
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-newro flex flex-col items-center justify-center p-4">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/40">
           <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-cta flex items-center justify-center shadow-glow">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">Newro</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="rounded-full" disabled={loggingOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </header>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-panel p-10 rounded-[3rem] text-center shadow-xl border-white/40"
        >
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6">
            <Baby className="w-10 h-10" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Welcome to Newro</h2>
          <p className="text-muted-foreground mb-8">Start by adding your child's profile to track their development with AI.</p>
          <Dialog open={showAddChild} onOpenChange={setShowAddChild}>
            <DialogTrigger asChild>
              <Button size="lg" className="rounded-full px-10 h-14 font-bold shadow-glow text-lg">
                <Plus className="w-5 h-5 mr-2" /> Add Child Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] glass-panel-dark border-white/20 text-white rounded-[2rem] p-0 overflow-hidden">
               <div className="p-8">
                 <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-bold">Add Child Profile</DialogTitle>
                 </DialogHeader>
                 <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white/60">Child's Name</Label>
                      <Input id="name" placeholder="Enter name" className="bg-white/10 border-white/10 text-white h-12 rounded-xl" value={newChild.name} onChange={(e) => setNewChild({...newChild, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob" className="text-white/60">Date of Birth</Label>
                      <Input id="dob" type="date" className="bg-white/10 border-white/10 text-white h-12 rounded-xl" value={newChild.dob} onChange={(e) => setNewChild({...newChild, dob: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white/60">Gender</Label>
                        <Select value={newChild.gender} onValueChange={(v) => setNewChild({...newChild, gender: v})}>
                          <SelectTrigger className="bg-white/10 border-white/10 text-white h-12 rounded-xl">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent className="glass-panel text-foreground">
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="unknown">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleAddChild} className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold mt-4 shadow-glow" disabled={addingChild}>
                      {addingChild && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Create Profile
                    </Button>
                 </div>
               </div>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-newro flex flex-col font-sans">
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-ai-purple/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white/40 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-cta flex items-center justify-center shadow-glow">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">Newro</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white/40 text-sm">
              <User className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground">{profile?.full_name || user?.email}</span>
            </div>
            <Link to="/chat">
              <Button className="rounded-full shadow-glow h-10 bg-gradient-to-r from-[#6FE7DD] to-[#7AA7FF] text-foreground font-black">
                <MessageCircle className="w-4 h-4 mr-2" />
                Ask Newro AI
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleSignOut} className="hover:bg-rose-500/10 hover:text-rose-500 rounded-full transition-colors" disabled={loggingOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar — Children */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg">My Children</h2>
              <Dialog open={showAddChild} onOpenChange={setShowAddChild}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a Child</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        placeholder="Child's name"
                        value={newChild.name}
                        onChange={e => setNewChild({ ...newChild, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={newChild.dob}
                        onChange={e => setNewChild({ ...newChild, dob: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <Select value={newChild.gender} onValueChange={v => setNewChild({ ...newChild, gender: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="unknown">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Notes (optional)</Label>
                      <Textarea
                        placeholder="Any additional info..."
                        value={newChild.notes}
                        onChange={e => setNewChild({ ...newChild, notes: e.target.value })}
                      />
                    </div>
                    <Button className="w-full" onClick={handleAddChild} disabled={addingChild}>
                      {addingChild && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Add Child
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {children.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <Baby className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No children added yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {children.map(child => (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.02 }}
                      className="w-full"
                    >
                      <div
                        className={`cursor-pointer transition-all p-4 rounded-2xl border flex items-center justify-between group overflow-hidden relative ${
                          selectedChild?.id === child.id 
                            ? "border-primary bg-white/90 shadow-glow-ai ring-1 ring-primary/20" 
                            : "border-white/60 bg-white/40 hover:border-primary/40 hover:bg-white/60 backdrop-blur-sm"
                        }`}
                        onClick={() => setSelectedChild(child)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                            selectedChild?.id === child.id ? "bg-primary text-white" : "bg-primary/10 text-primary"
                          }`}>
                            <Baby className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-foreground">{child.name}</p>
                            <p className="text-xs text-muted-foreground font-black uppercase tracking-tight">{getChildAge(child.date_of_birth)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => { e.stopPropagation(); handleDeleteChild(child.id); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedChild ? (
              <Tabs value={activeMainTab} onValueChange={handleDashboardTabChange} className="space-y-6">
                <TabsList className="bg-muted">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="video-screening">Video Screening</TabsTrigger>
                  <TabsTrigger value="history">Assessment History</TabsTrigger>
                  <TabsTrigger value="reminders">Reminders</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <DashboardOverview 
                    child={selectedChild} 
                    parentName={profile?.full_name || user?.email} 
                    assessments={assessments}
                  />
                </TabsContent>

                {/* Milestones Tab */}
                <TabsContent value="milestones">
                  <Card>
                    <CardHeader>
                      <CardTitle>Developmental Milestones</CardTitle>
                      <CardDescription>Track {selectedChild.name}'s developmental progress</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link to="/milestones">
                        <Button className="shadow-glow">
                          Open Milestone Tracker
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="video-screening">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-primary" />
                        Video Screening
                      </CardTitle>
                      <CardDescription>
                        Upload and analyze screening clips for {selectedChild.name} with AI-assisted observations.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link to="/video-screening">
                        <Button className="shadow-glow">
                          Open Video Screening
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        You can review uploaded videos, run AI analysis, and track progress over time.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Assessment History Tab */}
                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-primary" />
                        Assessment History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assessments.length === 0 ? (
                        <div className="text-center py-8">
                          <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No assessments yet</p>
                          <Link to="/assessments">
                            <Button className="mt-4" variant="outline">Start First Assessment</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {assessments.map(a => (
                            <div key={a.id} className="p-4 rounded-lg border border-border bg-muted/30">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{a.title}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {format(new Date(a.created_at), "MMM d, yyyy")} • {a.assessment_type}
                                  </p>
                                </div>
                                <Badge variant="secondary">{a.assessment_type}</Badge>
                              </div>
                              {a.summary && <p className="text-sm text-muted-foreground mt-2">{a.summary}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Reminders Tab */}
                <TabsContent value="reminders">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="w-5 h-5 text-primary" />
                          Therapy Reminders
                        </CardTitle>
                        <CardDescription>Never miss an appointment or milestone check</CardDescription>
                      </div>
                      <Dialog open={showAddReminder} onOpenChange={setShowAddReminder}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <Plus className="w-4 h-4 mr-1" /> Add Reminder
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Reminder</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div>
                              <Label>Title</Label>
                              <Input
                                placeholder="e.g., Speech therapy session"
                                value={newReminder.title}
                                onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Type</Label>
                              <Select value={newReminder.type} onValueChange={v => setNewReminder({ ...newReminder, type: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="milestone">Milestone Check</SelectItem>
                                  <SelectItem value="therapy">Therapy Session</SelectItem>
                                  <SelectItem value="appointment">Doctor Appointment</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Date & Time</Label>
                              <Input
                                type="datetime-local"
                                value={newReminder.date}
                                onChange={e => setNewReminder({ ...newReminder, date: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Description (optional)</Label>
                              <Textarea
                                placeholder="Additional details..."
                                value={newReminder.description}
                                onChange={e => setNewReminder({ ...newReminder, description: e.target.value })}
                              />
                            </div>
                            <Button className="w-full" onClick={handleAddReminder}>Add Reminder</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardHeader>
                    <CardContent>
                      {childReminders.length === 0 ? (
                        <div className="text-center py-8">
                          <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                          <p className="text-muted-foreground">No reminders set</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <AnimatePresence>
                            {childReminders.map(r => (
                              <motion.div
                                key={r.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className={`p-4 rounded-lg border flex items-start justify-between ${
                                  r.is_completed
                                    ? "bg-muted/30 border-border"
                                    : isPast(new Date(r.reminder_date)) && !isToday(new Date(r.reminder_date))
                                    ? "bg-destructive/10 border-destructive/30"
                                    : "bg-card border-border"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <button
                                    onClick={() => toggleReminder(r.id, !r.is_completed)}
                                    className={`mt-0.5 ${r.is_completed ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
                                  >
                                    {r.is_completed ? (
                                      <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-current" />
                                    )}
                                  </button>
                                  <div>
                                    <p className={`font-medium ${r.is_completed ? "line-through text-muted-foreground" : ""}`}>
                                      {r.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">{r.reminder_type}</Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {format(new Date(r.reminder_date), "MMM d, yyyy h:mm a")}
                                      </span>
                                    </div>
                                    {r.description && (
                                      <p className="text-sm text-muted-foreground mt-1">{r.description}</p>
                                    )}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => deleteReminder(r.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <Baby className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-xl font-semibold mb-2">No Child Selected</h3>
                  <p className="text-muted-foreground mb-4">Add a child profile to get started</p>
                  <Button onClick={() => setShowAddChild(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add Your First Child
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParentDashboard;
