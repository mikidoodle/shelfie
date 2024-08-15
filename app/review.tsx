import {
  ScrollView,
  TextInput,
  View,
  Image,
  Pressable,
  Text,
  Alert,
  Keyboard,
  
} from "react-native";
import styles from "@/assets/styles/style";
import { useEffect, useState } from "react";
import * as SecretStore from "@/components/SecretStore";
import { APIEndpoint, Book } from "@/components/Types";
import { Link, router, useLocalSearchParams } from "expo-router";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
export default function ReviewModal() {
  const params = useLocalSearchParams();
  let { bookObject } = params;
  let book: Book =
    bookObject !== undefined ? JSON.parse(bookObject as string) : "{}";
  let [reviewTitle, setReviewTitle] = useState<string>("");
  let [emotions, setEmotions] = useState<any>([]);
  const emotionSelect = [
    { id: 0, name: "Happy" },
    { id: 1, name: "Sad" },
    { id: 2, name: "Excited" },
    { id: 3, name: "Angry" },
    { id: 4, name: "Confused" },
    { id: 5, name: "Inspired" },
    { id: 6, name: "Nostalgic" },
    { id: 7, name: "Hopeful" },
    { id: 8, name: "Anxious" },
    { id: 9, name: "Frustrated" },
    { id: 10, name: "Content" },
    { id: 11, name: "Surprised" },
    { id: 12, name: "Relieved" },
    { id: 13, name: "Disappointed" },
    { id: 14, name: "Curious" },
    { id: 15, name: "Empathetic" },
    { id: 16, name: "Peaceful" },
    { id: 17, name: "Motivated" },
    { id: 18, name: "Amused" },
    { id: 19, name: "Reflective" },
  ];
  let [disableSubmit, setDisableSubmit] = useState<boolean>(false);
  let [reviewContent, setReviewContent] = useState<string>("");
  let [username, setUsername] = useState<string>("");
  let [uuid, setUUID] = useState<string>("");
  async function submitReview() {
    setDisableSubmit(true);
    fetch(`https://shelfie.pidgon.com/api/addReview`, {
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
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          Alert.alert(data.message);
          if (router.canGoBack()) {
            router.dismiss();
          } else {
            router.push("home");
          }
        } else {
          setDisableSubmit(false);
          Alert.alert(data.message);
        }
      })
      .catch((err) => {
        setDisableSubmit(false);
        Alert.alert("An error occurred. Please try again later.");
        router.dismiss();
        console.log(err);
      });
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
      <View>
        <View>
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
                  disabled={disableSubmit}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      verticalAlign: "middle",
                    }}
                  >
                    {disableSubmit ? "Submitting..." : "Submit"}
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
            {/*<MultiSelect
              hideTags
              items={emotionSelect}
              uniqueKey="id"
              onSelectedItemsChange={setEmotions}
              selectedItems={emotions}
              selectText="Pick Items"
              searchInputPlaceholderText="Search Items..."
              onChangeInput={(text) => console.log(text)}
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{ color: "#000" }}
              submitButtonColor="#CCC"
              submitButtonText="Submit"
            />
            <View style={{
              flexDirection: "row",
              flexWrap: "wrap",
              padding: 5,
            }}>
              {emotions.map((emotion) => {
                return (
                  <View
                    style={{
                      backgroundColor: "black",
                      borderRadius: 9,
                      padding: 10,
                      margin: 5,
                    }}
                    key={emotion}
                  >
                    <Text
                      style={{
                        color: "white",
                      }}
                    >
                      {emotionSelect[parseInt(emotion)].name}
                    </Text>
                  </View>
                );
              })}
            </View>*/}
            <Picker
              selectedValue={emotions[0]}
              onValueChange={(itemValue) =>
                setEmotions([itemValue, emotions[1], emotions[2]])
              }
            >
              <Picker.Item label="Java" value="java" />
              <Picker.Item label="JavaScript" value="js" />
            </Picker>
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
