import { Stack } from "expo-router";

import '../global.css'

export default function RootLayout() {
  return <Stack screenOptions={{headerShown: false}}>
    <Stack.Screen name="index" options={{title: "home"}} />
    <Stack.Screen name="quiz" options={{title: "quiz"}} />
    <Stack.Screen name="+not-found" />
  </Stack>;
}
