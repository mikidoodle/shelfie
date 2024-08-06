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
import { Divider, Icon } from "@rneui/themed";
import styles from "../../assets/styles/style";

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

async function deleteUUID(key: string) {
  await SecureStore.deleteItemAsync(key);
}
//create a type for the book
type Book = {
  title: string;
  authors: string;
  description: string;
  etag: string;
  category: string[];
};
export default function Settings() {
  return (
    <ImageBackground
      source={gradient}
      style={styles.image}
      imageStyle={{ opacity: 0.6 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>settings</Text>
          <View
            style={{
              margin: 10,
              marginTop: 50,
              borderRadius: 9,
              width: 325,
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => {
                deleteUUID("uuid");
                router.push("/");
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 20,
                }}
              >
                <Icon name="sign-out" type="octicon" size={20} style={{paddingRight: 5}} color={"black"} />
                Log out
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}