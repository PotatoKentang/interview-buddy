import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "@gluestack-ui/themed";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useInterviewStore from "../store/interview";
import useSoundStore from "../store/sound";
import {
  getDataFromLocalStorage,
  storeDataToLocalStorage,
} from "../utils/local-storage";
export default function InterviewHeader({
  type,
  title,
}: {
  type: string;
  title: string;
}) {
  const { id } = useLocalSearchParams();
  const setAdditionalInformation = useInterviewStore(
    (state) => state.setAdditionalInformation
  );
  const stopSound = useSoundStore((state) => state.stopSound);
  const setPromptInformation = useInterviewStore(
    (state) => state.setPromptInformation
  );
  const promptInformation = useInterviewStore(
    (state) => state.promptInformation
  );
  const setInterview = useInterviewStore((state) => state.setInterview);
  const interview = useInterviewStore((state) => state.interview);
  const saveAndReturn = async () => {
    if (type == "back") {
      router.back();
      return;
    }
    const dataHistory = (await getDataFromLocalStorage()) || [];
    const existingDataIndex = dataHistory.findIndex(
      (item: any) => item.id === id
    );
    const data = {
      id,
      interview,
      promptInformation,
    };

    if (existingDataIndex !== -1) {
      // If data with the same id exists, update it
      dataHistory[existingDataIndex] = data;
    } else {
      // If data with the same id doesn't exist, add it
      dataHistory.push(data);
    }
    const newLocalStorage = JSON.stringify(dataHistory);
    console.log(newLocalStorage);
    await storeDataToLocalStorage(newLocalStorage);
    const checkIfSaved = await getDataFromLocalStorage();
    console.log(checkIfSaved);
    setInterview([]);
    setPromptInformation();
    stopSound();
    setAdditionalInformation(null);
    router.replace("/");
  };
  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "2%",
          shadowColor: "#000000",
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
          elevation: 4,
        }}
      >
        <AntDesign
          name="caretleft"
          size={12}
          color="white"
          style={{
            padding: 10,
            backgroundColor: "#141414",
            borderRadius: 5,
            alignItems: "center",
          }}
          onPress={() => saveAndReturn()}
        />
        <Text style={{ fontWeight: "bold" }}>{title}</Text>
        <AntDesign
          name="caretleft"
          size={24}
          color="black"
          style={{ opacity: 0 }}
        />
      </View>
    </SafeAreaView>
  );
}
