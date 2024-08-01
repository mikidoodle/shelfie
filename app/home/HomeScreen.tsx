import { ReactElement, useEffect, useState } from "react";
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
  Modal,
} from "react-native";
import { Link, router } from "expo-router";
let gradient = require("../../assets/images/homeScreen.png");
import * as SecureStore from "expo-secure-store";
import { Icon } from "@rneui/themed";
import styles from "../../assets/styles/style";
import GestureRecognizer from "react-native-swipe-gestures";

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
type Book = {
  title: string;
  authors: string;
  description: string;
  etag: string;
  category: string[];
};

export default function HomeScreen() {
  let [searchQuery, setSearchQuery] = useState<string>("");
  let [username, setUsername] = useState<any>("");
  let [uuid, setUUID] = useState<any>("");
  let [searchResults, setSearchResults] = useState<Book[]>([]);
  let [modalVisible, setModalVisible] = useState(false);
  let [modalContent, setModalContent] = useState<ReactElement>();
  let [reviewTitle, setReviewTitle] = useState<string>("");
  let [reviewContent, setReviewContent] = useState<string>("");
  function searchBooks(query: string) {
    if (query.length > 0) {
      setSearchResults([]);
      fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(
          query
        )}&fields=title,first_sentence,isbn,author_name,subject&limit=50&lang=en`
      )
        .then((response) => response.json())
        .then((data) => {
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
              etag: Object.keys(book).includes("isbn") ? book.isbn[0] : "",
              category: book.subject || [],
            };
            mapSearchResults.push(bookInfo);
          });
          setSearchResults(mapSearchResults);
        });
    } else {
      setSearchResults([]);
    }
  }

  useEffect(() => {
    (async () => {
      let uuidC = await get("uuid");
      let usernameC = await get("username");
        setUsername(usernameC);
        setUUID(uuidC);
    })();
  }, []);

  function submitReview(book: Book) {

    fetch("http://localhost:3000/api/addReview", {
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
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          Alert.alert(data.message);
          return;
        } else {
          Alert.alert(data.message);
          //TODO: navigate to review thru data.postuuid
          setReviewContent("");
          setReviewTitle("");
          setModalVisible(false);

        }
      });
  }
  async function startReview(book: Book) {
    setModalContent(
      <View>
        {
          book.etag !== "" ? 
        <Image
          source={{
            uri: `https://covers.openlibrary.org/b/isbn/${book.etag}-M.jpg`,
          }}
          style={{
            width: "100%",
            height: 175,
            borderTopLeftRadius: 9,
            borderTopRightRadius: 9,
            resizeMode: "cover",
          }}
        /> : null}
        <View
          style={{
            padding: 10,
          }}
        >
          <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
          >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "bold",
            }}
          >
            {book.title}
          </Text>
          <Pressable style={{
          backgroundColor: "black",
          padding: 10,
          borderRadius: 9,
        }}>
          <Text style={{color: 'white', fontSize: 20}}>
            Post Review!
          </Text>
        </Pressable>
        </View>
          <Text
            style={{
              paddingBottom: 5,
              paddingTop: 5,
              color: "grey",
            }}
          >
            {username}'s review
          </Text>
          <ScrollView style={{height: '100%'}}>
          <TextInput
            style={styles.reviewTitleInput}
            placeholder="Title"
            onChangeText={(text) => setReviewTitle(text)}
            keyboardType="default"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.reviewContentInput}
            placeholder="Write your review here!"
            onChangeText={(text) => setReviewContent(text)}
            keyboardType="default"
            autoCapitalize="none"
            multiline={true}
            numberOfLines={4}
          />
        </ScrollView>
        </View>
      </View>
    );
    setModalVisible(true);
  }
  async function addISBN(book: Book) {
    let uuidC = await get("uuid");
    console.log(uuidC);
    fetch("http://localhost:3000/api/addISBN", {
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
      });
  }
  return (
    <ImageBackground
      source={gradient}
      style={styles.image}
      imageStyle={{ opacity: 0.6 }}
    >
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "flex-end",
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
            }}
          >
            <View
              style={{
                top: 0,
                height: "90%",
                width: "100%",
                padding: 0,
                borderTopRightRadius: 25,
                borderTopLeftRadius: 25,
                backgroundColor: "#f9f9f9",
              }}
            >
              {modalContent}
            </View>
          </View>
        </Modal>
        <ScrollView>
          <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View>
                <Text style={styles.title}>shelfie!</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Type in a book name!"
                  onChangeText={(text) => setSearchQuery(text)}
                  value={searchQuery}
                />
                <Pressable
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 5,
                  }}
                  onPress={() => {
                    setSearchResults([]);
                    searchBooks(searchQuery);
                  }}
                >
                  <Text style={{ fontSize: 20 }}>search</Text>
                  <Icon
                    name="search"
                    type="octicon"
                    size={20}
                    style={{ verticalAlign: "middle", marginTop: 2 }}
                    color={"black"}
                  />
                </Pressable>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "90%",
                  }}
                >
                  {searchResults.length > 0 && searchQuery !== ""
                    ? searchResults.map((book: Book, index: number) => (
                        <View
                          style={{
                            backgroundColor: "white",
                            margin: 10,
                            borderRadius: 9,
                            width: 325,
                          }}
                          key={index}
                        >
                          {book.etag !== "" ? (
                            <Image
                              source={{
                                uri: `https://covers.openlibrary.org/b/isbn/${book.etag}-M.jpg`,
                              }}
                              style={{
                                width: 325,
                                height: 150,
                                borderTopLeftRadius: 9,
                                borderTopRightRadius: 9,
                                resizeMode: "cover",
                              }}
                            />
                          ) : (
                            <Text>No image available</Text>
                          )}
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
                          <View style={{
                            flexDirection: "row",
                            justifyContent: 'space-evenly',
                            gap: 5,
                            borderBottomLeftRadius: 9,
                            borderBottomRightRadius: 9,
                            borderWidth: 2,
                            borderColor: '#37B7C3',
                          }}>
                            <Pressable
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              gap: 5,
                              margin: 10
                            }}
                            onPress={() => startReview(book)}
                          >
                            <Icon
                              name="pencil"
                              type="octicon"
                              size={20}
                              style={{ verticalAlign: "middle", marginTop: 2 }}
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
                              backgroundColor: '#37B7C3',
                            }}
                          />
                          <Pressable
                            style={{
                              flexDirection: "row",
                              justifyContent: "center",
                              gap: 5,
                              margin: 10
                            }}
                            onPress={() => addISBN(book)}
                          >
                            <Icon
                              name="heart"
                              type="octicon"
                              size={20}
                              style={{ verticalAlign: "middle", marginTop: 2 }}
                              color={"#37B7C3"}
                            />
                            <Text
                              style={{
                                fontSize: 20,
                                color: "#37B7C3",
                              }}
                            >
                              add to shelf
                            </Text>
                          </Pressable>
                          </View>
                        </View>
                      ))
                    : null}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </ScrollView>
      </GestureRecognizer>
    </ImageBackground>
  );
}
