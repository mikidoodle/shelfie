import { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ImageBackground,
  Pressable,
  Alert,
} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
let gradient = require("../../../assets/images/homeScreen.png");
import { Icon } from "@rneui/themed";
import * as SecretStore from "@/components/SecretStore";
import styles from "../../../assets/styles/style";
import { APIEndpoint, Book } from "@/components/Types";
const Stack = createNativeStackNavigator();

export default function Start({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  let [nextSwipeLoading, setNextSwipeLoading] = useState<boolean>(false);
  async function startSwiping() {
    setNextSwipeLoading(true);
    let uuid = await SecretStore.get("uuid");
    fetch(`https://shelfie.pidgon.com/api/getSwipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uuid: uuid,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        if(response.error) {
          navigation.navigate("SwipeScreen", {
            bookData: {},
            swipeSuggestionsData: {},
            currentIndexData: 1000
          });
          return;
        }
        let swipeSuggestionsUF = JSON.parse(response.message);
        let swipeSuggestions: any = [];
        for (let i = 0; i < swipeSuggestionsUF.length; i++) {
          swipeSuggestions.push({ title: swipeSuggestionsUF[i], feedback: "" });
        }
        console.log(
          `https://openlibrary.org/search.json?title=${encodeURIComponent(
            swipeSuggestions[0].title
          )}`
        );
        fetch(
          `https://openlibrary.org/search.json?title=${encodeURIComponent(
            swipeSuggestions[0].title
          )}&fields=title,first_sentence,cover_edition_key,author_name,subject&limit=1&lang=en`
        )
          .then((response) => response.json())
          .then((response) => {
            setNextSwipeLoading(false);
            let book = response.docs[0];
            let category = Object.keys(book).includes("subject")
              ? book.subject
              : [];
            category = category.slice(0, 3);
            var bookInfo: Book = {
              title: book.title,
              authors: Object.keys(book).includes("author_name")
                ? book.author_name[0]
                : "",
              description: Object.keys(book).includes("first_sentence")
                ? book.first_sentence[0]
                : "No description available",
              etag: Object.keys(book).includes("cover_edition_key")
                ? book.cover_edition_key
                : "",
              category: category.join(", "),
            };

            navigation.navigate("SwipeScreen", {
              bookData: bookInfo,
              swipeSuggestionsData: swipeSuggestions,
              currentIndexData: 0
            });
          });
      })
      .catch((e) => {
        setNextSwipeLoading(false);
        console.log(e);
        Alert.alert("An error occurred. Please try again later.");
      });
  }

  return (
    <ImageBackground
      source={gradient}
      style={styles.image}
      imageStyle={{ opacity: 0.6 }}
    >
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>welcome to swipes!</Text>
          <View
            style={{
              flexDirection: "column",
              gap: 10,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 20 }}>
              <Icon
                name="heart-fill"
                type="octicon"
                size={20}
                style={{
                  verticalAlign: "middle",
                  margin: 5,
                  position: "relative",
                  top: 5,
                }}
                color={"red"}
              />
              to like a book
            </Text>
            <Text style={{ fontSize: 20 }}>
              <Icon
                name="x-circle-fill"
                type="octicon"
                size={20}
                style={{
                  verticalAlign: "middle",
                  margin: 5,
                  position: "relative",
                  top: 5,
                }}
                color={"black"}
              />
              to dislike a book
            </Text>
            <Text style={{ fontSize: 20 }}>
              <Icon
                name="no-entry"
                type="octicon"
                size={20}
                style={{
                  verticalAlign: "middle",
                  margin: 5,
                  marginRight: 7,
                  position: "relative",
                  top: 5,
                }}
                color={"black"}
              />
              to pass
            </Text>
            <Pressable onPress={startSwiping} disabled={nextSwipeLoading}>
              <View
                style={{
                  backgroundColor: nextSwipeLoading ? "grey" : "black",
                  padding: 10,
                  borderRadius: 25,
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: "white",
                    alignContent: "center",
                    margin: "auto",
                  }}
                >
                  {nextSwipeLoading
                    ? "loading today's swipes..."
                    : "start swiping!"}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
