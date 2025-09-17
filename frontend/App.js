
import { StatusBar } from 'expo-status-bar';

import './global.css';
import { View } from 'react-native';
import { Dimensions } from "react-native";





export default function App() {
const { width, height } = Dimensions.get("window");
const orientation = width > height ? "landscape" : "portrait";
return (
    <>
      {orientation === "landscape" ? (
        <View className="bg-blue-200 gap-2 flex-1 h-[100%] outline-8 m-2 px-2 py-4" >
       
        </View>
      ) : (
         <View className="bg-blue-100 flex-1">
         

         </View>
      )}
    </>
  );
}