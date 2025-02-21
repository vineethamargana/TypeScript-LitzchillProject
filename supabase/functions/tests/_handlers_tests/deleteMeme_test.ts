// deno-lint-ignore-file require-await
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import DeletememebyID from "../../_handler/_meme_module/DeleteMeme.ts";
import { PostgrestError } from "@supabase/supabase-js"; 
import { USER_ROLES } from "@shared/_constants/UserRoles.ts";
import { MEME_STATUS } from "@shared/_constants/Types.ts";

const mockMemeDB: Record<string, { meme_status: string; user_id: string }> = {
  "088f3d23-6136-48ea-9ede-6f8d64f1e6ed": { meme_status: MEME_STATUS.APPROVED, user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c" },
  "12345678-1234-1234-1234-123456789012": { meme_status: MEME_STATUS.DELETED, user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c" },
};

// deno-lint-ignore no-unused-vars
const mockDeleteMemeQuery = async (meme_id: string, user_id: string, user_type: string) => {
  if (!meme_id) {
    return { data: null, error: { message: "Invalid meme ID", code: "400" } as PostgrestError };
  }

  const meme = mockMemeDB[meme_id];
  if (!meme) {
    return { data: null, error: { message: "Meme not found", code: "404" } as PostgrestError };
  }

  if (meme.meme_status === MEME_STATUS.DELETED) {
    return { data: null, error: { message: "Meme is already deleted", code: "409" } as PostgrestError };
  }

 // const isAdmin = user_type === USER_ROLES.ADMIN_ROLE;
  if (user_type !== USER_ROLES.ADMIN_ROLE ) {
    return { data: null, error: { message: "Unauthorized", code: "403" } as PostgrestError };
  }

  meme.meme_status = MEME_STATUS.DELETED;

  return {
    data: { meme_id, meme_status: MEME_STATUS.DELETED },
    error: null,
  };
};

// Test: Meme Not Found
Deno.test("DeletememebyID - Meme Not Found", async () => {
  const params = { 
    id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed",
  };

  const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);

  console.log("Response:", response);
  const body = await response.json();
  console.log("Body:", body);

  assertEquals(response.status, 404);
  assertEquals(body.message, "Meme not found");
});

// Test: Already Deleted Meme
Deno.test("DeletememebyID - Meme Already Deleted", async () => {
  const params = { 
    id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", 
  };

  const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
  console.log("Response status:", response.status);
  const body = await response.json();
  console.log("Response body:", body);
  assertEquals(response.status, 409);
  assertEquals(body.message, "Meme is already deleted");
  
});


// Test: Unauthorized Deletion Attempt
Deno.test("DeletememebyID - Unauthorized User", async () => {
  const params = { 
    id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", 
    user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c", 
    user_type: USER_ROLES.ADMIN_ROLE
  };

  const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);

  console.log("Response status:", response.status);
  const body = await response.json();
  console.log("Response body:", body);
  assertEquals(response.status, 403);
  assertEquals(body.message, "Unauthorized");
});


// Test: Successful Deletion
Deno.test("DeletememebyID - Deletes Meme Successfully (Mocked)", async () => {
  const params = { 
    id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", 
    user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c", 
    user_type: USER_ROLES.ADMIN_ROLE
  };

  const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);


  console.log("Received response:", response);
  console.log("Response status:", response.status);

  const body = await response.json();
  console.log("Response body:", body);

  assertEquals(response.status, 200);
  assertEquals(body.body.message, "Meme deleted Succesfully");
});

