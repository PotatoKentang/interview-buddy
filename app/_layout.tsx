import { GluestackUIProvider, config } from "@gluestack-ui/themed";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import InterviewHeader from "../components/interview-header";
export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SatoshiBlack: require("../assets/fonts/Satoshi-Black.otf"),
    SatoshiBlackItalic: require("../assets/fonts/Satoshi-BlackItalic.otf"),
    SatoshiBold: require("../assets/fonts/Satoshi-Bold.otf"),
    SatoshiBoldItalic: require("../assets/fonts/Satoshi-BoldItalic.otf"),
    SatoshiLight: require("../assets/fonts/Satoshi-Light.otf"),
    SatoshiLightItalic: require("../assets/fonts/Satoshi-LightItalic.otf"),
    SatoshiMedium: require("../assets/fonts/Satoshi-Medium.otf"),
    SatoshiMediumItalic: require("../assets/fonts/Satoshi-MediumItalic.otf"),
    // ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <GluestackUIProvider config={config.theme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="interview/[id]"
          options={{
            header: () => <InterviewHeader type="home" title="Interview"/>,
          }}
        />
        <Stack.Screen
          name="interview/interview-type"
          options={{
            header: () => <InterviewHeader type="back" title="Interview Type"/>,
          }}
        />
        <Stack.Screen
          name="interview/interview-profile"
          options={{
            header: ()=><InterviewHeader type="back" title="Setup Interview Profile"/>,
          }}
        />
        <Stack.Screen
          name="interview/recent-interviews"
          options={{
            header: ()=><InterviewHeader type="back" title="Recent Interviews"/>,
          }}
        />
        <Stack.Screen
          name="interview/bulk/index"
          options={{
            header: ()=><InterviewHeader type="back" title="List Of Questions"/>,
          }}
        />
        <Stack.Screen
          name="interview/bulk/[id]"
          options={{
            headerShown:false,
            presentation: 'modal',
            gestureEnabled: true
          }}
        />
      </Stack>
    </GluestackUIProvider>
  );
}
