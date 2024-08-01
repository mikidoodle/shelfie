import { StyleSheet } from "react-native";
export default styles = StyleSheet.create({
    tabBarIcon: {
        width: 30,
        height: 30,
        verticalAlign: "middle",
        position: "absolute",
        top: 15,
      },
    title: {
      fontSize: 34,
      fontWeight: "bold",
      paddingLeft: 5,
      paddingRight: 5,
      marginTop: 50,
    },
    titleIcon: {
      fontSize: 34,
      fontWeight: "bold",
      paddingRight: 15,
      marginTop: 55,
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
      width: 350,
      margin: 10,
      borderRadius: 9,
      backgroundColor: "#F8F8F8",
    },
    searchInput: {
      height: 50,
      borderWidth: 0,
      padding: 10,
      width: 325,
      margin: 10,
      borderRadius: 9,
      backgroundColor: "#F8F8F8",
      borderColor: "#37B7C3",
      shadowColor: "#37B7C3",
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.5,
    },
    button: {
      padding: 5,
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
    image: {
      flex: 1,
      resizeMode: "cover",
      justifyContent: "center",
    },
  });
  