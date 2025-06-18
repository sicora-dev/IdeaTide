"use server"
import { changeUserPassword, deleteUserData, getUserAuthMethods, getUserData, insertUserData, updateUserData, updateUserProfileData } from "../db/queries";
import { User } from "../types/users";

export async function fetchUserData(userId: string) {
  try {
    const result = await getUserData(userId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to get user data:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to get user data" 
    };
  }
}

export async function insertUser(data: User) {
  const result = await insertUserData(data);
  if (!result) {
    throw new Error("Failed to insert user");
  }
  return result;
}

export async function updateUser(data: User) {
  const result = await updateUserData(data);
  if (!result) {
    throw new Error("Failed to send message");
  }
}

export async function updateUserProfile(userId: string, data: { nickname: string; biography?: string | null }) {
  try {
    const result = await updateUserProfileData(userId, data);
    if (!result) {
      return { success: false, error: "Failed to update user profile" };
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to update user" 
    };
  }
}

export async function deleteUser(userId: string) {
  const result = await deleteUserData(userId);
  if (!result) {
    return { success: false, error: "Failed to delete user" };
  } else{
    return { success: true, data: result };
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const result = await changeUserPassword(currentPassword, newPassword);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to change password:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to change password" 
    };
  }
}

export async function getAuthMethods(userId: string) {
  try {
    const result = await getUserAuthMethods(userId);
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to get auth methods:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to get auth methods" 
    };
  }
}