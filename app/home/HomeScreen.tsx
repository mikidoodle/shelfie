import { ReactElement, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ImageBackground,
  Pressable,
} from "react-native";
let gradient = require("../../assets/images/homeScreen.png");
import { Icon } from "@rneui/themed";
import { Book } from "@/components/Types";
import styles from "../../assets/styles/style";
import GestureRecognizer from "react-native-swipe-gestures";
import ResponsiveImage from "@/components/ResponsiveImage";
import AddToShelf from "@/components/AddToShelf";
import { router } from "expo-router";
import SearchItem from "@/components/SearchItem";

export default function HomeScreen() {
  let [searchQuery, setSearchQuery] = useState<string>("");
  let [isSearching, setIsSearching] = useState<boolean>(false);
  let [searchResults, setSearchResults] = useState<Book[]>([]);
  let [modalVisible, setModalVisible] = useState(false);
  function searchBooks(query: string) {
    if (query.length > 0) {
      console.log("search: accepted");
      setIsSearching(true);
      setSearchResults([]);
      fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          query
        )}&lang=en&fields=title,first_sentence,cover_edition_key,author_name,subject&limit=20`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("search: data");
          let mapSearchResults: Book[] = [];
          data.docs.map((book: any) => {
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
              category: book.subject || [],
            };
            mapSearchResults.push(bookInfo);
          });
          if (mapSearchResults.length === 0) {
            mapSearchResults.push({
              title: "No results found",
              authors: "",
              description: "Try searching for something else!",
              etag: "404shelfieerror",
              category: [],
            });
          }
          setSearchResults(mapSearchResults);
          setIsSearching(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setSearchResults([
            {
              title: "You're offline!",
              authors: "",
              description: "Connect to the internet to search for books.",
              etag: "404shelfieerror",
              category: [],
            },
          ]);
          setIsSearching(false);
        })
    } else {
      setSearchResults([]);
    }
  }
  return (
    <ImageBackground
      source={gradient}
      style={styles.image}
      imageStyle={{ opacity: 0.6 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <GestureRecognizer
          onSwipeDown={() => {
            if (modalVisible) {
              setModalVisible(false);
            }
          }}
          style={{
            flex: 1,
          }}
        >
          <ScrollView>
            <SafeAreaView style={styles.container}>
              <View>
                <Pressable
                  onPress={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <Text style={styles.title}>shelfie!</Text>
                </Pressable>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    margin: "auto",
                    width: "100%",
                    backgroundColor: "white",
                    borderRadius: 9,
                    shadowColor: "#37B7C3",
                    shadowRadius: 20,
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0.5,
                  }}
                >
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Type in a book name!"
                    onChangeText={(text) => setSearchQuery(text)}
                    value={searchQuery}
                    onSubmitEditing={
                      isSearching
                        ? () => {}
                        : () => {
                            setSearchResults([]);
                            searchBooks(searchQuery);
                          }
                    }
                  />
                  <Pressable
                    style={{
                      borderRadius: 0,
                      borderLeftWidth: 2,
                      borderColor: "lightgrey",
                      borderBottomRightRadius: 9,
                      borderTopRightRadius: 9,
                      padding: 10,
                      backgroundColor: isSearching ? "#f8f8f8" : "white",
                    }}
                    disabled={isSearching}
                    onPress={() => {
                      setSearchResults([]);
                      searchBooks(searchQuery);
                    }}
                  >
                    <Icon
                      name="search"
                      type="octicon"
                      size={24}
                      style={{ verticalAlign: "middle", marginTop: 2 }}
                      color={isSearching ? "lightgrey" : "black"}
                    />
                  </Pressable>
                </View>
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  {searchResults.length > 0 && searchQuery !== ""
                    ? searchResults.map((book: Book, index: number) =>
                        book.etag !== "404shelfieerror" ? (
                          <SearchItem book={book} key={index} />
                        ) : (
                          <View
                            style={{
                              marginTop: 50,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 22,
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              {book.title}
                            </Text>
                            <Text style={{ textAlign: "center" }}>
                              {book.description}
                            </Text>
                          </View>
                        )
                      )
                    : null}
                </View>
              </View>
            </SafeAreaView>
          </ScrollView>
        </GestureRecognizer>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}
