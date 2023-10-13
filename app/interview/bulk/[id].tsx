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
  // const [evaluation, setEvaluation] = useState<string | null>("Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero totam mollitia, commodi, non aut assumenda quibusdam vel, quasi explicabo autem itaque praesentium cupiditate consequuntur. Eaque consectetur cupiditate corporis impedit a."); 
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
        <View marginHorizontal={24}>
          <ImageBackground
            resizeMode="cover"
            source={require("../../../assets/images/interviewback.png")}
            imageStyle={{
              borderRadius: 12
            }}
            style={{
              width: "auto",
              height: 200,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text color="#FFFFFF" bold size="xl" marginHorizontal={32}>
              {question}
            </Text>
          </ImageBackground>
        </View>
        <View
          justifyContent="center"
          alignItems="center"
        >
          {!evaluation && (
            <View style={{ marginTop: "40%" }}>
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
            </View>
          )}
          {loading && <ActivityIndicator size="large" color="#CE3762" />}
          {!!evaluation && (
            <View marginTop={24} marginHorizontal={24}>
              <Text bold>Your Evaluation:</Text>
              <Text mt={12}>{evaluation}</Text>
              <TouchableOpacity>
                <Button
                  marginTop={32}
                  marginBottom={24}
                  borderRadius={6}
                  backgroundColor="#CE3762"
                  padding={12}
                  justifyContent="center"
                  alignItems="center"
                  onPress={() => resetAnswer()}
                  width={'$full'}
                >
                  <Text color="#FFFFFF" bold={true}>
                    Try Again
                  </Text>
                </Button>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
