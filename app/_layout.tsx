import React, { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { View, Text, useColorScheme } from "react-native";
import { TransitionPresets } from "@react-navigation/stack";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [errorState, setErrorState] = useState<Error | null>(null);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch((e) => {
        console.error("Error hiding splash screen:", e);
        setErrorState(e instanceof Error ? e : new Error(String(e)));
      });
    }
  }, [loaded]);

  useEffect(() => {
    if (error) {
      console.error("Error loading fonts:", error);
      setErrorState(error);
    }
  }, [error]);

  if (errorState) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>An error occurred: {errorState.message}</Text>
      </View>
    );
  }

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              ...TransitionPresets.SlideFromRightIOS,
              // Uncomment below for a fade transition instead
              // cardStyleInterpolator: ({ current: { progress } }) => ({
              //   cardStyle: {
              //     opacity: progress.interpolate({
              //       inputRange: [0, 1],
              //       outputRange: [0, 1],
              //     }),
              //   },
              // }),
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Something went wrong: {this.state.error?.message}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}
