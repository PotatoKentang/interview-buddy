import { Feather } from "@expo/vector-icons";
import { Button, ScrollView, Text, View } from "@gluestack-ui/themed";
import Voice, {
  SpeechEndEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { chatCompletion } from "../../../lib/chatgpt/chatCompletion";
import { constructEvaluationPromptBurst } from "../../../lib/chatgpt/constructEvaluationPromptBurst";

export default function BulkQuestionQuery() {
  const { question } = useLocalSearchParams();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false); // Added loading state

  const startListening = async () => {
    try {
      await Voice.start("en-US");
      setIsListening(true);
      setResults([]);
      setError(null);
    } catch (e) {
      console.error(e);
      setError("Error starting voice recognition.");
    }
  };
  const fetchEvaluator = async (answer: undefined | string[]) => {
    setLoading(true); // Set loading state to true when fetching
    try {
      const evaluationPrompt = await constructEvaluationPromptBurst({
        question: question ? question[0] : question,
        answer: answer ? answer[0] : "",
      });
      console.log(evaluationPrompt);
      const evaluationResult = await chatCompletion(evaluationPrompt);
      setEvaluation(evaluationResult);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (e) {
      console.error(e);
      setError("Error stopping voice recognition.");
    }
  };

  const onSpeechError = (error: unknown) => {
    console.log(error);
  };

  const onSpeechResults = ({ value }: SpeechResultsEvent) => {
    fetchEvaluator(value);
  };
  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechEnd = (event: SpeechEndEvent) => {
      setIsListening(false);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  const resetAnswer = () => {
    setEvaluation(null);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#FAF9F6",
      }}
    >
      <ScrollView>
        <ImageBackground
          source={require("../../../assets/images/interviewback.png")}
          style={{
            width: "100%",
            height: 200,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
            {question}
          </Text>
        </ImageBackground>
        <View
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: "40%" }}
        >
          {!evaluation && (
            <>
              <TouchableOpacity
                onPress={isListening ? stopListening : startListening}
              >
                <View
                  style={{
                    padding: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: isListening ? "#CE3761" : "#CE3762",
                    borderRadius: 54,
                    width: 108,
                    height: 108,
                  }}
                >
                  <Feather name="mic" size={54} color="white" />
                </View>
              </TouchableOpacity>
              <Text color="black" style={{ marginTop: 10 }}>
                {isListening ? "Listening..." : "Tap To Speak"}
              </Text>
            </>
          )}
          {loading && <ActivityIndicator size="large" color="#CE3762" />}
          {!!evaluation && (
            <>
              <Text>{evaluation}</Text>
              <TouchableOpacity>
                <Button
                  style={{
                    backgroundColor: "#CE3762",
                    borderRadius: 4,
                    marginVertical: 10,
                    marginHorizontal: 30,
                  }}
                  onPress={() => resetAnswer()}
                >
                  <Text color="#FFFFFF">Try Again</Text>
                </Button>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
