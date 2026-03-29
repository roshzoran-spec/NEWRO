import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Video, Upload, CheckCircle2, ArrowLeft, ArrowRight, Loader2,
  Trash2, Eye, Baby, Hand, Ear, MessageCircle as ChatIcon, Play
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, differenceInMonths } from "date-fns";

interface Child {
  id: string;
  name: string;
  date_of_birth: string;
}

const SCREENING_TASKS = [
  {
    id: "name_response",
    title: "Name Response",
    icon: Ear,
    color: "bg-primary/10 text-primary",
    duration: "30 seconds",
    instruction: "Stand behind or beside your child and call their name clearly 3 times, with 5-second pauses between each call.",
    what_to_capture: "Does the child turn, look, or respond? How quickly?",
    clinical_marker: "Response to name is one of the earliest social communication markers.",
  },
  {
    id: "free_play",
    title: "Free Play",
    icon: Baby,
    color: "bg-accent/10 text-accent",
    duration: "60 seconds",
    instruction: "Let your child play freely with 2–3 toys. Do not interact or direct them — just observe.",
    what_to_capture: "Play patterns, repetitive behaviors, toy exploration style.",
    clinical_marker: "Functional vs repetitive play is a key developmental indicator.",
  },
  {
    id: "joint_attention",
    title: "Joint Attention (Pointing)",
    icon: Hand,
    color: "bg-lavender-foreground/10 text-lavender-foreground",
    duration: "30 seconds",
    instruction: "Point to an interesting object across the room and say 'Look!' — observe if your child follows your point.",
    what_to_capture: "Does the child follow your gaze/point? Do they look back at you?",
    clinical_marker: "Joint attention is a core social cognition skill assessed in M-CHAT.",
  },
  {
    id: "parent_interaction",
    title: "Parent-Child Interaction",
    icon: ChatIcon,
    color: "bg-mint-foreground/10 text-mint-foreground",
    duration: "60 seconds",
    instruction: "Sit face-to-face with your child. Talk, sing, or play a simple game like peek-a-boo.",
    what_to_capture: "Eye contact, social smiling, imitation, engagement level.",
    clinical_marker: "Social reciprocity and emotional engagement are key ASD indicators.",
  },
  {
    id: "imitation",
    title: "Imitation Task",
    icon: Play,
    color: "bg-warm-foreground/10 text-warm-foreground",
    duration: "30 seconds",
    instruction: "Perform a simple action (clap hands, wave, touch nose) and encourage your child to copy you.",
    what_to_capture: "Does the child attempt to imitate? How accurately?",
    clinical_marker: "Motor imitation is linked to social learning and language development.",
  },
];

