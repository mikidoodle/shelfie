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
import { Link, router } from "expo-router";
let gradient = require("../../assets/images/homeScreen.png");
import * as SecureStore from "expo-secure-store";
import { Icon } from "@rneui/themed";
import styles from "../../assets/styles/style";

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
//create a type for the book
type Swipe = {
  title: string;
  feedback: string;
};
export default function Swipe() {
  let [swipes, setSwipes] = useState<Swipe[]>([]);
  let [suggestedSwipes, setSuggestedSwipes] = useState<string[]>([]);
  let [suggestedSwipeOutput, setSuggestedSwipeOutput] = useState<any>(ShowSuggestedSwipes);
  useEffect(() => {
    getSwipes();
  }, [suggestedSwipes]);

  async function getSuggestedSwipes() {
    let uuid = await get("uuid");
    fetch(`http://localhost:3000/api/getSwipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uuid: uuid,
        swipes: JSON.stringify(swipes),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        var suggestions = JSON.parse(data.message);
        setSuggestedSwipes(suggestions);
      });
  }

  async function getSwipes() {
    let uuid = await get("uuid");
    setSwipes([]);
    fetch(`http://localhost:3000/api/swipes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uuid: uuid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        let swipeData = JSON.parse(data.swipes);
        if (swipeData.length === 0) {
          setSwipes([
            {
              title: "No swipes",
              feedback: "You have no swipes",
            },
          ]);
        } else {
          setSwipes(swipeData);
        }
      });
  }
  async function ShowSuggestedSwipes(index: number = 0) {
    let suggestedSwipeResult = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(
        suggestedSwipes[index]
      )}`
    );
    let suggestedSwipeData = await suggestedSwipeResult.json();
    let suggestedSwipe = suggestedSwipeData.docs[0];
    console.log(suggestedSwipeData.docs[0])
    return <FormatSuggestedSwipeData suggestedSwipe={suggestedSwipe} currentIndex={index} />;
  }

  function FormatSuggestedSwipeData(suggestedSwipe: any, currentIndex: number) {
    return (
      <View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: '80%', height: '80%' }}>

        <Text style={{ fontSize: 20 }}>{suggestedSwipe.title}</Text>
        <Text style={{ fontSize: 20 }}>
          {Object.keys(suggestedSwipe).includes("author_name")
            ? suggestedSwipe.author_name[0]
            : ""}
        </Text>
        <Text style={{ fontSize: 20 }}>
          {Object.keys(suggestedSwipe).includes("first_sentence")
            ? suggestedSwipe.first_sentence[0]
            : "No description available"}
        </Text>
      </View>
      <Button title="Next" onPress={() => setSuggestedSwipeOutput(ShowSuggestedSwipes(currentIndex+1))} />
      </View>
    );
  }
  return (
    <ImageBackground
      source={gradient}
      style={styles.image}
      imageStyle={{ opacity: 0.6 }}
    >
      <ScrollView>
        <SafeAreaView style={styles.container}>
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {suggestedSwipes.length === 0 ? (
                swipes.map((swipe, index) => {
                  return swipe.title === "No swipes" ? (
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        transform: [{ translateY: 200 }],
                      }}
                      key={index}
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
                          swipe right to like a book
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
                          swipe left to dislike a book
                        </Text>
                        <Text style={{ fontSize: 20 }}>
                          <Icon
                            name="bookmark"
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
                          swipe up to save a book
                        </Text>
                        <Pressable onPress={getSuggestedSwipes}>
                          <View
                            style={{
                              backgroundColor: "black",
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
                              Start swiping!
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    </View>
                  ) : null;
                })
              ) :  suggestedSwipeOutput}
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
}
