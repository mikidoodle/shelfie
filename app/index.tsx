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
} from "react-native";
export default function Index() {
  let [changeUsername, onChangeUsername] = useState("");
  let [changePassword, onChangePassword] = useState("");
  let [isDisabled, setDisabled] = useState(false);
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
                shelfie!
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
                title="log in"
                onPress={() => {}}
                disabled={isDisabled}
              />
            </View>
            <Text style={{ textAlign: "center" }}>or</Text>
            <View>
              <Button color="black" title="sign up!" />
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
