import { useEffect } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { router } from "expo-router";
import * as SecretStore from "@/components/SecretStore";
import styles from "../assets/styles/style";

export default function Index() {
  useEffect(() => {
    (async () => {
      let uuid = await SecretStore.get("uuid");
      if (uuid) {
        router.replace("home");
        console.log(uuid);
      } else {
        router.replace("login");
      }
    })();
  }, []);
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
