import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  Trash2, Edit, ChevronRight, User, LogOut, Loader2, CheckCircle2, AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, differenceInMonths, isPast, isToday, addDays } from "date-fns";
import { calculateAchievement, getMilestonesForAge } from "@/data/milestones";

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

const ParentDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddChild, setShowAddChild] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newChild, setNewChild] = useState({ name: "", dob: "", gender: "unknown", notes: "" });
  const [newReminder, setNewReminder] = useState({ title: "", description: "", date: "", type: "milestone" });

  // Fetch data
  useEffect(() => {
    if (user) {
      fetchChildren();
      fetchReminders();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChild) fetchAssessments(selectedChild.id);
  }, [selectedChild]);

  const fetchChildren = async () => {
    const { data } = await supabase.from("children").select("*").order("created_at", { ascending: false });
    if (data) {
      setChildren(data as Child[]);
      if (data.length > 0 && !selectedChild) setSelectedChild(data[0] as Child);
    }
    setLoading(false);
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
    const { data } = await supabase.from("therapy_reminders").select("*").order("reminder_date");
    if (data) setReminders(data as Reminder[]);
  };

  const dobInputRef = (window as unknown as { __dobInput?: HTMLInputElement }).__dobInput;

  const handleAddChild = async () => {
    // Fallback to DOM value in case controlled state didn't update (e.g. browser date picker)
    const dobValue = newChild.dob || (document.querySelector('input[type="date"]') as HTMLInputElement)?.value || "";
    if (!newChild.name || !dobValue) {
      toast.error("Please fill in name and date of birth");
      return;
    }
    const { error, data } = await supabase.from("children").insert({
      parent_id: user!.id,
      name: newChild.name,
      date_of_birth: dobValue,
      gender: newChild.gender,
      notes: newChild.notes,
    }).select().single();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`${newChild.name} added!`);
      setShowAddChild(false);
      setNewChild({ name: "", dob: "", gender: "unknown", notes: "" });
      fetchChildren();
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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-cta flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-xl">Newro</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{profile?.full_name || user?.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
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
                    <Button className="w-full" onClick={handleAddChild}>Add Child</Button>
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
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all ${
                        selectedChild?.id === child.id ? "border-primary bg-secondary/50" : "hover:border-primary/30"
                      }`}
                      onClick={() => setSelectedChild(child)}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Baby className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{child.name}</p>
                            <p className="text-xs text-muted-foreground">{getChildAge(child.date_of_birth)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); handleDeleteChild(child.id); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedChild ? (
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-muted">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="history">Assessment History</TabsTrigger>
                  <TabsTrigger value="reminders">Reminders</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Child Info Card */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Child Profile</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-cta flex items-center justify-center">
                            <Baby className="w-7 h-7 text-primary-foreground" />
                          </div>
                          <div>
                            <p className="font-display font-semibold text-lg">{selectedChild.name}</p>
                            <p className="text-sm text-muted-foreground">{getChildAge(selectedChild.date_of_birth)}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">{getChildMonths(selectedChild.date_of_birth)} months</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Assessments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="font-display text-3xl font-bold text-primary">{assessments.length}</p>
                        <p className="text-sm text-muted-foreground">completed assessments</p>
                        <Link to="/assessments">
                          <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                            Start new assessment <ChevronRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>

                    {/* Reminders Card */}
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">Reminders</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-display text-3xl font-bold">{upcomingReminders.length}</p>
                            <p className="text-sm text-muted-foreground">upcoming</p>
                          </div>
                          {overdueReminders.length > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {overdueReminders.length} overdue
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Milestone Progress Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Milestone Progress
                      </CardTitle>
                      <CardDescription>Developmental milestones for {selectedChild.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {(() => {
                        const progress = getMilestoneProgress(getChildMonths(selectedChild.date_of_birth));
                        return (
                          <>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">Speech & Language</span>
                                <span className="text-primary font-semibold">{progress.speech}%</span>
                              </div>
                              <Progress value={progress.speech} className="h-3" />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">Motor Skills</span>
                                <span className="text-primary font-semibold">{progress.motor}%</span>
                              </div>
                              <Progress value={progress.motor} className="h-3" />
                            </div>
                          </>
                        );
                      })()}
                      <Link to="/milestones">
                        <Button className="w-full mt-4" variant="outline">
                          Open Full Milestone Tracker
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
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
