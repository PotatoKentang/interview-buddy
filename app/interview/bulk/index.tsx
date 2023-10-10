import { MaterialIcons } from "@expo/vector-icons";
import { Badge, BadgeText, ScrollView, Text } from "@gluestack-ui/themed";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  View,
} from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import useBulkQuestions from "../../../store/bulk-interview";
import { router } from "expo-router";

export default function BulkInterview() {
  const bulkInterview = useBulkQuestions((state) => state.bulkInterview);
  const [category, setCategory] = useState("General Questions");

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
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} pl="$5">
            {Object.keys(bulkInterview).map((key) => {
              return (
                <Pressable key={key} onPress={() => setCategory(key)}>
                  <Badge
                    size="md"
                    variant={key === category ? "solid" : "muted"}
                    borderRadius="$xs"
                    action={key === category ? "info" : "muted"}
                    padding="$2"
                    marginRight="$2"
                  >
                    <BadgeText>{key}</BadgeText>
                  </Badge>
                </Pressable>
              );
            })}
          </ScrollView>
          {bulkInterview[category].map((value, index) => {
            return (
              <Pressable
                key={value}
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
                onPress={() =>
                  router.push(`/interview/bulk/interviewQ?question=${value}`)
                }
              >
                <View style={{ flexDirection: "column", maxWidth: "80%" }}>
                  <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                    {value}
                  </Text>
                </View>

                <MaterialIcons name="navigate-next" size={32} color="#CE3762" />
              </Pressable>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
