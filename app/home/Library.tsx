import { useEffect, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  Pressable,
} from "react-native";
let gradient = require("../../assets/images/homeScreen.png");

import { Icon } from "@rneui/themed";
import styles from "../../assets/styles/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LibraryItem from "@/components/LibraryItem";

export default function Library() {
  let [searchResults, setSearchResults] = useState<string[]>([]);
  useEffect(() => {
    searchBooks();
  }, []);
  async function searchBooks() {
    setSearchResults([]);
    let bookList = await AsyncStorage.getItem(`@shelfie:booklist`);
    let parsedBookList = bookList ? bookList.split(",") : [];
    console.log(parsedBookList);
    if (parsedBookList.length === 0) {
      setSearchResults(["404shelfieerror"]);
    } else {
      let mapSearchResults: string[] = [];
      parsedBookList.map((etag: string) => {
        mapSearchResults.push(etag);
      });
      setSearchResults(mapSearchResults);
    }
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
                <Text style={styles.title}>shelf</Text>
                <Pressable
                  onPress={() => {
                    setSearchResults([]);
                    searchBooks();
                  }}
                >
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
                  searchResults.map((etag: string, index: number) =>
                    etag !== "404shelfieerror" ? (
                      <LibraryItem etag={etag} key={index} />
                    ) : (
                      <View
                        style={{
                          margin: 10,
                          marginTop: 50,
                          borderRadius: 9,
                          width: 325,
                          alignItems: "center",
                        }}
                        key={0}
                      >
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "bold",
                          }}
                        >
                          No books in your library.
                        </Text>
                        <Text> Add one from the home screen!</Text>
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
                      Loading library...
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
