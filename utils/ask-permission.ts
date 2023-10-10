import * as Permissions from "expo-permissions";

export const getMicrophonePermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
  if (status !== "granted") {
    console.error("Microphone permission not granted");
  }
};

export const getStoragePermission = async () => {
  const { status } = await Permissions.askAsync(
    Permissions.MEDIA_LIBRARY_WRITE_ONLY
  );
  if (status !== "granted") {
    console.error("Storage permission not granted");
  }
};
