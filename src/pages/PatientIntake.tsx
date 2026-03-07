import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, User, Stethoscope, Baby, MessageSquare,
  Check, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format, differenceInMonths } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  birthTypeOptions,
  birthComplicationOptions,
  feedingOptions,
  medicalConditionOptions,
  familyHistoryOptions,
  previousTherapyOptions,
  milestoneAgeOptions,
  chiefComplaintSuggestions,
} from "@/data/intake";

const steps = [
  { id: "profile", label: "Child Profile", icon: User },
  { id: "medical", label: "Medical History", icon: Stethoscope },
  { id: "developmental", label: "Development", icon: Baby },
  { id: "complaint", label: "Chief Complaint", icon: MessageSquare },
];

const PatientIntake = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [dob, setDob] = useState<Date>();

  // Child Profile
  const [profile, setProfile] = useState({
    firstName: "", lastName: "", gender: "", parentName: "",
    parentRelation: "", parentPhone: "", parentEmail: "", referredBy: "",
  });

  // Medical History
  const [medical, setMedical] = useState({
    birthType: "", gestationalAge: "", birthWeight: "", nicuStay: "",
    nicuDuration: "", feedingHistory: "", medications: "", allergies: "",
    hearingScreening: "", visionScreening: "",
  });
  const [birthComplications, setBirthComplications] = useState<string[]>([]);
  const [currentFeeding, setCurrentFeeding] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [familyHistory, setFamilyHistory] = useState<string[]>([]);

  // Developmental History
  const [developmental, setDevelopmental] = useState({
    headHolding: "", sitting: "", crawling: "", walking: "",
    firstWords: "", twoWordPhrases: "", currentSpeech: "",
    socialSmile: "", eyeContact: "", respondsToName: "",
    pointsToShow: "", pretendPlay: "", schoolStatus: "", schoolConcerns: "",
    previousDiagnosis: "",
  });
  const [previousTherapy, setPreviousTherapy] = useState<string[]>([]);

  // Chief Complaint
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const childAge = dob
    ? (() => {
        const months = differenceInMonths(new Date(), dob);
        const years = Math.floor(months / 12);
        const rem = months % 12;
        return years > 0 ? `${years}y ${rem}m` : `${rem}m`;
      })()
    : null;

  const toggleCheckbox = (
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (value === "None") {
      setter(list.includes("None") ? [] : ["None"]);
    } else {
      setter(prev => prev.filter(v => v !== "None").includes(value)
        ? prev.filter(v => v !== value)
        : [...prev.filter(v => v !== "None"), value]
      );
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
  };
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  const handleSubmit = () => {
    const fullData = {
      profile: { ...profile, dateOfBirth: dob?.toISOString(), age: childAge },
      medical: { ...medical, birthComplications, currentFeeding, medicalConditions, familyHistory },
      developmental: { ...developmental, previousTherapy },
      chiefComplaint: chiefComplaint || selectedSuggestions.join("; "),
    };
    // Store locally for now
    const existing = JSON.parse(localStorage.getItem("newro_patients") || "[]");
    const id = crypto.randomUUID();
    existing.push({ id, ...fullData, createdAt: new Date().toISOString() });
    localStorage.setItem("newro_patients", JSON.stringify(existing));

    toast({ title: "Patient record created", description: `${profile.firstName} ${profile.lastName} has been registered successfully.` });
    navigate("/assessments");
  };

  const fieldClass = "bg-background border-input";

  return (
    <div className="min-h-screen bg-gradient-hero">
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-30">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="font-display font-bold text-lg text-foreground">Patient Intake</h1>
          {childAge && (
            <span className="ml-auto text-sm font-medium text-primary bg-secondary px-3 py-1 rounded-full">
              Age: {childAge}
            </span>
          )}
        </div>
      </header>

      {/* Step indicator */}
      <div className="container mx-auto px-4 pt-6">
        <div className="max-w-3xl mx-auto">
          <Progress value={progress} className="h-2 mb-6" />
          <div className="flex justify-between mb-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === currentStep;
              const isDone = i < currentStep;
              return (
                <button
                  key={step.id}
                  onClick={() => i <= currentStep && setCurrentStep(i)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 transition-all text-xs sm:text-sm",
                    isActive ? "text-primary font-semibold" : isDone ? "text-primary/70" : "text-muted-foreground"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isActive ? "border-primary bg-primary text-primary-foreground" :
                    isDone ? "border-primary bg-primary/10 text-primary" :
                    "border-muted-foreground/30 text-muted-foreground"
                  )}>
                    {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="hidden sm:block">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form content */}
      <div className="container mx-auto px-4 pb-32">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              {/* Step 0: Child Profile */}
              {currentStep === 0 && (
                <Card className="border-2">
                  <CardContent className="p-6 sm:p-8 space-y-6">
                    <h2 className="font-display text-xl font-bold text-foreground">Child Information</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name *</Label>
                        <Input className={fieldClass} value={profile.firstName} onChange={e => setProfile(p => ({...p, firstName: e.target.value}))} placeholder="Child's first name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name *</Label>
                        <Input className={fieldClass} value={profile.lastName} onChange={e => setProfile(p => ({...p, lastName: e.target.value}))} placeholder="Child's last name" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date of Birth *</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dob && "text-muted-foreground")}>
                              {dob ? format(dob, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dob}
                              onSelect={setDob}
                              disabled={d => d > new Date()}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        {childAge && <p className="text-xs text-primary font-medium">Calculated age: {childAge}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Gender *</Label>
                        <Select value={profile.gender} onValueChange={v => setProfile(p => ({...p, gender: v}))}>
                          <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-display font-semibold text-foreground mb-4">Parent / Guardian Details</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Parent / Guardian Name *</Label>
                          <Input className={fieldClass} value={profile.parentName} onChange={e => setProfile(p => ({...p, parentName: e.target.value}))} placeholder="Full name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Relation</Label>
                          <Select value={profile.parentRelation} onValueChange={v => setProfile(p => ({...p, parentRelation: v}))}>
                            <SelectTrigger><SelectValue placeholder="Select relation" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mother">Mother</SelectItem>
                              <SelectItem value="father">Father</SelectItem>
                              <SelectItem value="guardian">Guardian</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input className={fieldClass} type="tel" value={profile.parentPhone} onChange={e => setProfile(p => ({...p, parentPhone: e.target.value}))} placeholder="+91 XXXXX XXXXX" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input className={fieldClass} type="email" value={profile.parentEmail} onChange={e => setProfile(p => ({...p, parentEmail: e.target.value}))} placeholder="email@example.com" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Referred By</Label>
                      <Input className={fieldClass} value={profile.referredBy} onChange={e => setProfile(p => ({...p, referredBy: e.target.value}))} placeholder="Doctor / Hospital / Self" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 1: Medical History */}
              {currentStep === 1 && (
                <Card className="border-2">
                  <CardContent className="p-6 sm:p-8 space-y-6">
                    <h2 className="font-display text-xl font-bold text-foreground">Medical & Birth History</h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type of Delivery</Label>
                        <Select value={medical.birthType} onValueChange={v => setMedical(m => ({...m, birthType: v}))}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {birthTypeOptions.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Gestational Age</Label>
                        <Select value={medical.gestationalAge} onValueChange={v => setMedical(m => ({...m, gestationalAge: v}))}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full-term">Full term (37+ weeks)</SelectItem>
                            <SelectItem value="preterm">Preterm (&lt;37 weeks)</SelectItem>
                            <SelectItem value="very-preterm">Very preterm (&lt;32 weeks)</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Birth Weight</Label>
                        <Input className={fieldClass} value={medical.birthWeight} onChange={e => setMedical(m => ({...m, birthWeight: e.target.value}))} placeholder="e.g. 2.8 kg" />
                      </div>
                      <div className="space-y-2">
                        <Label>NICU Stay</Label>
                        <Select value={medical.nicuStay} onValueChange={v => setMedical(m => ({...m, nicuStay: v}))}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {medical.nicuStay === "yes" && (
                      <div className="space-y-2">
                        <Label>NICU Duration</Label>
                        <Input className={fieldClass} value={medical.nicuDuration} onChange={e => setMedical(m => ({...m, nicuDuration: e.target.value}))} placeholder="e.g. 10 days" />
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label>Birth Complications</Label>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {birthComplicationOptions.map(o => (
                          <label key={o} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                            <Checkbox
                              checked={birthComplications.includes(o)}
                              onCheckedChange={() => toggleCheckbox(birthComplications, setBirthComplications, o)}
                            />
                            {o}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-6 space-y-4">
                      <h3 className="font-display font-semibold text-foreground">Feeding & Nutrition</h3>
                      <div className="space-y-2">
                        <Label>Early Feeding</Label>
                        <Select value={medical.feedingHistory} onValueChange={v => setMedical(m => ({...m, feedingHistory: v}))}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="breastfed">Breastfed</SelectItem>
                            <SelectItem value="bottle">Bottle-fed</SelectItem>
                            <SelectItem value="combination">Combination</SelectItem>
                            <SelectItem value="tube">Tube-fed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label>Current Feeding Concerns</Label>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {feedingOptions.map(o => (
                            <label key={o} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                              <Checkbox checked={currentFeeding.includes(o)} onCheckedChange={() => toggleCheckbox(currentFeeding, setCurrentFeeding, o)} />
                              {o}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6 space-y-4">
                      <h3 className="font-display font-semibold text-foreground">Medical Conditions</h3>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {medicalConditionOptions.map(o => (
                          <label key={o} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                            <Checkbox checked={medicalConditions.includes(o)} onCheckedChange={() => toggleCheckbox(medicalConditions, setMedicalConditions, o)} />
                            {o}
                          </label>
                        ))}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Current Medications</Label>
                          <Input className={fieldClass} value={medical.medications} onChange={e => setMedical(m => ({...m, medications: e.target.value}))} placeholder="None or list" />
                        </div>
                        <div className="space-y-2">
                          <Label>Allergies</Label>
                          <Input className={fieldClass} value={medical.allergies} onChange={e => setMedical(m => ({...m, allergies: e.target.value}))} placeholder="None or list" />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6">
                      <h3 className="font-display font-semibold text-foreground mb-4">Screening Results</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Hearing Screening</Label>
                          <Select value={medical.hearingScreening} onValueChange={v => setMedical(m => ({...m, hearingScreening: v}))}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pass">Pass</SelectItem>
                              <SelectItem value="refer">Refer</SelectItem>
                              <SelectItem value="not-done">Not done</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Vision Screening</Label>
                          <Select value={medical.visionScreening} onValueChange={v => setMedical(m => ({...m, visionScreening: v}))}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="abnormal">Abnormal</SelectItem>
                              <SelectItem value="not-done">Not done</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Family History of Developmental Conditions</Label>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {familyHistoryOptions.map(o => (
                          <label key={o} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                            <Checkbox checked={familyHistory.includes(o)} onCheckedChange={() => toggleCheckbox(familyHistory, setFamilyHistory, o)} />
                            {o}
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Developmental History */}
              {currentStep === 2 && (
                <Card className="border-2">
                  <CardContent className="p-6 sm:p-8 space-y-6">
                    <h2 className="font-display text-xl font-bold text-foreground">Developmental Milestones</h2>
                    <p className="text-sm text-muted-foreground">At what age did your child achieve these milestones?</p>

                    <div className="space-y-4">
                      <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" /> Motor Milestones
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { key: "headHolding", label: "Head holding" },
                          { key: "sitting", label: "Sitting without support" },
                          { key: "crawling", label: "Crawling" },
                          { key: "walking", label: "Walking independently" },
                        ].map(m => (
                          <div key={m.key} className="space-y-2">
                            <Label>{m.label}</Label>
                            <Select value={(developmental as any)[m.key]} onValueChange={v => setDevelopmental(d => ({...d, [m.key]: v}))}>
                              <SelectTrigger><SelectValue placeholder="Select age" /></SelectTrigger>
                              <SelectContent>
                                {milestoneAgeOptions.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-6 space-y-4">
                      <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent" /> Speech & Language
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { key: "firstWords", label: "First meaningful words" },
                          { key: "twoWordPhrases", label: "Two-word phrases" },
                        ].map(m => (
                          <div key={m.key} className="space-y-2">
                            <Label>{m.label}</Label>
                            <Select value={(developmental as any)[m.key]} onValueChange={v => setDevelopmental(d => ({...d, [m.key]: v}))}>
                              <SelectTrigger><SelectValue placeholder="Select age" /></SelectTrigger>
                              <SelectContent>
                                {milestoneAgeOptions.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <Label>Current Speech Level</Label>
                        <Select value={developmental.currentSpeech} onValueChange={v => setDevelopmental(d => ({...d, currentSpeech: v}))}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-words">No words</SelectItem>
                            <SelectItem value="few-words">Few single words (&lt;10)</SelectItem>
                            <SelectItem value="single-words">Single words (10-50)</SelectItem>
                            <SelectItem value="two-word">Two-word combinations</SelectItem>
                            <SelectItem value="sentences">Short sentences</SelectItem>
                            <SelectItem value="age-appropriate">Age-appropriate speech</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="border-t border-border pt-6 space-y-4">
                      <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[hsl(var(--lavender-foreground))]" /> Social & Behavioral
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { key: "socialSmile", label: "Social smile" },
                          { key: "eyeContact", label: "Eye contact" },
                          { key: "respondsToName", label: "Responds to name" },
                          { key: "pointsToShow", label: "Points to show interest" },
                          { key: "pretendPlay", label: "Pretend / Symbolic play" },
                        ].map(m => (
                          <div key={m.key} className="space-y-2">
                            <Label>{m.label}</Label>
                            <Select value={(developmental as any)[m.key]} onValueChange={v => setDevelopmental(d => ({...d, [m.key]: v}))}>
                              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="consistent">Consistent</SelectItem>
                                <SelectItem value="inconsistent">Inconsistent</SelectItem>
                                <SelectItem value="absent">Absent / Not observed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-6 space-y-4">
                      <h3 className="font-display font-semibold text-foreground">Education & Therapy</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>School Status</Label>
                          <Select value={developmental.schoolStatus} onValueChange={v => setDevelopmental(d => ({...d, schoolStatus: v}))}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not-enrolled">Not enrolled</SelectItem>
                              <SelectItem value="playschool">Playschool / Daycare</SelectItem>
                              <SelectItem value="preschool">Preschool</SelectItem>
                              <SelectItem value="school">School</SelectItem>
                              <SelectItem value="special-school">Special school</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Previous Diagnosis</Label>
                          <Input className={fieldClass} value={developmental.previousDiagnosis} onChange={e => setDevelopmental(d => ({...d, previousDiagnosis: e.target.value}))} placeholder="None or describe" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>School Concerns</Label>
                        <Textarea className={fieldClass} value={developmental.schoolConcerns} onChange={e => setDevelopmental(d => ({...d, schoolConcerns: e.target.value}))} placeholder="Any concerns raised by school" rows={2} />
                      </div>
                      <div className="space-y-3">
                        <Label>Previous Therapies Received</Label>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {previousTherapyOptions.map(o => (
                            <label key={o} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                              <Checkbox checked={previousTherapy.includes(o)} onCheckedChange={() => toggleCheckbox(previousTherapy, setPreviousTherapy, o)} />
                              {o}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Chief Complaint */}
              {currentStep === 3 && (
                <Card className="border-2">
                  <CardContent className="p-6 sm:p-8 space-y-6">
                    <h2 className="font-display text-xl font-bold text-foreground">Chief Complaint</h2>
                    <p className="text-sm text-muted-foreground">
                      What is the primary reason for this evaluation? Select common concerns or describe in your own words.
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {chiefComplaintSuggestions.map(s => (
                        <button
                          key={s}
                          onClick={() => setSelectedSuggestions(prev =>
                            prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
                          )}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-sm border transition-all",
                            selectedSuggestions.includes(s)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-foreground border-border hover:border-primary/50"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Additional Details</Label>
                      <Textarea
                        className={fieldClass}
                        value={chiefComplaint}
                        onChange={e => setChiefComplaint(e.target.value)}
                        placeholder="Describe the child's main concerns, when they were first noticed, and any other relevant information..."
                        rows={5}
                      />
                    </div>

                    {/* Summary preview */}
                    {(selectedSuggestions.length > 0 || chiefComplaint) && (
                      <div className="rounded-xl bg-secondary/50 border border-border p-4">
                        <h4 className="font-display font-semibold text-sm text-foreground mb-2">Complaint Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          {[...selectedSuggestions, chiefComplaint].filter(Boolean).join(". ")}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-border p-4 z-30">
        <div className="container mx-auto flex justify-between max-w-3xl">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-gradient-cta text-primary-foreground shadow-glow">
              Submit Intake <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientIntake;
