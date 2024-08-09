import {
  ScrollView,
  TextInput,
  View,
  Image,
  Pressable,
  Text,
  Alert,
} from "react-native";
import styles from "@/assets/styles/style";
import { useEffect, useState } from "react";
import * as SecretStore from "@/components/SecretStore";
import { Book } from "@/components/Types";
import { Link, router, useLocalSearchParams } from "expo-router";
export default function ReviewModal() {
  const params = useLocalSearchParams();
  let { bookObject } = params;
  let book: Book = JSON.parse(bookObject as string);
  let [reviewTitle, setReviewTitle] = useState<string>("");
  let [reviewContent, setReviewContent] = useState<string>("");
  let [username, setUsername] = useState<string>("");
  let [uuid, setUUID] = useState<string>("");
  async function submitReview() {
    var res = await fetch("http://localhost:3000/api/addReview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: reviewTitle,
        content: reviewContent,
        book: book,
        uuid: uuid,
        username: username,
      }),
    });
    let data = await res.json();
    if (data.error) {
      Alert.alert(data.message);
      router.dismiss()
    } else {
      Alert.alert(data.message);
      
    }
  }
  useEffect(() => {
    (async () => {
      let uuid = await SecretStore.get("uuid");
      let user = await SecretStore.get("username");
      if (user !== null) {
        setUsername(user);
      }
      if (uuid !== null) {
        setUUID(uuid);
      }

    })();
  });
  const isPresented = router.canGoBack();
  return (
    <View>
      <View
      /* style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "flex-end",
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
        }}*/
      >
        <View
        /* style={{
            top: 0,
            height: "90%",
            width: "100%",
            padding: 0,
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            backgroundColor: "#f9f9f9",
          }}*/
        >
          <View>
            {(book as Book).etag !== "" ? (
              <Image
                source={{
                  uri: `https://covers.openlibrary.org/b/olid/${
                    (book as Book).etag
                  }-M.jpg`,
                }}
                style={{
                  width: "100%",
                  height: 175,
                  borderTopLeftRadius: 9,
                  borderTopRightRadius: 9,
                  resizeMode: "cover",
                }}
              />
            ) : null}
            <View
              style={{
                padding: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                  width: "80%",
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                >
                  {(book as Book).title}
                </Text>
                <Pressable
                  style={{
                    backgroundColor: "black",
                    padding: 10,
                    borderRadius: 9,
                  }}
                  onPress={submitReview}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      verticalAlign: "middle",
                    }}
                  >
                    Post Review!
                  </Text>
                </Pressable>
              </View>
              <Text
                style={{
                  paddingBottom: 5,
                  paddingTop: 5,
                  color: "grey",
                }}
              >
                {username}'s review
              </Text>
            </View>
          </View>
          <ScrollView style={{ height: "100%" }}>
            <TextInput
              style={styles.reviewTitleInput}
              placeholder="Title"
              onChangeText={(text) => {
                setReviewTitle(text);
              }}
              defaultValue={reviewTitle}
              keyboardType="default"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.reviewContentInput}
              placeholder="Write your review here!"
              onChangeText={(text) => {
                setReviewContent(text);
              }}
              defaultValue={reviewContent}
              keyboardType="default"
              autoCapitalize="none"
              multiline={true}
              numberOfLines={4}
            />
          </ScrollView>
        </View>
      </View>
    </View>
  );
}