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
} from "react-native";
import { Icon } from "@rneui/themed";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 20,
          width: "90%",
          height: 60,
          shadowColor: "#37B7C3",
          shadowOpacity: 0.37,
          shadowRadius: 32,
          borderRadius: 64,
          elevation: 5,
          backgroundColor: "#F8F8F8",
          backfaceVisibility: "hidden",
        },
        tabBarActiveTintColor: "#37B7C3",
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" type="octicon" color={color} />
          ),
        }}
      />
      <Tab.Screen name="Also home" component={HomeScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" type="octicon" color={color} />
          ),
        }} />
      <Tab.Screen name="Also also home" component={HomeScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" type="octicon" color={color} />
          ),
        }}/>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
    width: 30,
    height: 30,
    verticalAlign: "middle",
    position: "absolute",
    top: 15,
  },
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
