import { View, Text, Image, Pressable, Alert } from "react-native";
import { useState } from "react";
import styles from "../assets/styles/style";
import { Icon } from "@rneui/themed";
import * as SecureStore from "expo-secure-store";
import ResponsiveImage from "./ResponsiveImage";

async function get(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}
type Review = {
  title: string;
  content: string;
  meta: {
    title: string;
    authors: string;
    etag: string;
  };
  username: string;
  uuid: string;
  liked: string[];
};
type PropItem = {
  review: Review;
  key: number;
  uuid: string;
};

export default function ReviewItem(props: PropItem) {
  let { review, uuid } = props;
  let [hasLiked, setHasLiked] = useState(review.liked.includes(uuid));
  let [likeCount, setLikeCount] = useState(review.liked.length);
  let [bookmarked, setBookmarked] = useState(false);
  async function remotelyAddToLibrary() {
    let uuid = await get("uuid");
    setBookmarked(true);
    fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(
        review.meta.title
      )}&fields=title,first_sentence,cover_edition_key,author_name,subject&limit=2&language=eng`
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.docs.length > 0) {
          let book = response.docs[0];
          fetch("http://localhost:3000/api/addBook", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uuid: uuid,
              title: book.title,
              authors: book.author_name,
              description: book.first_sentence,
              etag: book.cover_edition_key,
              category: book.subject,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.error !== true) {
                console.log("Book added to library");
              } else {
                Alert.alert("Error", "Could not add book to library");
              }
            })
            .catch((err) => {
              console.log(err);
              Alert.alert("Error", "Could not add book to library");
            });
        } else {
          Alert.alert("Error", "Could not find book");
        }
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", "Could not add book to library");
      });
  }
  async function likeReview() {
    setHasLiked(!review.liked.includes(uuid));
    setLikeCount(!review.liked.includes(uuid) ? likeCount + 1 : likeCount - 1);
    review.liked.includes(uuid)
      ? review.liked.splice(review.liked.indexOf(uuid), 1)
      : review.liked.push(uuid);
    fetch("http://localhost:3000/api/likeReview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uuid: uuid,
        reviewId: review.uuid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error !== true) {
        } else {
          Alert.alert("Error", "Could not like review");
        }
      })
      .catch((err) => {
        console.log(err);
        Alert.alert("Error", "Could not like review");
      });
  }
  return (
    <View
      style={{
        backgroundColor: "white",
        margin: 10,
        borderRadius: 9,
        width: 325,
      }}
    >
      <View
        style={{
          padding: 10,
          shadowColor: "#37B7C3",
        }}
      >
        <Text>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              color: "#37B7C3",
            }}
          >
            {review.username}
          </Text>{" "}
          read:
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          {review.meta.title}
          <Text style={{ color: "lightgrey" }}> | </Text>
          <Text
            style={{
              fontWeight: "normal",
              color: "gray",
            }}
          >
            {review.meta.authors}
          </Text>
        </Text>

        {review.meta.etag !== "" ? (
          <ResponsiveImage
            url={`https://covers.openlibrary.org/b/olid/${review.meta.etag}-M.jpg`}
            style={{
              width: "100%",
              height: 200,
              marginTop: 10,
              marginBottom: 10,
              borderRadius: 9,
            }}
          />
        ) : null}
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {review.title}
        </Text>
        <Text>{review.content}</Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 15,
            margin: 5,
          }}
        >
          <Pressable
            onPress={likeReview}
            style={{
              flexDirection: "row",
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: 20,
              }}
            >
              {likeCount}
            </Text>
            <Icon
              name={`heart${hasLiked ? "-fill" : ""}`}
              type="octicon"
              size={26}
              color={hasLiked ? "red" : "black"}
            />
          </Pressable>
          <Pressable
            onPress={remotelyAddToLibrary}
          >
            <Icon
              name={`bookmark${bookmarked ? "-slash" : ""}`}
              type="octicon"
              size={26}
              color={bookmarked ? "grey" : "black"}
            />
          </Pressable>
          
        </View>
      </View>
    </View>
  );
}
