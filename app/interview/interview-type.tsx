import { Button, Text, View } from "@gluestack-ui/themed";
import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const ActiveButton = ({
  isActive,
  text,
  onPress,
}: {
  isActive: boolean;
  text: string;
  onPress: () => void;
}) => {
  if (isActive) {
    return (
      <View alignItems="center" marginBottom="$5">
        <Button
          backgroundColor="#CE3762"
          paddingHorizontal="$10"
          paddingVertical="$2"
          w="$5/6"
          h="$12"
          onPress={onPress}
        >
          <Text color="#F5F5F5">{text}</Text>
        </Button>
      </View>
    );
  }
  return (
    <View alignItems="center" marginBottom="$5">
      <Button
        backgroundColor="#F5F5F5"
        paddingHorizontal="$10"
        paddingVertical="$2"
        w="$5/6"
        h="$12"
        onPress={onPress} // Add the onPress event handler here
      >
        <Text color="#CE3762">{text}</Text>
      </Button>
    </View>
  );
};

export default function InterviewType() {
  const [type, setType] = useState<number>(1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ActiveButton
        isActive={type == 1} // Fix the comparison operator here
        text="One-by-One Questions"
        onPress={() => setType(1)}
      />
      <ActiveButton
        isActive={type == 2} // Fix the comparison operator here
        text="Bulk Questions"
        onPress={() => setType(2)} // Fix the value passed to setType here
      />
      <View style={{ flex: 1 }}></View>
      <Button
        backgroundColor="#CE3762"
        paddingHorizontal="$10"
        paddingVertical="$2"
        marginHorizontal="$10"
        h="$12"
        marginVertical="$10"
        onPress={async () =>
          type == 1
            ? await router.push(`/interview/interview-profile`)
            : await router.push(`/interview/bulk/`)
        }
      >
        <Text color="#F5F5F5" bold={true}>
          Continue
        </Text>
      </Button>
    </SafeAreaView>
  );
}
