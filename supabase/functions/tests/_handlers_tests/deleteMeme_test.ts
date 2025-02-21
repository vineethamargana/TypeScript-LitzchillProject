// deno-lint-ignore-file require-await
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import DeletememebyID from "../../_handler/_meme_module/DeleteMeme.ts";
import { PostgrestError } from "@supabase/supabase-js"; 
import { USER_ROLES } from "@shared/_constants/UserRoles.ts";
import { MEME_STATUS } from "@shared/_constants/Types.ts";
import { mockMemeDB } from "../../tests/mockeddb.ts";

const mockDeleteMemeQuery = async (meme_id: string, user_id: string, user_type: string) => {
  console.log(`\n Executing mockDeleteMemeQuery() with: meme_id=${meme_id}, user_id=${user_id}, user_type=${user_type}`);

  const isAdmin = user_type === USER_ROLES.ADMIN_ROLE ;
  const meme = mockMemeDB[meme_id];

  if (!meme) {
    return { data: null, error: { message: "Meme not found", code: "404" } as PostgrestError };
  }

  if (meme.meme_status === MEME_STATUS.DELETED) {
    return { data: null, error: { message: "Meme is already deleted", code: "409" } as PostgrestError };
  }

  
  //Debugging ownership check
  console.log(`Meme Owner: ${meme.user_id}, Requesting User: ${user_id}, isAdmin: ${isAdmin}`);

  // Ensure user_id is correctly compared (string conversion)
  if (!isAdmin || String(meme.user_id) !== String(user_id)) {
    return { data: null, error: { message: "Unauthorized", code: "403" } as PostgrestError };
  }

  // Update the meme status
  meme.meme_status = MEME_STATUS.DELETED;

  return {
    data: { meme_id, meme_status: MEME_STATUS.DELETED },
    error: null,
  };
};
// Test: Meme Not Found
Deno.test(" DeletememebyID - Meme Not Found", async () => {
  console.log("\n Running: Meme Not Found Test");

  const params = {
    id: "ee03f406-fb76-4432-ba82-cddea44c5b1c", // Already deleted meme
    user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
    user_type: USER_ROLES.ADMIN_ROLE,
  };

  const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
  const body = await response.json();

  console.log("Response:", response);
  console.log("Body:", JSON.stringify(body, null, 2));

  assertEquals(response.status, 404, "Expected status 404 but got a different status");
  assertEquals(body.message, "Meme not found", "Unexpected error message for missing meme");
});

// Test: Already Deleted Meme
Deno.test("DeletememebyID - Meme Already Deleted", async () => {
  console.log("\nRunning: Meme Already Deleted Test");

  const params = {
    id: "2f161080-1788-4a68-8365-3d43dedeb976", // Already deleted meme
    user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
    user_type: USER_ROLES.ADMIN_ROLE,
  };

  const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
  const body = await response.json();

  console.log("Response status:", response.status);
  console.log("Response body:", JSON.stringify(body, null, 2));

  assertEquals(response.status, 409, "Expected status 409 for already deleted meme");
  assertEquals(body.message, "Meme is already deleted", "Incorrect message for deleted meme");
});

//Test: Unauthorized Deletion Attempt
Deno.test("DeletememebyID - Unauthorized User", async () => {
  console.log("\nRunning: Unauthorized User Test");

  const params = {
    id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", // Already deleted meme
    user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
    user_type: USER_ROLES.USER_ROLE,
  };

  const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
  const body = await response.json();

  console.log("Response status:", response.status);
  console.log(" Response body:", JSON.stringify(body, null, 2));

  assertEquals(response.status, 403, "Expected status 403 for unauthorized user");
  assertEquals(body.message, "Unauthorized", "Incorrect unauthorized error message");
});

// Test: Successful Deletion by Admin
Deno.test("DeletememebyID - Deletes Meme Successfully", async () => {
  console.log("\n Running: Meme Deletion Test (Admin User)");

  const params = {
    id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", // Already deleted meme
    user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
    user_type: USER_ROLES.ADMIN_ROLE,
  };

  const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
  const body = await response.json();

  console.log("Received response:", response);
  console.log("Response status:", response.status);
  console.log("Response body:", JSON.stringify(body, null, 2));

  assertEquals(response.status, 200, "Expected status 200 for successful deletion");
  assertEquals(body.body.message, "Meme deleted Succesfully", "Meme deletion message mismatch");
});
