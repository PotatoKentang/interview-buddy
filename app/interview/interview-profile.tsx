import {
  Button,
  ScrollView,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  VStack,
  useToast,
  Box
} from "@gluestack-ui/themed";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PromptSetup } from "../../lib/types";
import useInterviewStore from "../../store/interview";
import { generateUniqueID } from "../../utils/generateID";
export default function index() {
  const [form, setForm] = useState({
    job: "",
    place: "",
    targetCompany: "",
    interviewerRole: "",
    maxQuestions: "5",
  });
  const setPromptInformation = useInterviewStore(
    (state) => state.setPromptInformation
  );
  const setAdditionalInformation = useInterviewStore(state=>state.setAdditionalInformation);


  const toast = useToast();
  const handleTextChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const renderToast = (toastTitle: string, toastDescription: string) => {
    return toast.show({
      placement: "top",
      render: ({ id }) => {
        return (
          <Toast nativeId={id} action="warning" variant="accent" mt="$10">
            <VStack space="xs">
              <ToastTitle>{toastTitle}</ToastTitle>
              <ToastDescription textBreakStrategy="balanced">
                {toastDescription}
              </ToastDescription>
            </VStack>
          </Toast>
        );
      },
    });
  };
  const handleButtonPress = async () => {
    // Validate that the required fields are not empty
    if (!form.interviewerRole.trim()) {
      renderToast(
        "Role Field Must Not be Empty",
        "Fill in the position that you want to apply for, Ex: Software Engineer"
      );
      return;
    }

    if (!form.place.trim()) {
      renderToast(
        "Workplace Field Must Not be Empty",
        "Fill in the place that you are applying for, Ex: Binus University"
      );
      return;
    }

    if (parseInt(form.maxQuestions) <= 0 || form.maxQuestions == "") {
      renderToast(
        "Max Questions",
        "Max questions cannot be empty nor negative"
      );
      return;
    }

    // Create an object to hold the non-null values
    const updatedPromptInformation: PromptSetup = {};

    // Check each field and add it to the object if it's not null
    if (form.interviewerRole !== null) {
      updatedPromptInformation.role = form.interviewerRole;
    }

    if (form.place !== null) {
      updatedPromptInformation.workPlace = form.place;
    }

    if (form.maxQuestions !== null) {
      updatedPromptInformation.maxQuestions = form.maxQuestions;
    }

    if (form.targetCompany !== null) {
      setAdditionalInformation(form.targetCompany);
    }
    // Update the state with the non-null values
    setPromptInformation(updatedPromptInformation);

    // Create a new DB table row with the uniqueID and save the form data
    // Then, navigate to the interview page with the uniqueID
    const uniqueID = await generateUniqueID();
    await console.log(`unique id generated: ${uniqueID}`);
    await router.push(`/interview/${uniqueID}`);
  };

  return (
    <SafeAreaView
      style={{
        width: '100%',
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
        <Box
          flex={1}
          marginHorizontal="$5"
          justifyContent="space-between"
          height={'$full'}
        >
          <View>
            <View>
              <View style={{ flexDirection: "row" }}>
                <Text bold marginBottom={6}>Applied Position</Text>
                <Text style={{ color: "red" }}> *</Text>
              </View>

              <TextInput
                style={styles.input_normal}
                placeholder="What role are you applying for?"
                onChangeText={(text) =>
                  handleTextChange("interviewerRole", text)
                }
                value={form.interviewerRole}
              />
            </View>

            <View>
              <View style={{ flexDirection: "row" }}>
                <Text bold marginBottom={6}>Work Place</Text>
                <Text style={{ color: "red" }}> *</Text>
              </View>

              <TextInput
                style={styles.input_normal}
                placeholder="What company are you applying at?"
                onChangeText={(text) => handleTextChange("place", text)}
                value={form.place}
              />
            </View>

            <View>
              <View style={{ flexDirection: "row" }}>
                <Text bold marginBottom={6}>Max Questions to be asked</Text>
                <Text style={{ color: "red" }}> *</Text>
              </View>

              <TextInput
                style={styles.input_normal}
                placeholder="10"
                keyboardType="numeric"
                onChangeText={(text) =>
                  handleTextChange("maxQuestions", text)
                }
                value={form.maxQuestions}
              />
            </View>

            <View>
              <View>
                <Text bold marginBottom={6}>Tell Me About Your Target Company</Text>
              </View>

              <TextInput
                multiline={true}
                numberOfLines={2}
                style={styles.input_multiline}
                placeholder="IT Company in Jakarta with requirements can using Eclipse and can code Java."
                onChangeText={(text) =>
                  handleTextChange("targetCompany", text)
                }
                textAlignVertical="top"
                value={form.targetCompany}
              />
            </View>
          </View>

          <Button
            marginTop={32}
            borderRadius={6}
            backgroundColor="#CE3762"
            padding={12}
            justifyContent="center"
            alignItems="center"
            onPress={() => handleButtonPress()}
            width={'$full'}
          >
            <Text color="#FFFFFF" bold={true}>
              Start
            </Text>
          </Button>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input_normal: {
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },

  input_multiline: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 5,
  },
  button: {
    backgroundColor: "#CE3762",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});
