import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import ResponsiveImage from "./ResponsiveImage";
export default function LibraryItem(props: any) {
  let [title, setTitle] = useState<string>("");
  let [authors, setAuthors] = useState<string>("");
  let [description, setDescription] = useState<string>("");
  async function loadData() {
    let book = await AsyncStorage.getItem(`@shelfie:${props.etag}`);
    let bookObject = book ? JSON.parse(book) : null;
    setTitle(bookObject.title);
    setAuthors(bookObject.authors);
    setDescription(bookObject.description);
  }
  useEffect(() => {
    loadData();
  }, []);
  return (
    <View
      style={{
        backgroundColor: "white",
        margin: 10,
        borderRadius: 9,
        width: 325,
      }}
    >
      <ResponsiveImage
        url={`https://covers.openlibrary.org/b/olid/${props.etag}-M.jpg`}
        style={{
          width: 325,
          height: 150,
          borderTopLeftRadius: 9,
          borderTopRightRadius: 9,
        }}
      />
      <View
        style={{
          padding: 10,
          shadowColor: "#37B7C3",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: "Menlo",
            textTransform: "uppercase",
            paddingBottom: 5,
            paddingTop: 5,
          }}
        >
          {authors}
        </Text>
        <Text>{description}</Text>
      </View>
    </View>
  );
}
