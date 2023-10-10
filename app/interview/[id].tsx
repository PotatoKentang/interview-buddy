import { Ionicons } from "@expo/vector-icons";
import { Button, Text } from "@gluestack-ui/themed";
import Voice, { SpeechResultsEvent } from "@react-native-voice/voice";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
  View,
} from "react-native"; // Import KeyboardAvoidingView
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ChatBubble } from "../../components/chat-bubble";
import { tts } from "../../constant/links";
import { Tinterview } from "../../lib/types";
import useInterviewStore from "../../store/interview";
import useSoundStore from "../../store/sound";
import {
  getMicrophonePermission,
  getStoragePermission,
} from "../../utils/ask-permission";
export default function Interview() {
  const [modeInputText, setModeInputText] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>("");
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const interview = useInterviewStore((state) => state.interview);
  const [isInterviewStarted, setIsInterviewStarted] = useState<boolean>(false);
  const sound = useSoundStore((state) => state.sound);
  const stopSound = useSoundStore((state) => state.stopSound);
  const setSound = useSoundStore((state) => state.setSound);
  const [lastPromptedResult, setLastPromptedResult] = useState<string | null>(
    null
  );
  const { id } = useLocalSearchParams();
  const [isFetching, setIsFetching] = useState<boolean>(false); // Add this state variable
  const fetchInterviewHistory = useInterviewStore(
    (state) => state.fetchInterviewHistory
  );
  const getInterviewResponse = useInterviewStore(
    (state) => state.getInterviewResponse
  );
  const startInterview = useInterviewStore((state) => state.startInterview);

  const startSpeechToText = async () => {
    try {
      if (sound) {
        await sound.stopAsync(); // Stop the sound if it exists
      }
      await Voice.start("en-us");
      setSpeaking(true);
    } catch (error) {
      console.log(error);
    }
  };

  const stopSpeechToText = async () => {
    await Voice.stop();
    setSpeaking(false);
  };

  const onSpeechError = (error: unknown) => {
    console.log(error);
  };

  const onSpeechResults = ({ value }: SpeechResultsEvent) => {
    if (value[0] !== lastPromptedResult) {
      setResults(value || []);
      stopSpeechToText();
    }
  };
  const initiateInterview = async () => {
    await stopSound();
    if (isFetching) return;
    try {
      setIsFetching(true); // Set isFetching to true when starting the fetch
      const result = await startInterview();
      const audioSound = new Audio.Sound();
      await audioSound.loadAsync({ uri: tts(result) });
      await audioSound.playAsync();
      setIsInterviewStarted(true);
      setSound(audioSound);
    } catch (err) {
      console.log("From initiate Interview");
      console.log(err);
      console.log("After initiate Interview");
    } finally {
      setIsFetching(false); // Set isFetching to false when the fetch is complete
    }
  };

  const fetchInterviewResponse = async (
    textInput: string | undefined = undefined
  ) => {
    await stopSound();
    if (isFetching) return;

    try {
      setIsFetching(true);

      const userResponse: Tinterview = {
        from: "user",
        text: textInput ?? results[0],
        time: new Date().toISOString(),
      };

      // Check if the result has already been prompted
      if (userResponse.text !== lastPromptedResult) {
        setLastPromptedResult(userResponse.text);

        const result = await getInterviewResponse(userResponse);
        const audioSound = new Audio.Sound();
        await audioSound.loadAsync({ uri: tts(result) });
        await audioSound.playAsync();
        setIsInterviewStarted(true);
        setSound(audioSound);
      }

      setTextInput("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    getMicrophonePermission();
    getStoragePermission();
    setSpeaking(false);
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    fetchInterviewHistory(id);
  }, [id]);

  useEffect(() => {
    if (sound) console.log("sound is dead");
    else console.log("no sound");
  }, [sound]);

  useEffect(() => {
    if (!speaking && isInterviewStarted && results.length > 0) {
      fetchInterviewResponse();
    }
  }, [speaking, isInterviewStarted, results]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{
            paddingTop: 20,
            paddingBottom: 100,
            height: "80%",
            minWidth: wp("90%"),
            marginHorizontal: "auto",
          }}
        >
          {!interview.length && !isInterviewStarted && (
            <ChatBubble from={"system"} text={"Start the Interview"}>
              <Button
                style={{
                  backgroundColor: "transparent",
                }}
                onPress={() => initiateInterview()}
              >
                <Text bold={true} color="#CE3762">
                  Click Here to Start
                </Text>
              </Button>
            </ChatBubble>
          )}
          {interview.map((conversation, index) => {
            return (
              <ChatBubble
                key={index}
                from={conversation.from}
                text={conversation.text}
              />
            );
          })}
        </ScrollView>
        {!interview.length ? null : speaking ? (
          <Button
            style={{
              backgroundColor: "#CE3762",
              borderRadius: 4,
              marginVertical: 10,
            }}
            onPress={() => stopSpeechToText()}
          >
            <Text bold={true} color="#FFFFFF">
              Stop
            </Text>
          </Button>
        ) : modeInputText === false ? (
          <View>
            <Button
              style={{
                backgroundColor: "#CE3762",
                borderRadius: 4,
                marginVertical: 10,
                marginHorizontal: 30,
              }}
              onPress={() => startSpeechToText()}
            >
              <Text bold={true} color="#FFFFFF">
                Speak
              </Text>
            </Button>
            <Button
              onPress={() => {
                setModeInputText(true);
              }}
              style={{
                backgroundColor: "transparent",
              }}
            >
              <Text
                style={{
                  borderRadius: 4,
                  marginBottom: 5,
                  marginHorizontal: 50,
                }}
                color="#CE3762"
              >
                Can't speak right now?
              </Text>
            </Button>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              paddingHorizontal: 10,
              gap: 10,
            }}
          >
            <TextInput
              style={{
                height: 40,
                flex: 9,
                borderWidth: 1,
                borderColor: "gray",
                padding: 10,
                borderRadius: 5,
              }}
              placeholder="Input"
              onChangeText={(text) => setTextInput(text)}
              value={textInput}
            />
            <View
              style={{
                backgroundColor: "#CE3762",
                borderRadius: 5,
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              <Ionicons
                name="send"
                size={20}
                color="white"
                onPress={() => fetchInterviewResponse(textInput)}
              />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
