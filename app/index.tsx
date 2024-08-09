import { useEffect } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { router } from "expo-router";
import * as SecretStore from "@/components/SecretStore";
import styles from "../assets/styles/style";
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function Index() {

  useEffect(() => {
    (async () => {
      checkIfFirstOpen();
      let uuid = await SecretStore.get("uuid");
      if (uuid) {
        router.replace("home");
        console.log(uuid);
      } else {
        router.replace("login");
      }
    })();
  }, []);
  async function checkIfFirstOpen() {
    let firstUse = await AsyncStorage.getItem('firstinstall');
    if(firstUse === null) {
      router.push('/firstinstall')
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 50,
            fontWeight: "bold",
            color: "#37B7C3",
          }}
        >
          shelfie!
        </Text>
      </View>
    </SafeAreaView>
  );
}
