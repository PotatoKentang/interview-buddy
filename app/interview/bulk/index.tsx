import { MaterialIcons } from "@expo/vector-icons";
import { Badge, BadgeText, HStack, ScrollView, Text } from "@gluestack-ui/themed";
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
          style={{
            height: "100%",
          }}
        >
          <View
            style={{
              paddingTop: 16,
              paddingBottom: 32
            }}
          >
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} flex={1}>
              <HStack
                gap={'$2'}
                paddingHorizontal={24}
              >
                {Object.keys(bulkInterview).map((key) => {
                  return (
                    <Pressable key={key} onPress={() => setCategory(key)}>
                      <Badge
                        size="md"
                        borderRadius={4}
                        action={key === category ? "info" : "muted"}
                        padding="$2"
                        backgroundColor={key === category ? "#CE3762" : "#F5F5F5"}
                        elevation={1}
                      >
                        <BadgeText
                          color={key === category ? "#FFFFFF" : "#181818"}
                        >{key}</BadgeText>
                      </Badge>
                    </Pressable>
                  );
                })}
              </HStack>
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
