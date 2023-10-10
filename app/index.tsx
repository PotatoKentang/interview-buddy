import { MaterialIcons } from "@expo/vector-icons";
import { GluestackUIProvider, HStack, Heading, Text, VStack } from "@gluestack-ui/themed";
import { config } from "@gluestack-ui/config"
import { Link, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { ImageBackground, Pressable, ScrollView, View } from "react-native";
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
      <SafeAreaView
        style={{
          width: wp("100%"),
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#FAF9F6",
          flex: 1,
          height: "100%",
        }}
      >
        <ScrollView>
          <ImageBackground
            source={require("../assets/images/interviewback.png")}
            className="Header"
            style={{
              width: "100%",
              height: 232,
              justifyContent: "center",
              alignItems: "center",
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>Hi, John</Text>
          </ImageBackground>
          <View style={{ width: wp("100%") }}>
            <VStack marginHorizontal="$5">
              <Link
                href="/interview/interview-type"
                asChild
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Pressable
                  style={{
                    paddingHorizontal: 24,
                    transform: [{ translateY: -50 }],
                    paddingVertical: 32,
                    borderRadius: 18,
                    shadowColor: "#000000",
                    shadowOffset: { width: 4, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 20,
                    elevation: 4,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                      Start Interview
                    </Text>
                    <Text
                      style={{ marginTop: 8, fontSize: 14, fontWeight: "normal" }}
                    >
                      Interview for a specific job
                    </Text>
                  </View>
                  <MaterialIcons name="navigate-next" size={32} color="#CE3762" />
                </Pressable>
              </Link>
              <HStack alignItems="center" justifyContent="space-between">
                <Heading>Recent Interviews</Heading>
                <Link
                  href="/interview/recent-interviews"
                  style={{
                    fontSize: 10,
                    color: "#CE3762",
                    fontWeight: "bold",
                    marginLeft: 8,
                  }}
                >
                  See More
                </Link>
              </HStack>

              <View>
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
                          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                            Interview as {interview.promptInformation?.role} at{" "}
                            {interview.promptInformation?.workPlace}
                          </Text>
                          <Text
                            style={{
                              marginTop: 8,
                              fontSize: 14,
                              fontWeight: "normal",
                            }}
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
              </View>
            </VStack>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}
