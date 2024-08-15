import { useEffect, useState } from "react";
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
import { router } from "expo-router";
let gradient = require("../../assets/images/homeScreen.png");
import * as SecretStore from "@/components/SecretStore";
import { Icon } from "@rneui/themed";
import styles from "../../assets/styles/style";
import * as LibraryStore from "../../components/LibraryStore";

export default function Settings() {
  let [openAIKey, setOpenAIKey] = useState<string>("");
  let [preExistingKey, setPreExistingKey] = useState<string>("");
  let [hasOpenAIKey, setHasOpenAIKey] = useState<boolean>(false);
  let [username, setUsername] = useState<string>("");
  useEffect(() => {
    SecretStore.get("username").then((data) => {
      setUsername(data === null ? "" : data);
    });
    SecretStore.get("openAIKey").then((data) => {
      setHasOpenAIKey(data !== null);
      setPreExistingKey(data === null ? "" : data);
    });
  });
  function storeOpenAIKey() {
    SecretStore.set("openAIKey", openAIKey).then(() => {
      setHasOpenAIKey(true);
      Alert.alert("OpenAI API key saved!", "You can't use your custom key for swipes yet in the beta, but you'll be notified when it's available!");
    });
  }
  function deleteOpenAIKey() {
    SecretStore.deleteSecret("openAIKey").then(() => {
      setHasOpenAIKey(false);
      Alert.alert("OpenAI API key deleted!");
      setOpenAIKey("");
    });
  }
  return (
    <ImageBackground
      source={gradient}
      style={styles.image}
      imageStyle={{ opacity: 0.6 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <ScrollView>
            <Text style={styles.title}>settings</Text>
            <View
              style={{
                flexDirection: "column",
                gap: 10,
                marginTop: 30,
              }}
            >
              <Pressable
                style={styles.settingsItemLeading}
                onPress={LibraryStore.clearLibrary}
              >
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
                  gap: 5,
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
                      padding: 5,
                    }}
                    value={openAIKey}
                    onChangeText={(t) => {
                      setOpenAIKey(t);
                    }}
                    placeholder={
                      hasOpenAIKey ? preExistingKey : "enter OpenAI key"
                    }
                    onSubmitEditing={storeOpenAIKey}
                  />
                </View>
                <Pressable
                  style={{
                    borderRadius: 5,
                    backgroundColor: "black",
                    borderColor: "black",
                    borderWidth: 2,
                    width: 60,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    storeOpenAIKey();
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: "white",
                      marginTop: 10,
                    }}
                  >
                    Store
                  </Text>
                </Pressable>
              </View>
              <Pressable
                style={styles.settingsItemMiddle}
                onPress={deleteOpenAIKey}
                disabled={!hasOpenAIKey}
              >
                <Text
                  style={{
                    color: hasOpenAIKey ? "black" : "grey",
                    fontSize: 20,
                  }}
                >
                  Reset OpenAI key
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  SecretStore.deleteSecret("uuid");
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
                  Log out <Text style={{color: "#37B7C3"}}>@{username}</Text>
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}
