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
import ResponsiveImage from "@/components/ResponsiveImage";
import * as LibraryStore from "@/components/LibraryStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
export default function Library() {
  let [searchQuery, setSearchQuery] = useState<string>("");
  let [searchResults, setSearchResults] = useState<Book[]>([]);
  useEffect(() => {
    searchBooks();
  }, []);
  async function searchBooks() {
    setSearchResults([]);
    let bookList = await AsyncStorage.getItem(`@shelfie:booklist`);
    let parsedBookList = bookList ? bookList.split(",") : [];
    console.log(parsedBookList);
    if (parsedBookList.length === 0) {
      setSearchResults([
        {
          title: "No books in library",
          authors: "",
          description:
            "Add books to your library from the home screen! All books are stored locally on your device.",
          etag: "404shelfieerror",
          category: [""],
        },
      ]);
    } else {
      let mapSearchResults: Book[] = [];
      parsedBookList.map(async (etag: string) => {
        let book = await AsyncStorage.getItem(`@shelfie:${etag}`);
        console.log(book);
        let bookObject =
          book === null
            ? {
                title: "An unknown error occurred",
                authors: "",
                description: "Please email mihir@pidgon.com.",
                etag: "",
                category: [],
              }
            : JSON.parse(book);
        console.log(bookObject.etag);
        if (bookObject) {
          console.log(bookObject.title);
          mapSearchResults.push(bookObject);
        }
        /* LibraryStore.getBook(etag).then((book) => {
          let bookObject = book ? JSON.parse(book) : null;
          console.log(bookObject.etag);
          if (bookObject) {
            var bookInfo: Book = {
              title: bookObject.title,
              authors: bookObject.authors,
              description: bookObject.description,
              etag: bookObject.etag,
              category: bookObject.category || [],
            };
            let localLibraryStore = searchResults;
            localLibraryStore.push(bookInfo);
            setSearchResults(localLibraryStore)
          }
        });*/
        setSearchResults(mapSearchResults);
      });
      
    }
    /*let uuid = await get('uuid');
      setSearchResults([]);
      fetch(
        `http://localhost:3000/api/library`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uuid: uuid
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if(data.books.length === 0) {
            setSearchResults([{
              title: "No books in library",
              authors: "",
              description: "Add books to your library by scanning the barcode on the back of the book",
              etag: "404shelfieerror",
              category: [""],
            }])
            return;
          }
          let mapSearchResults: Book[] = [];
          data.books.map((book: any) => {
              var bookInfo: Book = {
                title: book.title,
                authors: Object.keys(book).includes("authors") ? book.authors : "",
                description: Object.keys(book).includes("description") ? book.description : "No description available",
                etag: Object.keys(book).includes("etag") ? book.etag : "",
                category: book.subject || [],
              };
              mapSearchResults.push(bookInfo);
          });
          setSearchResults(mapSearchResults);
        });*/
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
                  searchResults.map((book: Book, index: number) =>
                    book.etag !== "404shelfieerror" ? (
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
                          <ResponsiveImage
                            url={`https://covers.openlibrary.org/b/olid/${book.etag}-M.jpg`}
                            style={{
                              width: 325,
                              height: 150,
                              borderTopLeftRadius: 9,
                              borderTopRightRadius: 9,
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
