// memeRepository.test.ts

import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { updatememeQuery } from "../../_repository/_meme_repo/MemeRepository.ts";

// Constants
const TABLE_NAMES = { MEME_TABLE: "memes" };
const MEMEFIELDS = { MEME_ID: "meme_id", USER_ID: "user_id", MEME_STATUS: "status" };
const MEME_STATUS = { DELETED: "deleted" };
const USER_ROLES = { ADMIN_ROLE: "admin" };

const mockSupabaseSuccess = {
  from: () => ({
    update: () => ({
      neq: () => ({
        match: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: {
                  meme_id: "550e8400-e29b-41d4-a716-446655440000",
                  meme_title: "Updated Meme",
                  tags: ["funny"],
                  updated_at: "2025-02-24",
                },
                error: null,
              }),
          }),
        }),
      }),
    }),
  }),
};

const mockSupabaseError = {
  from: () => ({
    update: () => ({
      neq: () => ({
        match: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({
                data: null,
                error: { message: "Meme already deleted" },
              }),
          }),
        }),
      }),
    }),
  }),
};


//  Test: Successful Update
Deno.test(" updatememeQuery should update meme successfully for admin", async () => {
  const result = await updatememeQuery(
    { meme_id: "550e8400-e29b-41d4-a716-446655440000", meme_title: "Updated Meme" }, // UUID instead of number
    USER_ROLES.ADMIN_ROLE,
    mockSupabaseSuccess
  );

  assertEquals(result.data?.meme_title, "Updated Meme");
  assertEquals(result.error, null);
});

Deno.test(" updatememeQuery should return error when meme is deleted", async () => {
  const result = await updatememeQuery(
    { meme_id: "123e4567-e89b-12d3-a456-426614174000" }, // UUID instead of number
    "user",
    mockSupabaseError
  );

  assertEquals(result.data, null);
  assertEquals(result.error?.message, "Meme already deleted");
});
