import { getIdeaMessages } from "../db/queries";

export async function fetchMessages(ideaId: number) {
  const response = await getIdeaMessages(ideaId.toString());

  return response;
}