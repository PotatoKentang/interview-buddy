import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "my-interview";
//value is the interview object stringified
export const storeDataToLocalStorage = async (value: string) => {
  try {
    await AsyncStorage.setItem(KEY, value);
  } catch (e) {
    // saving error
    console.log("error in saving data");
  }
};

export const getDataFromLocalStorage = async () => {
  try {
    const value = await AsyncStorage.getItem(KEY);
    if (value !== null) {
      return JSON.parse(value);
    }
    else {
      return [];
    }
  } catch (e) {
    // error reading value
    console.log("error in reading data");
  }
};

export const getLocalStorageDataByID = async (id: string | string[]) => {
  try {
    const value = await AsyncStorage.getItem(KEY);
    if (value !== null) {
      const data = JSON.parse(value);
      const foundItem = data.find((item: { id: string }) => item.id === id);
      return foundItem || null;
    } else {
      return null; // Return null if the storage is empty
    }
  } catch (e) {
    console.log("error in reading data:", e);
    return null; // Return null in case of an error
  }
};

export const clearLocalStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
    console.log("error in clearing data");
  }
}

