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
import * as LibraryStore from "../../components/LibraryStore"

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
  return true;
}

async function get(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}

async function deleteSecret(key: string) {
  await SecureStore.deleteItemAsync(key);
  return true;
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
  let [openAIKey, setOpenAIKey] = useState<string>("")
  let [hasOpenAIKey, setHasOpenAIKey] = useState<boolean>(false);
  useEffect(()=>{
    get('openAIKey').then((data)=>{
      setHasOpenAIKey(data !== null)
    })
  })
  function storeOpenAIKey() {
    save('openAIKey', openAIKey).then(()=>{
      Alert.alert('OpenAI API key saved!')
    })
  }
  function deleteOpenAIKey() {
    deleteSecret('openAIKey').then(()=>{
      Alert.alert('OpenAI API key deleted!')
    })
  }
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
              flexDirection: "column",
              gap: 10,
              marginTop: 50,
            }}
          >
            <Pressable style={styles.settingsItemLeading} onPress={LibraryStore.clearLibrary}>
              <Text
                style={{
                  color: "black",
                  fontSize: 20,
                }}
              >
                Clear Library
              </Text>
            </Pressable>
            <View>
              <Text>Use your own OpenAI API key for swipes.</Text>

              <Text
                style={{
                  color: "grey",
                }}
              >
                Keys are stored locally.
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 5
              }}
            >
              <View
                style={{
                  width: 260,
                  margin: "auto",
                  padding: 5,
                  borderRadius: 5,
                  backgroundColor: "white",
                  borderColor: "white",
                  borderWidth: 2,
                }}
              >
                <TextInput
                  style={{
                    color: "black",
                    fontSize: 20,
                  }}
                  secureTextEntry={true}
                  value={openAIKey}
                  placeholder="enter OpenAI key"
                />
              </View>
              <Pressable style={{
                borderRadius: 5,
                backgroundColor: "black",
                borderColor: "black",
                borderWidth: 2,
                width: 60,
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 18,
                  color: 'white',
                  marginTop: 5
                }}>Store</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => {
                deleteSecret("uuid");
                router.push("/");
              }}
              style={styles.settingsItemTrailing}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: 20,
                }}
              >
                <Icon
                  name="sign-out"
                  type="octicon"
                  size={20}
                  style={{ paddingRight: 5 }}
                  color={"black"}
                />
                Log out
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
