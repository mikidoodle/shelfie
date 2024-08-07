import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export async function storeBook(etag: string, book: object) {
  try {
    await AsyncStorage.setItem(`@shelfie:${etag}`, JSON.stringify(book));
  } catch (error) {
    Alert.alert("Error saving book to library.");
  }
}

export async function getBook(etag: string) {
  try {
    const value = await AsyncStorage.getItem(`@shelfie:${etag}`);
    return value;
  } catch (e) {
    Alert.alert("Error reading library")
  }
}

export async function deleteBook(etag: string) {
  try {
    await AsyncStorage.removeItem(`@shelfie:${etag}`)
  } catch(e) {
    Alert.alert("Error deleting from library.")
  }
 }