const VideoScreening = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [uploadedVideos, setUploadedVideos] = useState<Record<string, { file?: File; uploaded?: boolean; notes?: string; id?: string }>>({});
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchChildren();
  }, [user]);

  useEffect(() => {
    if (selectedChild) fetchExistingVideos();
  }, [selectedChild]);

  const fetchChildren = async () => {
    const { data } = await supabase
      .from("children")
      .select("id, name, date_of_birth")
      .eq("parent_id", user!.id);
    if (data) {
      setChildren(data);
      if (data.length === 1) setSelectedChild(data[0].id);
    }
    setLoading(false);
  };

  const fetchExistingVideos = async () => {
    const { data } = await supabase
      .from("screening_videos")
      .select("*")
      .eq("child_id", selectedChild)
      .eq("user_id", user!.id);
    if (data) {
      const map: Record<string, { uploaded: boolean; notes: string; id: string }> = {};
      data.forEach((v: any) => {
        map[v.task_type] = { uploaded: true, notes: v.notes || "", id: v.id };
      });
      setUploadedVideos(prev => ({ ...prev, ...map }));
    }
  };

  const currentTask = SCREENING_TASKS[currentTaskIndex];
  const completedCount = SCREENING_TASKS.filter(t => uploadedVideos[t.id]?.uploaded).length;
  const progressPercent = (completedCount / SCREENING_TASKS.length) * 100;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video must be under 100MB");
      return;
    }
    setUploadedVideos(prev => ({
      ...prev,
      [currentTask.id]: { ...prev[currentTask.id], file },
    }));
  };

  const handleUpload = async () => {
    const entry = uploadedVideos[currentTask.id];
    if (!entry?.file || !selectedChild) return;

    setUploading(true);
    try {
      const ext = entry.file.name.split(".").pop();
      const filePath = `${user!.id}/${selectedChild}/${currentTask.id}_${Date.now()}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("screening-videos")
        .upload(filePath, entry.file);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase.from("screening_videos").insert({
        child_id: selectedChild,
        user_id: user!.id,
        task_type: currentTask.id,
        file_path: filePath,
        file_size: entry.file.size,
        notes: entry.notes || "",
      });

      if (dbError) throw dbError;

      setUploadedVideos(prev => ({
        ...prev,
        [currentTask.id]: { ...prev[currentTask.id], uploaded: true, file: undefined },
      }));

      toast.success(`"${currentTask.title}" video uploaded!`);

      // Auto-advance to next incomplete task
      if (currentTaskIndex < SCREENING_TASKS.length - 1) {
        setTimeout(() => setCurrentTaskIndex(i => i + 1), 400);
      }
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVideo = async (taskId: string) => {
    const entry = uploadedVideos[taskId];
    if (!entry?.id) return;

    const { error } = await supabase.from("screening_videos").delete().eq("id", entry.id);
    if (!error) {
      setUploadedVideos(prev => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
      toast.success("Video removed");
    }
  };

  const child = children.find(c => c.id === selectedChild);
  const childAge = child ? differenceInMonths(new Date(), new Date(child.date_of_birth)) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold font-display text-foreground">Video Screening</h1>
            <p className="text-xs text-muted-foreground">Upload structured behavior videos</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {completedCount}/{SCREENING_TASKS.length} tasks
          </Badge>
        </div>
        <div className="max-w-3xl mx-auto px-4 pb-2">
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Child Selector */}
        {children.length > 1 && (
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger>
              <SelectValue placeholder="Select child" />
            </SelectTrigger>
            <SelectContent>
              {children.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} ({differenceInMonths(new Date(), new Date(c.date_of_birth))} months)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {!selectedChild && children.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Baby className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Add a child profile first from the dashboard.</p>
              <Button className="mt-4" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
            </CardContent>
          </Card>
        )}

        {selectedChild && (
          <>
            {/* Task Navigation Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {SCREENING_TASKS.map((task, i) => {
                const done = uploadedVideos[task.id]?.uploaded;
                return (
                  <button
                    key={task.id}
                    onClick={() => setCurrentTaskIndex(i)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                      i === currentTaskIndex
                        ? "bg-primary text-primary-foreground border-primary"
                        : done
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-card text-muted-foreground border-border"
                    }`}
                  >
                    {done && <CheckCircle2 className="w-3 h-3" />}
                    {task.title}
                  </button>
                );
              })}
            </div>

            {/* Current Task Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTask.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-2 border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentTask.color}`}>
                        <currentTask.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{currentTask.title}</CardTitle>
                        <CardDescription className="text-xs">⏱ {currentTask.duration}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Instructions */}
                    <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
                      <p className="text-sm font-semibold text-foreground">📋 Instructions</p>
                      <p className="text-sm text-muted-foreground">{currentTask.instruction}</p>
                    </div>

                    <div className="bg-mint/50 rounded-xl p-4 space-y-2">
                      <p className="text-sm font-semibold text-foreground">👁 What to Capture</p>
                      <p className="text-sm text-muted-foreground">{currentTask.what_to_capture}</p>
                    </div>

                    <div className="bg-lavender/50 rounded-xl p-3">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">Clinical note:</span> {currentTask.clinical_marker}
                      </p>
                    </div>

                    {/* Upload Area */}
                    {uploadedVideos[currentTask.id]?.uploaded ? (
                      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Video uploaded</p>
                            <p className="text-xs text-muted-foreground">Ready for review</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteVideo(currentTask.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {uploadedVideos[currentTask.id]?.file ? (
                          <div className="bg-secondary/30 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4 text-primary" />
                              <p className="text-sm text-foreground truncate">
                                {uploadedVideos[currentTask.id].file!.name}
                              </p>
                            </div>
                            <Textarea
                              placeholder="Optional: Add notes about what you observed..."
                              className="text-sm"
                              value={uploadedVideos[currentTask.id]?.notes || ""}
                              onChange={(e) =>
                                setUploadedVideos(prev => ({
                                  ...prev,
                                  [currentTask.id]: { ...prev[currentTask.id], notes: e.target.value },
                                }))
                              }
                            />
                            <Button
                              className="w-full"
                              onClick={handleUpload}
                              disabled={uploading}
                            >
                              {uploading ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Upload Video
                                </>
                              )}
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                          >
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                              <Video className="w-7 h-7 text-primary" />
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-medium text-foreground">Tap to select video</p>
                              <p className="text-xs text-muted-foreground mt-1">MP4, MOV, WebM • Max 100MB</p>
                            </div>
                          </button>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentTaskIndex === 0}
                        onClick={() => setCurrentTaskIndex(i => i - 1)}
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentTaskIndex === SCREENING_TASKS.length - 1}
                        onClick={() => setCurrentTaskIndex(i => i + 1)}
                      >
                        Next <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Completion Summary */}
            {completedCount === SCREENING_TASKS.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="py-6 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                    <h3 className="text-lg font-bold font-display text-foreground">All Videos Uploaded!</h3>
                    <p className="text-sm text-muted-foreground">
                      Your screening videos have been submitted. A clinician will review them and provide feedback.
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      ⚠️ This is a screening tool — not a diagnosis. Always consult a qualified professional.
                    </p>
                    <Button onClick={() => navigate("/dashboard")} className="mt-2">
                      Return to Dashboard
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-center text-muted-foreground px-4">
              Videos are stored securely and only accessible to you and your assigned clinician.
              This tool supports early screening — it does not replace professional evaluation.
            </p>
          </>
        )}
      </main>
    </div>
  );
};

export default VideoScreening;
