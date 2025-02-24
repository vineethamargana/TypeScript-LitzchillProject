import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { HTTP_STATUS_CODE } from "@shared/_constants/HttpStatusCodes.ts";
import { MEME_SUCCESS_MESSAGES } from "@shared/_messages/Meme_Module_Messages.ts";
import getmemebyID from "@handler/_meme_module/getMemeByID.ts";

// Mocked database
// deno-lint-ignore no-explicit-any
const mockMemeDB: Record<string, any> = {
  "550e8400-e29b-41d4-a716-446655440000": {
    meme_title: "Funny Meme",
    image_url: "http://example.com/meme1.jpg",
    tags: ["funny", "joke"],
    like_count: 120,
    created_at: "2024-02-01T12:00:00Z",
    user_id: "123e4567-e89b-12d3-a456-426614174000",
  },
};

const mockFollowerDB: Record<string, { follower_id: string }[]> = {
  "123e4567-e89b-12d3-a456-426614174000": [
    { follower_id: "550e8400-e29b-41d4-a716-446655440000" },
  ],
};

// Mock function
// deno-lint-ignore require-await
const mockGetMemeByIdQuery = async (meme_id: string, user_id: string) => {
  if (!meme_id) {
    return { data: null, error: "Invalid meme ID" };
  }

  const meme = mockMemeDB[meme_id];
  if (!meme) {
    return { data: null, error: "Meme not found" };
  }

  const memeOwnerId = meme.user_id;
  const isPrivate = false;

  if (isPrivate) {
    const isFollower = mockFollowerDB[memeOwnerId]?.some(f => f.follower_id === user_id);
    if (!isFollower) {
      return { data: null, error: "Access denied: This account is private." };
    }
  }

  return { data: meme, error: null };
};

// Test: Meme Not Found
Deno.test("getmemebyID - Meme Not Found", async () => {
  const params = { id: "non-existent-id", user_id: "550e8400-e29b-41d4-a716-446655440000" };
  const response = await getmemebyID(new Request("http://localhost"), params, mockGetMemeByIdQuery);
  const body = await response.json();
  assertEquals(response.status, HTTP_STATUS_CODE.NOT_FOUND);
  assertEquals(body.message, "Meme not found");
});

// Test: Successful Fetch
Deno.test("getmemebyID - Fetches Meme Successfully", async () => {
  const params = { id: "550e8400-e29b-41d4-a716-446655440000", user_id: "123e4567-e89b-12d3-a456-426614174000" };
  const response = await getmemebyID(new Request("http://localhost"), params, mockGetMemeByIdQuery);
  const body = await response.json();
  assertEquals(response.status, HTTP_STATUS_CODE.OK);
  assertEquals(body.body.message, MEME_SUCCESS_MESSAGES.MEME_FETCHED_SUCCESSFULLY);
  assertEquals(body.body.data.meme_title, "Funny Meme");
});
