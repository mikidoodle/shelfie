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
  Pressable,
} from "react-native";
import { Link, router } from "expo-router";
let gradient = require("../assets/images/homeScreen.png");
import * as SecureStore from "expo-secure-store";
import styles from "../assets/styles/style";
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

export default function Index() {
  let [changeUsername, onChangeUsername] = useState("");
  let [changePassword, onChangePassword] = useState("");
  let [isDisabled, setDisabled] = useState(false);
  useEffect(() => {
    (async () => {
      let uuid = await get("uuid");
      if (uuid) {
        router.replace("home");
        console.log(uuid);
      }
    })();
  }, []);
  function Login() {
    setDisabled(true);
    fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: changeUsername,
        password: changePassword,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.error) {
          Alert.alert(data.message);
          setDisabled(false);
          return;
        } else {
          await save("uuid", data.uuid);
          await save("username", data.username);
          setDisabled(false);
          router.replace("/");
        }
      });
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
            <View
              style={{
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                <Text
                  style={{
                    fontSize: 34,
                    fontWeight: "bold",
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                >
                  shelfie
                </Text>
              </View>
            </View>
            <View>
              <TextInput
                style={styles.input}
                onChangeText={(t) => {
                  onChangeUsername(t.trim().toLowerCase());
                }}
                value={changeUsername}
                placeholder="username or email"
                keyboardType="default"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                onChangeText={onChangePassword}
                value={changePassword}
                placeholder="password"
                secureTextEntry={true}
                autoCapitalize="none"
              />
              <Pressable style={isDisabled ? styles.disabledButton : styles.button} onPress={Login} disabled={isDisabled}>
                <Text style={styles.buttonText}>log in!</Text>
              </Pressable>
              <Text style={{ textAlign: "center" }}>or</Text>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Link
                  href="signup"
                  style={{
                    fontSize: 18,
                  }}
                >
                  sign up
                </Link>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </ImageBackground>
  );
}
