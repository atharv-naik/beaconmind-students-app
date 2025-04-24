import React from "react";
import { SafeAreaView } from "react-native";
import AssessmentComponent from "@/components/AssessmentComponent";
import {
  allAssessments,
  asqAssessment,
  whoAssistAssessment,
  dass21Assessment,
} from "@/assessmentstore/assessments";

export default function Assessment() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AssessmentComponent
        // assessmentId={assessmentId}
        // name="DASS-21 assessment"
        // description="A short self-report questionnaire designed to assess your levels of depression, anxiety, and stress over the past week."
        // questions={dass21Questions}
        // // onSubmitEndpoint={onSubmitEndpoint}

        assessments={allAssessments}
        idx={0}
      />
    </SafeAreaView>
  );
}
