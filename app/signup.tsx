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
} from "react-native";
import bcrypt from "bcrypt-react-native";
import postgres from "postgres";
import { Link } from "expo-router";

export default function Index() {
  let [changeUsername, onChangeUsername] = useState("");
  let [changeEmail, onChangeEmail] = useState("");

  let [changePassword, onChangePassword] = useState("");
  let [isDisabled, setDisabled] = useState(false);
  function Signup() {
    fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: changeEmail,
        username: changeUsername,
        password: changePassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        Alert.alert(data.message);
      });
  }
  return (
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
            <View style={isDisabled ? styles.disabledButton : styles.button}>
              <Button
                color="black"
                title="sign up!"
                onPress={Signup}
                disabled={isDisabled}
              />
            </View>
            <Text style={{ textAlign: "center" }}>or</Text>
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Link href="/"
                style={{
                  fontSize: 18,
                }}
              >
                log in
              </Link>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
