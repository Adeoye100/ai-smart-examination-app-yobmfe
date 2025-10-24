
import "react-native-reanimated";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNetworkState } from "expo-network";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { AppProvider } from "@/contexts/AppContext";
import { Button } from "@/components/button";
import { useColorScheme, Alert } from "react-native";
import React, { useEffect } from "react";
import { SystemBars } from "react-native-edge-to-edge";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const { isConnected } = useNetworkState();

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <WidgetProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <SystemBars style={colorScheme === "dark" ? "light" : "dark"} />
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="upload" options={{ presentation: 'modal', headerShown: true, title: 'Upload Material' }} />
              <Stack.Screen name="exam-config" options={{ presentation: 'modal', headerShown: true, title: 'Configure Exam' }} />
              <Stack.Screen name="exam" options={{ headerShown: true, title: 'Exam' }} />
              <Stack.Screen name="results" options={{ headerShown: true, title: 'Results' }} />
            </Stack>
          </ThemeProvider>
        </WidgetProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
