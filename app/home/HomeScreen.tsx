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
import * as SecretStore from "@/components/SecretStore";
import { Icon } from "@rneui/themed";
import { Book } from "@/components/Types";
import styles from "../../assets/styles/style";
import GestureRecognizer from "react-native-swipe-gestures";
import ResponsiveImage from "@/components/ResponsiveImage";
import * as LibraryStore from "../../components/LibraryStore";
import AddToShelf from "@/components/AddToShelf";
import { router } from "expo-router";


export default function HomeScreen() {
  let [searchQuery, setSearchQuery] = useState<string>("");
  let [isSearching, setIsSearching] = useState<boolean>(false);
  let [username, setUsername] = useState<any>("");
  let [uuid, setUUID] = useState<any>("");
  let [searchResults, setSearchResults] = useState<Book[]>([]);
  let [modalVisible, setModalVisible] = useState(false);
  let [modalContent, setModalContent] = useState<ReactElement>();
  let [reviewTitle, setReviewTitle] = useState<string>("");
  let [reviewContent, setReviewContent] = useState<string>("");
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
        });
    } else {
      setSearchResults([]);
    }
  }

  useEffect(() => {
    (async () => {
      let uuidC = await SecretStore.get("uuid");
      let usernameC = await SecretStore.get("username");
      setUsername(usernameC);
      setUUID(uuidC);
    })();
  }, []);

  async function submitReview(book: Book) {
    var res = await fetch("http://localhost:3000/api/addReview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: reviewTitle,
        content: reviewContent,
        book: book,
        uuid: uuid,
        username: username,
      }),
    });
    let data = await res.json();
    if (data.error) {
      Alert.alert(data.message);
      return;
    } else {
      Alert.alert(data.message);
      setModalVisible(false);
    }
  }
  const startReview = async (book: Book) => {
   /* setModalContent(
      modal content was here
    );*/
    setModalVisible(true);
  };
  async function addISBN(book: Book) {
    await LibraryStore.storeBook(book.etag, book);
    Alert.alert("Book added to shelf!");
    /* fetch("http://localhost:3000/api/addISBN", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isbn: encodeURIComponent(
          JSON.stringify({
            title: book.title,
            authors: book.authors,
            description: book.description,
            etag: book.etag,
            category: book.category,
          })
        ),
        uuid: uuidC,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          Alert.alert(data.message);
          return;
        } else {
          Alert.alert(data.message);
        }
      });*/
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
          {/*modal was here*/}
          <ScrollView>
            <SafeAreaView style={styles.container}>
              <View>
                <Text style={styles.title}>shelfie!</Text>
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
                          <View
                            style={{
                              backgroundColor: "white",
                              margin: 10,
                              borderRadius: 9,
                              width: "90%",
                            }}
                            key={index}
                          >
                            {book.etag !== "" ? (
                              <ResponsiveImage
                                url={`https://covers.openlibrary.org/b/olid/${book.etag}-M.jpg`}
                                style={{
                                  width: "100%",
                                  height: 150,
                                  margin: "auto",
                                  borderTopLeftRadius: 9,
                                  borderTopRightRadius: 9,
                                }}
                              />
                            ) : null}
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
                                {book.title}
                              </Text>
                              <Text
                                style={{
                                  fontFamily: "Menlo",
                                  textTransform: "uppercase",
                                  paddingBottom: 5,
                                  paddingTop: 5,
                                }}
                              >
                                {book.authors}
                              </Text>
                              <Text>{book.description}</Text>
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                gap: 5,
                                borderBottomLeftRadius: 9,
                                borderBottomRightRadius: 9,
                                borderWidth: 2,
                                borderColor: "#37B7C3",
                              }}
                            >
                              <Pressable
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  gap: 5,
                                  margin: 10,
                                }}
                                onPress={() => router.push({
                                  pathname: "/review",
                                  params: { bookObject: JSON.stringify(book) }
                                })}
                              >
                                <Icon
                                  name="pencil"
                                  type="octicon"
                                  size={20}
                                  style={{
                                    verticalAlign: "middle",
                                    marginTop: 2,
                                  }}
                                  color={"#37B7C3"}
                                />
                                <Text
                                  style={{
                                    fontSize: 20,
                                    color: "#37B7C3",
                                  }}
                                >
                                  review
                                </Text>
                              </Pressable>
                              <View
                                style={{
                                  height: "100%",
                                  width: 2,
                                  backgroundColor: "#37B7C3",
                                }}
                              />
                              <AddToShelf book={book} />
                            </View>
                          </View>
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
