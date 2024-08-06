import { useState } from "react";
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
import bcrypt from "bcrypt-react-native";
import postgres from "postgres";
import { Link, router } from "expo-router";
let gradient = require("../assets/images/homeScreen.png");
import * as SecureStore from "expo-secure-store";
import styles from "../assets/styles/style";
export default function Index() {
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
  let [changeUsername, onChangeUsername] = useState("");
  let [changeEmail, onChangeEmail] = useState("");

  let [changePassword, onChangePassword] = useState("");
  let [changePasswordConfirm, onChangePasswordConfirm] = useState("");
  let [isDisabled, setDisabled] = useState(false);
  function Signup() {
    if(/^[a-zA-Z0-9._]{1,16}$/.test(changeUsername)) {
    setDisabled(true);
    fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: changeEmail,
        username: changeUsername,
        password: changePassword,
        passwordConfirm: changePasswordConfirm,
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        setDisabled(false);
        Alert.alert(data.message);
        if (data.error === false) {
          await save("uuid", data.uuid);
          await save("username", data.username);
          router.replace("/");
        }
      });
    } else {
      Alert.alert("Username must be between 1 and 16 characters and only contain letters, numbers, periods, and underscores.");
    }
  }
  return (
    <ImageBackground
      source={gradient}
      style={styles.image}
      imageStyle={{ opacity: 0.6 }}
    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
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
                  welcome to shelfie!
                </Text>
              </View>
            </View>
            <View>
              <TextInput
                style={styles.input}
                onChangeText={(t) => {
                  onChangeEmail(t.trim().toLowerCase());
                }}
                value={changeEmail}
                placeholder="email"
                keyboardType="default"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                onChangeText={(t) => {
                  onChangeUsername(t.trim().toLowerCase());
                }}
                value={changeUsername}
                placeholder="username"
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
              <TextInput
                style={styles.input}
                onChangeText={onChangePasswordConfirm}
                value={changePasswordConfirm}
                placeholder="password: the sequel"
                secureTextEntry={true}
                autoCapitalize="none"
              />
              <Pressable
                style={isDisabled ? styles.disabledButton : styles.button}
                disabled={isDisabled}
                onPress={Signup}
              >
                <Text
                  style={styles.buttonText}
                >
                  sign up!
                </Text>
              </Pressable>
              <Text style={{ textAlign: "center" }}>or</Text>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <Link
                  href="/"
                  style={{
                    fontSize: 18,
                  }}
                >
                  log in
                </Link>
              </View>
            </View>
          </View>
        
      </SafeAreaView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}