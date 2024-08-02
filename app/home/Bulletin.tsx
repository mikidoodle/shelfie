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
import { Divider, Icon } from "@rneui/themed";
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
type Review = {
  title: string;
  content: string;
  meta: {
    title: string;
    authors: string;
    etag: string;
  };
  username: string;
  uuid: string;
};
export default function Bulletin() {
  let [searchQuery, setSearchQuery] = useState<string>("");
  let [myISBNs, setMyISBNs] = useState<string[]>([]);
  let [searchResults, setSearchResults] = useState<Review[]>([]);
  useEffect(() => {
    searchBooks();
  }, []);
  async function searchBooks() {
    let uuid = await get("uuid");
    setSearchResults([]);
    fetch(`http://localhost:3000/api/getReviews`, {
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
        if (data.reviews.length === 0) {
          setSearchResults([
            {
              title: "No reviews",
              content:
                "Add books to your library by scanning the barcode on the back of the book",
              meta: {
                title: "",
                authors: "",
                etag: "404shelfieerror",
              },
              username: "",
              uuid: "",
            },
          ]);
          return;
        }
        let reviewResults: Review[] = [];
        setMyISBNs(data.isbns);
        data.reviews.map((review: any) => {
          var reviewData: Review = {
            title: review.title,
            content: review.content,
            meta: {
              title: review.meta.title,
              authors: review.meta.authors || "",
              etag: review.meta.etag || "",
            },
            username: review.username,
            uuid: review.uuid,
          };
          reviewResults.push(reviewData);
        });
        setSearchResults(reviewResults);
      });
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
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.title}>explore</Text>
                <Pressable onPress={searchBooks}>
                  <Icon
                    name="sync"
                    type="octicon"
                    size={26}
                    style={styles.titleIcon}
                    color={"black"}
                  />
                </Pressable>
              </View>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: "90%",
                }}
              >
                {searchResults.length > 0 ? (
                  searchResults.map((review: Review, index: number) =>
                    review.meta.etag !== "404shelfieerror" ? (
                      <View
                        style={{
                          backgroundColor: "white",
                          margin: 10,
                          borderRadius: 9,
                          width: 325,
                        }}
                        key={index}
                      >
                        <View
                          style={{
                            padding: 10,
                            shadowColor: "#37B7C3",
                          }}
                        >
                          <Text>
                            <Text
                              style={{
                                fontSize: 17,
                                fontWeight: "bold",
                                color: "#37B7C3",
                              }}
                            >
                              {review.username}
                            </Text>{" "}
                            read:
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "bold",
                            }}
                          >
                            {review.meta.title}
                          </Text>
                          {review.meta.etag !== "" ? (
                            <Image
                              source={{
                                uri: `https://covers.openlibrary.org/b/isbn/${review.meta.etag}-M.jpg`,
                              }}
                              style={{
                                width: "100%",
                                height: 200,
                                marginTop: 10,
                                marginBottom: 10,
                                borderRadius: 9,
                                resizeMode: "cover",
                              }}
                            />
                          ) : null}
                          <Text
                            style={{
                              fontSize: 20,
                              fontWeight: "bold",
                            }}
                          >
                            {review.title}
                          </Text>
                          <Text>{review.content}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              gap: 10,
                              margin: 5
                            }}
                          >
                            <Icon
                              name="pencil"
                              type="octicon"
                              size={26}
                              style={styles.titleIcon}
                              color={"black"}
                            />
                            <Icon
                              name={`bookmark`}
                              type="octicon"
                              size={26}
                              style={styles.titleIcon}
                              color={myISBNs.includes(review.meta.etag) ? "grey" : "black"}
                            />
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          margin: 10,
                          marginTop: 50,
                          borderRadius: 9,
                          width: 325,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                          }}
                        >
                          No reviews yet!
                        </Text>
                        <Text>
                          {" "}
                          Write one of your own from the home screen!
                        </Text>
                      </View>
                    )
                  )
                ) : (
                  <View
                    style={{
                      margin: 10,
                      marginTop: 50,
                      borderRadius: 9,
                      width: 325,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                      Loading...
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </ScrollView>
    </ImageBackground>
  );
}
