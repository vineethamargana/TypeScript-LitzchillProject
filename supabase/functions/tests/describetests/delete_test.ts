import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import DeletememebyID from "../../_handler/_meme_module/DeleteMeme.ts";
import { PostgrestError } from "@supabase/supabase-js";
import { USER_ROLES } from "@shared/_constants/UserRoles.ts";
import { MEME_STATUS } from "@shared/_constants/Types.ts";
import {mockMemeDB} from "../../tests/mockeddb.ts";

const mockDeleteMemeQuery = async (meme_id: string, user_id: string, user_type: string) => {
  console.log(`\n🛠️ Executing mockDeleteMemeQuery() with: meme_id=${meme_id}, user_id=${user_id}, user_type=${user_type}`);

  const isAdmin = user_type === USER_ROLES.ADMIN_ROLE ;
  const meme = mockMemeDB[meme_id];

  if (!meme) {
    return { data: null, error: { message: "Meme not found", code: "404" } as PostgrestError };
  }

  if (meme.meme_status === MEME_STATUS.DELETED) {
    return { data: null, error: { message: "Meme is already deleted", code: "409" } as PostgrestError };
  }

  
  // 🔍 Debugging ownership check
  console.log(`👤 Meme Owner: ${meme.user_id}, Requesting User: ${user_id}, isAdmin: ${isAdmin}`);

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

// Test suite with logs
describe("🛠️ DeletememebyID Function Tests", () => {
  it("❌ Should return 404 when meme is not found", async () => {
    const params = {
      id: "ee03f406-fb76-4432-ba82-cddea44c5b1c", // Non-existent ID
      user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
      user_type: USER_ROLES.ADMIN_ROLE,
    };

    console.log("📝 [TEST] Running '404 Meme Not Found' Test", params);

    const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
    const body = await response.json();

    console.log("📢 [TEST] Response:", { status: response.status, body });

    assertEquals(response.status, 404);
    assertEquals(body.message, "Meme not found");
  });

  it("⚠️ Should return 409 when meme is already deleted", async () => {
    const params = {
      id: "2f161080-1788-4a68-8365-3d43dedeb976", // Already deleted meme
      user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
      user_type: USER_ROLES.ADMIN_ROLE,
    };

    console.log("📝 [TEST] Running '409 Meme Already Deleted' Test", params);

    const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
    const body = await response.json();

    console.log("📢 [TEST] Response:", { status: response.status, body });

    assertEquals(response.status, 409);
    assertEquals(body.message, "Meme is already deleted");
  });

  it("🚫 Should return 403 when user is unauthorized", async () => {
    const params = {
      id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed",
      user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
      user_type: USER_ROLES.USER_ROLE, // Not admin
    };

    console.log("📝 [TEST] Running '403 Unauthorized User' Test", params);

    const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
    const body = await response.json();

    console.log("📢 [TEST] Response:", { status: response.status, body });

    assertEquals(response.status, 403);
    assertEquals(body.message, "Unauthorized");
  });

  it("✅ Should delete meme successfully when user is admin", async () => {
    const params = {
      id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed",
      user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
      user_type: USER_ROLES.ADMIN_ROLE,
    };

    console.log("📝 [TEST] Running '200 Successful Meme Deletion' Test", params);

    const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
    const body = await response.json();

    console.log("📢 [TEST] Response:", { status: response.status, body });
    console.log("📢 [TEST] Body:", body.body.message);

    assertEquals(response.status, 200);
    
    assertEquals(body.body.message, "Meme deleted Succesfully");
  });
});
