import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Button,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ImageBackground,
  Image,
  Pressable,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Link, router } from "expo-router";
let gradient = require("../../../assets/images/homeScreen.png");
import * as SecureStore from "expo-secure-store";
import { Icon } from "@rneui/themed";
import styles from "../../../assets/styles/style";
import Settings from "../Settings";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function get(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}
type Book = {
  title: string;
  authors: string;
  description: string;
  etag: string;
  category: string[];
};

const Stack = createNativeStackNavigator();

export default function SwipeScreen({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  let { book, swipeSuggestions, currentIndex } = route.params;
  let [nextSwipeLoading, setNextSwipeLoading] = useState<number>(0);
  console.log(swipeSuggestions);
  async function loadNextBook(feedback: string) {
    if (currentIndex === swipeSuggestions.length - 1) {
      setNextSwipeLoading(1);
      swipeSuggestions[currentIndex].title = book.title;
      swipeSuggestions[currentIndex].feedback = feedback;
      swipeSuggestions[currentIndex] = JSON.stringify(swipeSuggestions[currentIndex]);
      let uuid = await get("uuid");
      fetch(`http://localhost:3000/api/saveSwipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: uuid,
          swipes: JSON.stringify(swipeSuggestions),
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.error === false) {
            setNextSwipeLoading(2);
          }
        });
    } else {
      console.log("loading next book");
      setNextSwipeLoading(1);
      console.log(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(
          swipeSuggestions[currentIndex + 1].title
        )}`
      );
      fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(
          swipeSuggestions[currentIndex + 1].title
        )}&fields=title,first_sentence,cover_edition_key,author_name,subject&limit=2&language=eng`
      )
        .then((response) => response.json())
        .then((response) => {
          let book = response.docs[0];
          let category = Object.keys(book).includes("subject") ? book.subject : [];
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
          swipeSuggestions[currentIndex].title = book.title;
          swipeSuggestions[currentIndex].feedback = feedback;
          //stringify current index
          swipeSuggestions[currentIndex] = JSON.stringify(swipeSuggestions[currentIndex]);
          setNextSwipeLoading(0);
          navigation.navigate("SwipeScreen", {
            book: bookInfo,
            swipeSuggestions: swipeSuggestions,
            currentIndex: currentIndex + 1,
          });
        });
    }
  }
  return (
    <ImageBackground
      source={gradient}
      style={styles.image}
      imageStyle={{ opacity: 0.6 }}
    >
      <SafeAreaView style={styles.container}>
        <Text
          style={{
            fontSize: 32,
            color: "black",
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          swipe
        </Text>
        {nextSwipeLoading === 1 ? (
          <View
            style={{
              height: "75%",
              width: "90%",
              margin: "auto",
              backgroundColor: "#f8f8f8",
              borderColor: "white",
              borderWidth: 2,
              borderRadius: 20,
              marginBottom: 10,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>Loading...</Text>
          </View>
        ) : nextSwipeLoading === 2 ? (
          <View
            style={{
              height: "75%",
              width: "90%",
              margin: "auto",
              backgroundColor: "#f8f8f8",
              borderColor: "white",
              borderWidth: 2,
              borderRadius: 20,
              marginBottom: 10,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{
              fontSize: 34,
              fontWeight: "bold",
              textAlign: 'center'
            }}>Today's swipes are done!</Text>
            <Text>Check back tomorrow for more.</Text>
          </View>
        ) : (
          <>
            <ScrollView
              style={{
                height: "80%",
                width: "90%",
                margin: "auto",
                backgroundColor: "#f8f8f8",
                borderColor: "white",
                borderWidth: 2,
                borderRadius: 25,
                marginBottom: 10,
              }}
            >
              <Text style={styles.title}>{book.title}</Text>
              {book.etag !== "" ? (
                <Image
                  source={{
                    uri: `https://covers.openlibrary.org/b/olid/${book.etag}-L.jpg`,
                  }}
                  style={{
                    width: "auto",
                    height: 200,
                    resizeMode: "contain",
                    margin: 10,
                    marginLeft: 0,
                    marginRight: 0,
                  }}
                />
              ) : null}
              <View
                style={{
                  margin: 20,
                  marginTop: 0,
                  flexDirection: "column",
                  gap: 20,
                }}
              >
                <Text style={{ fontSize: 20 }}>{book.authors}</Text>
                <Text style={{ fontSize: 20 }}>{book.category}</Text>
                <Text style={{ fontSize: 20 }}>{book.description}</Text>
              </View>
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "80%",
              }}
            >
              <Pressable
                style={{
                  borderRadius: 50,
                  backgroundColor: "#f8f8f8",
                  borderColor: "white",
                  borderWidth: 1,
                  padding: 5,
                }}
                onPress={() => {
                  loadNextBook("dislike");
                }}
              >
                <Icon
                  name="x-circle-fill"
                  type="octicon"
                  size={32}
                  style={{
                    verticalAlign: "middle",
                    margin: 5,
                  }}
                  color={"grey"}
                />
              </Pressable>

              <Pressable
                style={{
                  borderRadius: 50,
                  backgroundColor: "#f8f8f8",
                  borderColor: "white",
                  borderWidth: 1,
                  padding: 5,
                }}
                onPress={() => {
                  loadNextBook("neutral");
                }}
              >
                <Icon
                  name="feed-repo"
                  type="octicon"
                  size={32}
                  style={{
                    verticalAlign: "middle",
                    margin: 5,
                  }}
                  color={"black"}
                />
              </Pressable>
              <Pressable
                style={{
                  borderRadius: 50,
                  backgroundColor: "#f8f8f8",
                  borderColor: "white",
                  borderWidth: 2,
                  padding: 5,
                }}
                onPress={() => {
                  loadNextBook("like");
                }}
              >
                <Icon
                  name="feed-heart"
                  type="octicon"
                  size={32}
                  style={{
                    verticalAlign: "middle",
                    margin: 5,
                  }}
                  color={"red"}
                />
              </Pressable>
            </View>
          </>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}
