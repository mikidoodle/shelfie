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
} from "react-native";
import { Link, router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
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
      let uuid = await get('uuid');
      if (uuid) {
        router.replace('home')
        console.log(uuid);
      } else {
        router.replace('login')
      }
    })();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Text style={{
          fontSize: 50,
          fontWeight: "bold",
          color: "#37B7C3",
        }}>shelfie!</Text>
      </View>
    </SafeAreaView>
  );
}