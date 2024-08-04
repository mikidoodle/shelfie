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
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Link, router } from "expo-router";
let gradient = require("../../../assets/images/homeScreen.png");
import * as SecureStore from "expo-secure-store";
import { Icon } from "@rneui/themed";
import styles from "../../../assets/styles/style";
import Settings from "../Settings";

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
const Stack = createNativeStackNavigator();

export default function SwipeScreen() {
  return (
    <ImageBackground
      source={gradient}
      style={styles.image}
      imageStyle={{ opacity: 0.6 }}
    >
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>swipe</Text>
        <View
          style={{
            height: "80%",
            width: "90%",
            margin: "auto",
            backgroundColor: "#f8f8f8",
            borderRadius: 20,
            marginBottom: 10
          }}
        >
          <Text style={styles.title}>Title goes here</Text>
          <Image
            source={{
              uri: "https://covers.openlibrary.org/b/isbn/0739360418-L.jpg",
            }}
            style={{
              width: "100%",
              height: 200,
              resizeMode: "contain",
              margin: 10,
              marginLeft: 0,
              marginRight: 0,
            }}
          />
          <View
            style={{
              margin: 20,
              marginTop: 0,
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 20 }}>Author goes here</Text>
            <Text style={{ fontSize: 20 }}>Genre goes here</Text>
            <Text style={{ fontSize: 20 }}>Description goes here</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "80%",
          }}
        >
          <View
            style={{
              borderRadius: 50,
              backgroundColor: "#f8f8f8",
              borderColor: "white",
              borderWidth: 1,
              padding: 5,
            }}
          >
            <Icon
              name="x-circle-fill"
              type="octicon"
              size={32}
              style={{
                verticalAlign: "middle",
                margin: 5,
              }}
              color={"grey"}
            />
          </View>

          <View
            style={{
              borderRadius: 50,
              backgroundColor: "#f8f8f8",
              borderColor: "white",
              borderWidth: 1,
              padding: 5,
            }}
          >
            <Icon
              name="feed-repo"
              type="octicon"
              size={32}
              style={{
                verticalAlign: "middle",
                margin: 5,
              }}
              color={"black"}
            />
          </View>
          <View
            style={{
              borderRadius: 50,
              backgroundColor: "#f8f8f8",
              borderColor: "white",
              borderWidth: 1,
              padding: 5,
            }}
          >
            <Icon
              name="feed-heart"
              type="octicon"
              size={32}
              style={{
                verticalAlign: "middle",
                margin: 5,
              }}
              color={"red"}
            />
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}
