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
import Library from "./Library";

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
          left: 33.5,
          width: 325,
          height: 60,
          shadowColor: "#37B7C3",
          shadowOpacity: 0.5,
          shadowRadius: 48,
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
      <Tab.Screen name="Library" component={Library} options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="repo" type="octicon" color={color} />
          ),
        }} />
        <Tab.Screen name="Swipe" component={Library} options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart" type="octicon" color={color} />
          ),
        }} />
      <Tab.Screen name="Settings" component={HomeScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="gear" type="octicon" color={color} />
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
