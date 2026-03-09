import { Eye } from "lucide-react";
import ClinicalExamForm from "@/components/ClinicalExamForm";
import { behavioralParameters } from "@/data/clinical-exams";

const BehavioralObservation = () => (
  <ClinicalExamForm
    title="Behavioral Observation"
    icon={<Eye className="w-5 h-5 text-primary" />}
    examType="behavioral"
    parameters={behavioralParameters}
    backPath="/assessments"
  />
);

export default BehavioralObservation;
