"use server"
import { updateUserData } from "../db/queries";
import { User } from "../types/users";

export async function updateUser(data: User) {
  const result = await updateUserData(data);
  if (!result) {
    throw new Error("Failed to send message");
  }
}