import { View, Text, Pressable, Alert } from "react-native";
import { useState } from "react";
import { Icon } from "@rneui/themed";
import * as SecureStore from "expo-secure-store";
import ResponsiveImage from "./ResponsiveImage";
import { APIEndpoint, Book, ReviewPropItem } from "./Types";
import * as LibraryStore from "./LibraryStore";
async function get(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  } else {
    return null;
  }
}
export default function ReviewItem(props: ReviewPropItem) {
  let { review, uuid } = props;
  let [hasLiked, setHasLiked] = useState(review.liked.includes(uuid));
  let [likeCount, setLikeCount] = useState(review.liked.length);
  let [bookmarked, setBookmarked] = useState(false);
  LibraryStore.getBook(review.meta.etag).then((data) => {
    console.log(review.meta.title, data);
    setBookmarked(data !== null);
  });
  async function remotelyAddToLibrary() {
    let uuid = await get("uuid");
    setBookmarked(await LibraryStore.getBook(review.meta.etag) !== null);
    await LibraryStore.storeBook(review.meta.etag, {
      title: review.meta.title,
    });
    fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(
        review.meta.title
      )}&fields=title,first_sentence,cover_edition_key,author_name,subject&limit=2&language=eng`
    )
      .then((response) => response.json())
      .then(async (response) => {
        if (response.docs.length > 0) {
          let book = response.docs[0];
          var bookInfo: Book = {
            title: book.title,
            authors: Object.keys(book).includes("author_name")
              ? book.author_name[0]
              : "",
            description: Object.keys(book).includes("first_sentence")
              ? book.first_sentence[0]
              : "No description available",
            etag: review.meta.etag,
            category: book.subject || [],
          };
          LibraryStore.storeBook(review.meta.etag, bookInfo);
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
    fetch(`${APIEndpoint}/api/likeReview`, {
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
          <Pressable onPress={remotelyAddToLibrary}>
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
