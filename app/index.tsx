import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Index() {
  const router = useRouter();
  const [numQuestions, setNumQuestions] = useState<number>(5);
  
  return (
    <View
      className="flex gap-7 justify-center items-center w-screen h-screen bg-white"
    >
        <Pressable
          className="bg-gray-500 p-7 rounded-3xl"
          onPress={() => {router.push({pathname: "/quiz", params: {data: numQuestions}})}}
        >
          <Text className="text-5xl text-white">Start Quiz</Text>
        </Pressable>
      <View style={{display:"flex", flexDirection: "row", alignItems:"center", gap: 20}}>
        <Pressable onPress={() => {if (numQuestions>1) setNumQuestions((e)=> e - 1)}}><AntDesign name="left" size={70} color="black" /></Pressable>
        <Text style={styles.text} >{numQuestions}</Text>
        <Pressable onPress={() => {if (numQuestions<20) setNumQuestions((e) => e + 1)}}><AntDesign name="right" size={70} color='black' /></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: { 
    padding: 20, 
    fontSize: 50, 
    textAlign: "center",
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20, 
  }
})
