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
} from "react-native";
import { Link, router } from "expo-router";
let gradient = require("../../assets/images/homeScreen.png");
import * as SecureStore from "expo-secure-store";

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
  thumbnail: string;
  etag: string;
  category: string[];
};
export default function HomeScreen() {
  let [searchQuery, setSearchQuery] = useState<string>("");
  let [searchResults, setSearchResults] = useState<Book[]>([]);
  function searchBooks(query: string) {
    setSearchQuery(query);
    if (query.length > 0) {
      setSearchResults([]);
      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}`
      )
        .then((response) => response.json())
        .then((data) => { 
          console.log(data.items[0])
          data.items.map((book: any) => {
            if(book.kind === "books#volume") {
              var bookInfo: Book = {
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors,
                description: `${
                  (book.volumeInfo.description?.toString()!.length > 300
                    ? book.volumeInfo.description.substring(0, 300)
                    : book.volumeInfo.description) || ""
                }...`,
                thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
                etag: book.etag,
                category: book.volumeInfo.categories || [],
              };
              setSearchResults([...searchResults, bookInfo]);
            }
          });

        });
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
      <ScrollView>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <Text style={styles.title}>shelfie!</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Type in a book name!"
              onChangeText={(text) => searchBooks(text)}
              value={searchQuery}
            />
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              width: "90%"
            }}>
              {searchResults.length > 0 && searchQuery !== ""
                ? searchResults.map((book: Book) => (
                    <View
                      style={{
                        backgroundColor: "white",
                        margin: 10,
                        borderRadius: 9,
                        width: 325,
                      }}
                      key={book.etag}
                    >
                      {book.thumbnail !== "" ? (
                        <Image
                          source={{
                            uri: book.thumbnail.replace('http', 'https'),
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
                      <View style={{
                        padding: 10,
                        shadowColor: "#37B7C3",
                      }}>
                        <Text style={{
                          fontSize: 20,
                          fontWeight: "bold",
                        }}>{book.title}</Text>
                        <Text style={{
                          fontFamily: "Menlo",
                          textTransform: "uppercase",
                          paddingBottom: 5,
                          paddingTop: 5
                        }}>{book.authors}</Text>
                        <Text>{book.description}</Text>
                      </View>
                      
                    </View>
                  ))
                : null}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>

    </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: "bold",
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 50,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 100,
  },
  input: {
    height: 50,
    borderWidth: 0,
    padding: 10,
    width: 350,
    margin: 10,
    borderRadius: 9,
    backgroundColor: "#F8F8F8",
  },
  searchInput: {
    height: 50,
    borderWidth: 0,
    padding: 10,
    width: 325,
    margin: 10,
    borderRadius: 9,
    backgroundColor: "#F8F8F8",
    borderColor: "#37B7C3",
    shadowColor: "#37B7C3",
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
  },
  button: {
    padding: 5,
    width: 300,
    margin: 10,
    borderRadius: 9,
    backgroundColor: "#37B7C3",
  },
  disabledButton: {
    padding: 5,
    width: 300,
    margin: 10,
    borderRadius: 9,
    backgroundColor: "#EFEFEF",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
});
