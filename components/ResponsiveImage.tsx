import { useState } from "react";
import { View, Text, Image, Pressable, Alert } from "react-native";

type PropItem = {
  url: string;
  style: object;
};
export default function ResponsiveImage(props: PropItem) {
  let [resizeMode, setResizeMode] = useState(false);
  return ( 
    <Pressable onPress={()=>{setResizeMode(!resizeMode)}}>
      <Image
        source={{
          uri: props.url,
        }}
        style={{
          ...props.style,
          resizeMode: resizeMode ? "contain" : "cover",
        }}
      />
    </Pressable>
  );
}
