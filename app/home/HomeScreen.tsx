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

export default function HomeScreen() {
  let [searchQuery, setSearchQuery] = useState<string>();
  return (
    <ImageBackground source={gradient} style={styles.image} imageStyle={{opacity: 0.6}}>
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
    width: 300,
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
    shadowOpacity: 0.5
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

  }
});
