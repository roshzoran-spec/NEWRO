import { Stethoscope } from "lucide-react";
import ClinicalExamForm from "@/components/ClinicalExamForm";
import { oroMotorParameters, cranialNerveParameters } from "@/data/clinical-exams";

// Combine oro-motor and cranial nerve into one comprehensive exam
const allParameters = [...oroMotorParameters, ...cranialNerveParameters];

const OroMotorExam = () => (
  <ClinicalExamForm
    title="Oro-Motor & Cranial Nerve Exam"
    icon={<Stethoscope className="w-5 h-5 text-accent" />}
    examType="oro-motor"
    parameters={allParameters}
    backPath="/assessments"
  />
);

export default OroMotorExam;
