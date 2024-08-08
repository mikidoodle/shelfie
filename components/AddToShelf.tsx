import { Pressable, Text, View } from "react-native";
import { Icon } from "@rneui/themed";
import { useState } from "react";
import Library from "@/app/home/Library";
import * as LibraryStore from "@/components/LibraryStore";
export default function AddToShelf(props: any) {
  let [addToShelf, setAddToShelf] = useState(false);
  LibraryStore.getBook(props.book.etag).then((data) => {
    setAddToShelf(data !== null);
  });
  async function toggleShelf() {
    setAddToShelf(!addToShelf);
    let book = props.book;
    book.category = Object.keys(book).includes("category")
      ? book.category.length >= 5
        ? book.category.splice(0, 5)
        : book.category
      : [];
    await LibraryStore.storeBook(props.book.etag, props.book);
    console.log("toggled shelf");
  }
  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 5,
        margin: 10,
      }}
      onPress={toggleShelf}
    >
      <Icon
        name={addToShelf ? "star-fill" : "star"}
        type="octicon"
        size={20}
        style={{
          verticalAlign: "middle",
          marginTop: 2,
        }}
        color={"#37B7C3"}
      />
      <Text
        style={{
          fontSize: 20,
          color: "#37B7C3",
        }}
      >
        {addToShelf ? "remove from shelf" : "add to shelf"}
      </Text>
    </Pressable>
  );
}
