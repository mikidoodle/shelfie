import {
  ScrollView,
  TextInput,
  View,
  Image,
  Pressable,
  Text,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import * as SecretStore from "@/components/SecretStore";
import { router, useLocalSearchParams } from "expo-router";
import ReviewItem from "@/components/ReviewItem";
export default function UserProfile() {
  const params = useLocalSearchParams();
  let { username } = params;
  let [userMention, setUserMention] = useState<string>("");
  let [uuid, setUUID] = useState<string>("");
  let [verified, setVerified] = useState<boolean>(false);
  let [reviews, setReviews] = useState<any[]>([]);
  async function loadData() {}

  useEffect(() => {
    SecretStore.get("uuid").then((uuid) => {
      if (uuid !== null) {
        setUUID(uuid);
      }
      fetch("http://localhost:3000/api/getUserProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            Alert.alert(data.message);
            router.dismiss();
          } else {
            setUserMention(data.username);
            setVerified(data.verified);
            setReviews(data.reviews);
          }
        });
    });
  }, []);

  const isPresented = router.canGoBack();
  return (
    <View
      style={{
        padding: 10,
      }}
    >
      <View>
        <View style={{
          alignItems: "center",
          margin: 10
        }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "#37B7C3",
            }}
          >
            @{userMention}
          </Text>
        </View>
        <ScrollView
          style={{ height: "100%", marginBottom: 20, margin: "auto" }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Reviews</Text>
          {reviews.map((review) => {
            return (
              <ReviewItem
                uuid={uuid}
                review={review}
                key={review.uuid}
                showBorder={true}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
