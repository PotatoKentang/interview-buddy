import { MaterialIcons } from "@expo/vector-icons";
import { Box, GluestackUIProvider, HStack, Heading, Text, VStack } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config"
import { Link, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, Pressable, ScrollView, StatusBar, View } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { TLocalStorage } from "../lib/types";
import { clearLocalStorage, getDataFromLocalStorage } from "../utils/local-storage";
import useSoundStore from "../store/sound";

export default function Index() {
  const [recentInterviews, setRecentInterviews] = useState<TLocalStorage[]>([]);
  const stopSound = useSoundStore((state: any) => state.stopSound);
  useFocusEffect(() => {
    // Fetch recent interview data from local storage
    stopSound();
    const fetchRecentInterviews = async () => {
      try {
        const recentInterviewData = await getDataFromLocalStorage();
        setRecentInterviews(recentInterviewData);
      } catch (error) {
        console.error("Error fetching recent interviews:", error);
      }
    };
    fetchRecentInterviews();
    // clearLocalStorage();
  });

  return (
    <GluestackUIProvider config={config}>
      <StatusBar barStyle = "dark-content" hidden = {false} backgroundColor = "transparent" translucent = {true}/>
      <SafeAreaView
        style={{
          width: wp("100%"),
          backgroundColor: "#FAF9F6",
          flex: 1,
          height: "100%",
        }}
      >
        <ScrollView
          style={{
            flex: 1,
            height: '100%'
          }}
        >
          <ImageBackground
            source={require("../assets/images/interviewback.png")}
            className="Header"
            style={{
              width: "100%",
              height: 232,
              justifyContent: "center",
              // alignItems: "center",
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
            }}
          >
            <Text bold size="3xl" color="#FFFFFF" marginLeft={56}>Good Luck</Text>
          </ImageBackground>
          <View style={{ width: wp("100%") }}>
            <VStack>
              <Box
                style={{
                  position: 'absolute',
                  width: '100%',
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  height: 16,
                  transform: [{ translateY: -16 }],
                  backgroundColor: '#FAF9F6'
                }}
              >

              </Box>
              <Box marginHorizontal="$5">
                <Link
                  href="/interview/interview-type"
                  asChild
                >
                    <Pressable
                      style={{
                        paddingHorizontal: 24,
                        transform: [{ translateY: -50 }],
                        paddingVertical: 20,
                        borderRadius: 18,
                        shadowColor: "#000000",
                        shadowOffset: { width: 4, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 20,
                        elevation: 4,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: 'center',
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      <VStack>
                        <Text size="xl" bold>
                          Start Interview
                        </Text>
                        <Text
                          size="sm"
                          // bold
                        >
                          Let's train your interview skill
                        </Text>
                      </VStack>
                      <MaterialIcons name="navigate-next" size={32} color="#CE3762" />
                    </Pressable>
                </Link>
              </Box>
              <HStack marginHorizontal="$5" alignItems="center" justifyContent="space-between" paddingRight={4}>
                <Heading>Recent Interviews</Heading>
                <Link
                  href="/interview/recent-interviews"
                >
                  <Text size="xs" bold color="#CE3762">See More</Text>
                </Link>
              </HStack>

              <Box
                style={{
                  paddingBottom: 32 
                }}  
                marginHorizontal="$5"
              >
                {recentInterviews.length > 0 &&
                  recentInterviews.map((interview, index) => (
                    <Link
                      key={index}
                      href={{
                        pathname: "/interview/[id]",
                        params: { id: interview.id },
                      }}
                      asChild
                      style={{
                        width: "100%",
                      }}
                    >
                      <Pressable
                        style={{
                          padding: 16,
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          backgroundColor: "#FFFFFF",
                          shadowColor: "#000000",
                          shadowOffset: { width: 4, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 20,
                          borderRadius: 18,
                          elevation: 4,
                          marginTop: 20,
                        }}
                      >
                        <View
                          style={{ flexDirection: "column", maxWidth: "80%" }}
                        >
                          <Text bold size="lg">
                            Interview as {interview.promptInformation?.role} at{" "}
                            {interview.promptInformation?.workPlace}
                          </Text>
                          <Text
                            size="sm"
                          >
                            {interview.promptInformation?.maxQuestions} Questions
                          </Text>
                        </View>

                        <MaterialIcons
                          name="navigate-next"
                          size={32}
                          color="#CE3762"
                        />
                      </Pressable>
                    </Link>
                  ))}
              </Box>
            </VStack>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}
