import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { ApiContext } from "@/context/ApiContext";
import Loader from "@/components/Loader";
import { MaterialIcons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";

interface Question {
  id: string;
  qid: string;
  text: string;
  type: string;
  tag?: string;
  optional?: boolean;
  noscore?: boolean;
  next?: string | null;
  options?: Array<{
    id: string;
    value: string;
    score?: number;
    label: string;
    icon?: string;
    next?: string | null;
  }>;
  getNextRoute?: (ids: string[]) => string | null;
}

interface Assessment {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

const AssessmentComponent = ({
  assessments,
  idx,
}: {
  assessments: Array<Assessment>;
  idx: number;
}) => {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("Login must be used within an ApiProvider");
  }

  const { baseUrl, token, loading, setLoading } = apiContext;
  const onSubmitEndpoint = `${baseUrl}assessments/api/submit/`;

  const [index, setIndex] = useState(idx);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [name, setAssessmentName] = useState<string | null>(null);
  const [description, setAssessmentDescription] = useState<string | null>(null);
  const [questions, setAssessmentQuestions] = useState<Question[]>([]);

  const [currentQuestionId, setCurrentQuestionId] = useState<string>("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [questionsStack, setQuestionsStack] = useState<string[]>([]);

  const [nextAssessmentPopup, setNextAssessmentPopup] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // update progress
    // find visited questions length (responses length)
    // find known questions length i.e. total length estimated
    // this is visited length + explored length
    // find explored length by looping from current question's next (or 1st option's next) until next is null; count this length as explored
    // set progress = visited / known

    const visited = Object.keys(responses).length;
    let known = visited;
    let explored = 0;
    let nextId: string | null = currentQuestionId;
    while (nextId) {
      const question = getQuestionById(nextId);
      if (!question) break;

      if (question.type === "mcq" && question.options) {
        const selectedOption = question.options.find(
          (opt) => opt.value === responses[question.id]?.value
        );

        if (nextId === currentQuestionId) {
          nextId = selectedOption?.next
            ? selectedOption.next
            : question.next || null;
        }
        if (!selectedOption) {
          nextId = question.next || question.options[0]?.next || null;
        }
      } else if (question.type === "msq" && question.options) {
        const selectedOptions = responses[question.id]?.value || [];
        const selectedOptionIds = selectedOptions.map((opt: any) => opt.id);

        nextId =
          question.getNextRoute && selectedOptionIds.length > 0
            ? question.getNextRoute(selectedOptionIds)
            : question.next || null;
      } else {
        nextId = question.next || null;
      }

      if (nextId) explored++;
    }
    known += explored;
    const progressValue = known === 0 ? 0 : visited / known;
    setProgress(progressValue);
  }, [responses, currentQuestionId]);

  useEffect(() => {
    if (index === -1 || index >= assessments.length) {
      setAssessment(null);
      return;
    }

    setAssessment(assessments[index]);
    setAssessmentId(assessments[index].id);
    setAssessmentName(assessments[index].name);
    setAssessmentDescription(assessments[index].description);
    setAssessmentQuestions(assessments[index].questions);

    setCurrentQuestionId(assessments[index].questions[0].id);
    setQuestionsStack([assessments[index].questions[0].id]);
    setResponses({});
    setAnswer(null);
  }, [index]);

  useEffect(() => {
    if (assessment === null) setLoading(true);
    else setLoading(false);
  }, [assessment]);

  const getQuestionById = (id: string) => questions.find((q) => q.id === id);

  // useeffect to validate all questions structure, if optional attr is set then next attr should not be null
  useEffect(() => {
    // Validate all questions structure
    questions.forEach((question) => {
      if (question.optional && !question.next) {
        throw new Error(
          `Question ${question.id} has optional flag set but does not have a next question defined.`
        );
      }
    });
  }, []);

  const determineNextQuestionId = (
    currentQ: Question | undefined,
    value: any
  ) => {
    if (!currentQ) return null;

    if (currentQ.type == "mcq" && currentQ.options) {
      const selectedOption = currentQ.options.find(
        (opt) => opt.value === value
      );
      if (selectedOption && selectedOption.next === null) {
        return null;
      } else if (selectedOption && selectedOption.next) {
        return selectedOption.next;
      }
    }
    if (currentQ.type == "msq" && currentQ.options) {
      const ids = value.map((opt: any) => opt.id);
      return currentQ.getNextRoute
        ? currentQ.getNextRoute(ids)
        : currentQ.next || null;
    }
    return currentQ.next ? currentQ.next : null;
  };

  const handleMCQAnswer = (
    question: Question,
    option: {
      id: string;
      value: any;
      label?: string;
      icon?: string | undefined;
      next?: string | null | undefined;
      score?: number | undefined;
    }
  ) => {
    setResponses((prev) => {
      const prevResponse = prev[question.id];

      if (prevResponse?.opid === option.id) {
        // Option already selected → remove the response
        const updated = { ...prev };
        delete updated[question.id];
        setAnswer(null);
        return updated;
      }

      // New selection → add/update the response
      setAnswer(option.value);
      return {
        ...prev,
        [question.id]: {
          qid: question.id,
          opid: option.id,
          value: option.value,
          type: question.type,
          tag: question.tag,
          score: option.score,
        },
      };
    });
  };

  const handleMSQAnswer = (
    question: Question,
    option: {
      id: string;
      value: any;
      label?: string;
      icon?: string | undefined;
      next?: string | null | undefined;
      score?: number | undefined;
    }
  ) => {
    setResponses((prev) => {
      const prevResponse = prev[question.id];
      const prevValues: {
        id: string;
        value: any;
        score?: number;
      }[] = prevResponse?.value || [];

      const exists = prevValues?.find((opt) => opt.id === option.id);

      let updatedValues;
      if (exists) {
        // Remove if already selected
        updatedValues = prevValues.filter((opt) => opt.id !== option.id);
      } else {
        // Add new option
        updatedValues = [
          ...prevValues,
          { id: option.id, value: option.value, score: option.score },
        ];
      }

      if (updatedValues.length === 0) {
        setAnswer(null);
      } else {
        setAnswer(updatedValues.map((opt) => opt.value).join(", "));
      }

      console.log("Updated values:", updatedValues);

      return {
        ...prev,
        [question.id]: {
          qid: question.id,
          value: updatedValues,
          type: question.type,
          tag: question.tag,
        },
      };
    });
  };

  const handleTextAnswer = (
    question: Question | undefined,
    text: React.SetStateAction<string | null>
  ) => {
    if (!question) return;

    setResponses((prev) => ({
      ...prev,
      [question.id]: {
        value: text,
        type: question.type,
        tag: question.tag,
      },
    }));
    setAnswer(text);
  };

  const submitResponses = async (finalResponses: {}) => {
    console.log("submitting");
    setLoading(true);
    const payload = {
      assessment_id: assessmentId,
      responses: finalResponses,
    };
    try {
      const response = await fetch(onSubmitEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
          "ngrok-skip-browser-warning": "any",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Submission failed");
      }
      const data = await response.json();
      console.log("Submission response:", data);
      Alert.alert("Success", "Your responses have been submitted.");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
      Alert.alert("Payload", JSON.stringify(payload));
      console.log("Payload:", payload);

      setNextAssessmentPopup(true); //////////////////////// MOVE TO after response ok
    }
  };

  const currentQuestion = getQuestionById(currentQuestionId);

  //   navigation functions
  const navigateBack = () => {
    const currId = questionsStack.pop();
    if (currId) {
      delete responses[currId];
    }
    const prevId = questionsStack[questionsStack.length - 1];
    setCurrentQuestionId(prevId);
    setQuestionsStack(questionsStack);

    if (prevId && responses[prevId]) {
      const prevResponse = responses[prevId];
      setAnswer(prevResponse.value || prevResponse.answer || null);
    } else {
      setAnswer(null);
    }

    if (prevId) {
      setCurrentQuestionId(prevId);
    }
  };

  const navigateNext = () => {
    if (currentQuestion?.type === "text") {
      const updatedResponses = {
        ...responses,
        [currentQuestion.id]: {
          qid: currentQuestion.qid,
          value: answer,
          type: currentQuestion.type,
          tag: currentQuestion.tag,
        },
      };

      const nextId = determineNextQuestionId(currentQuestion, answer);

      if (nextId) {
        setResponses(updatedResponses);
        setCurrentQuestionId(nextId);
        setQuestionsStack((prev) => [...prev, nextId]);
        setAnswer(null);
      } else {
        submitResponses(updatedResponses);
      }
    } else {
      const nextId = determineNextQuestionId(
        currentQuestion,
        currentQuestion ? responses[currentQuestion.id]?.value : undefined
      );

      if (nextId) {
        setCurrentQuestionId(nextId);
        setQuestionsStack((prev) => [...prev, nextId]);
        setAnswer(null);
      } else {
        submitResponses(responses);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Loader loading={loading} />

      {nextAssessmentPopup && index + 1 < assessments.length && (
        <View style={styles.popup}>
          <View style={styles.popupContent}>
            <View style={{ margin: 10 }}>
              <MaterialIcons
                name="check-circle"
                size={70}
                color={colors.pink}
              />
            </View>
            <Text style={{ fontSize: 22, color: colors.pink, margin: 10 }}>
              Next Assessment
            </Text>
            <Text style={{ fontSize: 18, color: "#666" }}>
              You have completed this assessment. Please proceed to the next
              one.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setNextAssessmentPopup(false);
                setIndex(index + 1);
              }}
              style={{
                backgroundColor: colors.pink,
                paddingHorizontal: 25,
                paddingVertical: 12,
                borderRadius: 25,
                marginTop: 20,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>
                Next Assessment
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {nextAssessmentPopup && index + 1 === assessments.length && (
        <View style={styles.popup}>
          <View style={styles.popupContent}>
            <View style={{ margin: 10 }}>
              <MaterialIcons
                name="check-circle"
                size={70}
                color={colors.pink}
              />
            </View>
            <Text style={{ fontSize: 22, color: colors.pink }}>
              Assessment Completed
            </Text>
            <Text style={{ fontSize: 18, color: "#666" }}>
              You have completed all assessments.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setNextAssessmentPopup(false);
                router.back();
              }}
              style={{
                backgroundColor: colors.pink,
                paddingHorizontal: 25,
                paddingVertical: 12,
                borderRadius: 25,
                marginTop: 20,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18 }}>Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentQuestion && (
        <View
          style={{
            padding: 20,
            borderRadius: 10,
            flex: 1,
            width: "100%",
            display: "flex",
            borderWidth: 1,
            borderColor: "#ccc",
            gap: 20,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <MaterialIcons name="assessment" size={28} color={colors.pink} />
            <Text style={{ fontSize: 22, fontWeight: "bold" }}>{name}</Text>
          </View>
          <Text style={{ fontSize: 18, color: "#666" }}>{description}</Text>
          <ProgressBar
            progress={progress}
            color={colors.pink}
            style={{
              width: "100%",
              height: 10,
              borderRadius: 10,
              backgroundColor: "lightgrey",
            }}
          />
          <View
            style={{
              padding: 20,
              borderRadius: 10,
              backgroundColor: "#f9f9f9",
              borderWidth: 1,
              borderColor: "#ccc",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              width: "100%",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                Q{currentQuestion.qid.toUpperCase()}
              </Text>
              <Text style={{ fontSize: 18, color: "#666" }}>
                {currentQuestion.type.toUpperCase()}
              </Text>
            </View>
            <Text style={{ fontSize: 20, color: "#666" }}>
              {currentQuestion.text}
            </Text>
          </View>

          <View>
            {currentQuestion.type === "mcq" && currentQuestion.options && (
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={
                      responses[currentQuestion.id]?.value === option.value
                        ? [styles.optionButton, styles.optionButtonSelected]
                        : styles.optionButton
                    }
                    onPress={() => handleMCQAnswer(currentQuestion, option)}
                  >
                    <Text
                      style={
                        responses[currentQuestion.id]?.value === option.value
                          ? [styles.optionText, styles.optionTextSelected]
                          : styles.optionText
                      }
                    >
                      {option.icon && (
                        <MaterialIcons
                          name={option.icon as any}
                          size={20}
                          color={colors.pink}
                        />
                      )}
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {currentQuestion.type === "msq" && currentQuestion.options && (
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={
                      (responses[currentQuestion.id]?.value || []).some(
                        (opt: { id: string }) => opt.id === option.id
                      )
                        ? [styles.optionButton, styles.optionButtonSelected]
                        : styles.optionButton
                    }
                    onPress={() => handleMSQAnswer(currentQuestion, option)}
                  >
                    <Text
                      style={
                        (responses[currentQuestion.id]?.value || []).some(
                          (opt: { id: string }) => opt.id === option.id
                        )
                          ? [styles.optionText, styles.optionTextSelected]
                          : styles.optionText
                      }
                    >
                      {option.icon && (
                        <MaterialIcons
                          name={option.icon as any}
                          size={20}
                          color={colors.pink}
                        />
                      )}
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {currentQuestion.type === "text" && (
              <TextInput
                style={styles.textInput}
                placeholder="Type your response..."
                value={responses[currentQuestion.id]?.value || undefined}
                onChangeText={(text) => {
                  if (text.trim() === "") setAnswer(null);
                  else setAnswer(text);
                }}
                multiline={true}
                numberOfLines={4}
              />
            )}
          </View>

          <View style={styles.bottomNavigation}>
            <TouchableOpacity
              onPress={navigateBack}
              disabled={questionsStack.length === 1}
              style={[
                styles.navBtn,
                questionsStack.length === 1 ? styles.navBtnDisabled : {},
              ]}
            >
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.navBtnText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={navigateNext}
              style={[
                styles.navBtn,
                answer === null && !currentQuestion.optional
                  ? styles.navBtnDisabled
                  : {},
              ]}
              disabled={answer === null && !currentQuestion.optional}
            >
              <Text style={styles.navBtnText}>
                {/* if curr question's next is null or selected option's next is null then show 'submit' else show 'next' */}
                {currentQuestion.next === null ||
                (currentQuestion.type === "mcq" &&
                  currentQuestion.options?.some(
                    (opt) => opt.value === answer && opt.next === null
                  )) ||
                (currentQuestion.type === "msq" &&
                  currentQuestion.options?.some((opt) =>
                    (responses[currentQuestion.id]?.value || []).some(
                      (v: any) => v.id === opt.id && opt.next === null
                    )
                  ))
                  ? "Submit"
                  : "Next"}
              </Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const colors = {
  accent: "#4A90E2",
  headerBgColor: "#f5f5f5",
  primary: "#4A90E2",
  secondary: "#D32F2F",
  textColor: "#333",
  backgroundColor: "#fff",

  lightpink: "#86608E",
  pink: "#614051",
  // yellowish: "#FFEB3B",
  green: "#283D3B",
  // bluish: "#BBDEFB",
  orange: "#FF9800",
  persianGreen: "#009688",

  // accent: "#86608E",
  // accent: "#283D3B",
  // accent: "#009688",

  // accent: "#614051",
  // accent: "#ff9800",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    // backgroundColor: colors.headerBgColor,
    // justifyContent: 'center',
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  questionText: {
    fontSize: 20,
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.pink,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  optionText: {
    color: "#000",
    fontSize: 16,
  },
  optionButtonSelected: {
    backgroundColor: colors.pink,
  },
  optionTextSelected: {
    color: "#fff",
  },
  navBtn: {
    backgroundColor: colors.pink,
    padding: 15,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  navBtnText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  navBtnDisabled: {
    backgroundColor: "#ccc",
  },
  navBtnTextDisabled: {
    color: "#666",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNavigation: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  popup: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  popupContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "84%",
    alignItems: "center",
  },
});

export default AssessmentComponent;
