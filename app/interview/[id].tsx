import { Ionicons } from "@expo/vector-icons";
import { 
  Button,
  Text,
  View 
} from "@gluestack-ui/themed";
import Voice, { SpeechResultsEvent } from "@react-native-voice/voice";
import { Audio } from "expo-av";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  TextInput,
} from "react-native";
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
import { FlatList } from "react-native-gesture-handler";

export default function Interview()
{
  const scrollViewRef = useRef<ScrollView>(null);
  const FlatListRef = useRef<FlatList>(null);
  const [modeInputText, setModeInputText] = useState<boolean>(false);
  const [textInput, setTextInput] = useState<string>("");
  const [isTextNull, setIsTextNull] = useState<boolean>(true); 
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

  const scrollToIndex = () => {
    // Use the `scrollToIndex` method on the FlatList reference
    FlatListRef.current?.scrollToIndex({ index: interview.length-1, animated: true });
  }

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
    setTextInput('');
    setIsTextNull(true);
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
        <FlatList
          ref={FlatListRef}
          ListEmptyComponent={() => {
            return (
              <ChatBubble from={"system"} text={"Start the Interview"}>
                <Button
                  backgroundColor="transparent"
                  paddingTop={12}
                  onPress={() => initiateInterview()}
                >
                  <Text bold={true} color="#CE3762" underline textAlign="center">
                    Click Here to Start
                  </Text>
                </Button>
              </ChatBubble>
            );
          }}
          data={interview}
          renderItem={({item, index}) => <ChatBubble key={index} from={item.from} text={item.text}/>}
          onContentSizeChange={() => 
            {
              if(interview.at(-1)?.from === 'system')
              {
                scrollToIndex();
              }
              else FlatListRef.current?.scrollToEnd({ animated: true })
            }
          }
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              FlatListRef.current?.scrollToIndex({ index: info.index, animated: true });
            });
          }}
        
        />
        {/* <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}    
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{
            height: "80%",
            minWidth: wp("90%"),
            marginHorizontal: "auto",
          }}
        >
          <View paddingTop={12} paddingBottom={12}>
            {!interview.length && !isInterviewStarted && (
              <ChatBubble from={"system"} text={"Start the Interview"}>
                <Button
                  backgroundColor="transparent"
                  paddingTop={12}
                  onPress={() => initiateInterview()}
                >
                  <Text bold={true} color="#CE3762" underline textAlign="center">
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
          </View>
        </ScrollView> */}
        {!interview.length ? null : speaking ? (
          <Button
            marginHorizontal="$5"
            padding={12}
            justifyContent="center"
            alignItems="center"
            style={{
              backgroundColor: "#CE3762",
              borderRadius: 6,
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
              marginHorizontal="$5"
              padding={12}
              justifyContent="center"
              alignItems="center"
              style={{
                backgroundColor: "#CE3762",
                borderRadius: 6,
              }}
              onPress={() => startSpeechToText()}
            >
              <Text bold={true} color="#FFFFFF">
                Speak
              </Text>
            </Button>
            <Button
              marginVertical={6}
              justifyContent="center"
              alignItems="center"
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
              alignItems: "center",
              paddingHorizontal: 14,
              paddingTop: 8,
              paddingBottom: 10,
              backgroundColor: '#FFFFFF',
              justifyContent: 'flex-end',
              borderTopColor: '#EAEAEA',
              borderTopWidth: 0.5,
            }}
          >
            <TextInput
              style={{
                height: 40,
                flex: 9,
                borderWidth: 1,
                borderColor: "#CCCCCC",
                padding: 10,
                borderRadius: 16,
                backgroundColor: '#FFFFFF',
                color: '#181818',
              }}
              placeholder="Input"
              placeholderTextColor={'#CCCCCC'}
              onChangeText={(text) =>
                {
                  if(text === '') setIsTextNull(true);
                  else setIsTextNull(false);
                  setTextInput(text)
                }
              }
              value={textInput}
            />
            <View
              style={{
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              <Ionicons
                name="send"
                size={24}
                color= {isTextNull ? "#DDDDDD" : "#CE3762"} 
                onPress={() => 
                  {
                    if(isTextNull) return;
                    fetchInterviewResponse(textInput);
                  }}
              />
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
