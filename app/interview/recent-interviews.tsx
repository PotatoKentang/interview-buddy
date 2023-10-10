// RecentInterviews.js
import { MaterialIcons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { TLocalStorage } from "../../lib/types";
import { getDataFromLocalStorage } from "../../utils/local-storage";

export default function RecentInterviews() {
  const [recentInterviews, setRecentInterviews] = useState<TLocalStorage[]>([]);
  useFocusEffect(() => {
    // Fetch recent interview data from local storage
    const fetchRecentInterviews = async () => {
      try {
        const recentInterviewData = await getDataFromLocalStorage();
        setRecentInterviews(recentInterviewData);
      } catch (error) {
        console.error("Error fetching recent interviews:", error);
      }
    };
    fetchRecentInterviews();
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
      }}
    >
      <ScrollView>
        {recentInterviews.length > 0 &&
          recentInterviews.map((interview, index) => (
            <Link
              key={index}
              href={{
                pathname: "/interview/[id]",
                params: { id: interview.id },
              }}
              asChild
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
                  borderRadius: 10,
                  elevation: 4,
                  marginTop: 20,
                  marginHorizontal: 24,
                }}
              >
                <View style={{ flexDirection: "column", maxWidth: "80%" }}>
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

                <MaterialIcons name="navigate-next" size={32} color="#CE3762" />
              </Pressable>
            </Link>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
