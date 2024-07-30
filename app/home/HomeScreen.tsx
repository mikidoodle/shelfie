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
} from "react-native";
import { Image } from 'expo-image';
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
          let index = 0;
          data.items.map((book: any) => {
            if (index <= 10) {
              console.log(book);
              var bookInfo: Book = {
                title: book.volumeInfo.title,
                authors: book.volumeInfo.authors,
                description: `${
                  (book.volumeInfo.description?.toString()!.length > 250
                    ? book.volumeInfo.description.substring(0, 250)
                    : book.volumeInfo.description) || ""
                }...`,
                thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
                etag: book.etag,
              };
              setSearchResults([...searchResults, bookInfo]);
              index++;
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
            <ScrollView
              style={{
                width: "90%",
                margin: "auto",
              }}
            >
              {searchResults.length > 0 && searchQuery !== ""
                ? searchResults.map((book: Book) => (
                    <View
                      style={{
                        backgroundColor: "white",
                        margin: 10,
                        borderRadius: 9,
                        width: 300,
                      }}
                      key={book.etag}
                    >
                      {book.thumbnail !== "" ? (
                        <Image
                          source={{
                            uri: book.thumbnail,
                          }}
                          contentFit="cover"
                          placeholder="|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj["
                          style={{
                            width: 300,
                            borderTopLeftRadius: 9,
                            borderTopRightRadius: 9,

                          }}
                        />
                      ) : (
                        <Text>No image available</Text>
                      )}
                      <View style={{
                        padding: 10,
                        shadowColor: "#37B7C3",
                      }}>
                        <Text>{book.title}</Text>
                        <Text>{book.authors}</Text>
                        <Text>{book.description}</Text>
                      </View>
                    </View>
                  ))
                : null}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
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
    width: 300,
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
