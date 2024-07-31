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
  etag: string;
  category: string[];
};
export default function HomeScreen() {
  let [searchQuery, setSearchQuery] = useState<string>("");
  let [searchResults, setSearchResults] = useState<Book[]>([]);
  function searchBooks(query: string) {
    if (query.length > 0) {
      setSearchResults([]);
      fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          query
        )}&fields=title,first_sentence,isbn,author_name,subject&limit=100&lang=en`
      )
        .then((response) => response.json())
        .then((data) => {
          let mapSearchResults: Book[] = [];
          data.docs.map((book: any) => {
              var bookInfo: Book = {
                title: book.title,
                authors: Object.keys(book).includes("author_name") ? book.author_name[0] : "",
                description: Object.keys(book).includes("first_sentence") ? book.first_sentence[0] : "No description available",
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
  async function addISBN(book: Book) {
    let uuidC = await get("uuid");
    console.log(uuidC)
    fetch("http://localhost:3000/api/addISBN", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isbn: encodeURIComponent(JSON.stringify({
        title: book.title,
        authors: book.authors,
        description: book.description,
        etag: book.etag,
        category: book.category,
        })),
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
      <ScrollView>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View>
            <Text style={styles.title}>shelfie!</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Type in a book name!"
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
            />
            <Button
              title="Search"
              onPress={()=>{setSearchResults([]);searchBooks(searchQuery)}}
            />
            <View style={{
              alignItems: "center",
              justifyContent: "center",
              width: "90%"
            }}>
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
                        <Button title="Add to shelf" onPress={() => addISBN(book)} />
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
