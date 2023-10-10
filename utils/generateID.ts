import * as Crypto from "expo-crypto";

export const generateUniqueID = async () => {
  return await Crypto.randomUUID();
};
