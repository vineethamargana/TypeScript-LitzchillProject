import { describe, it } from "https://deno.land/std@0.224.0/testing/bdd.ts";
import { expect } from "https://deno.land/x/testing_library_jest_deno@v0.1.1/mod.ts";
import DeletememebyID from "../../functions/_handler/_meme_module/DeleteMeme.ts";
import { PostgrestError } from "@supabase/supabase-js"; 
import { USER_ROLES } from "@shared/_constants/UserRoles.ts";
import { MEME_STATUS } from "@shared/_constants/Types.ts";

const mockMemeDB: Record<string, { meme_status: string; user_id: string }> = {
  "088f3d23-6136-48ea-9ede-6f8d64f1e6ed": { meme_status: MEME_STATUS.APPROVED, user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c" },
  "12345678-1234-1234-1234-123456789012": { meme_status: MEME_STATUS.DELETED, user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c" },
};

// Mock function
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

  if (user_type !== USER_ROLES.ADMIN_ROLE) {
    return { data: null, error: { message: "Unauthorized", code: "403" } as PostgrestError };
  }

  meme.meme_status = MEME_STATUS.DELETED;

  return {
    data: { meme_id, meme_status: MEME_STATUS.DELETED },
    error: null,
  };
};

// Test suite
describe("DeletememebyID", () => {
  it("returns 404 when meme is not found", async () => {
    const params = { id: "non-existent-id" };

    const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.message).toBe("Meme not found");
  });

  it("returns 409 when meme is already deleted", async () => {
    const params = { id: "12345678-1234-1234-1234-123456789012" };

    const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.message).toBe("Meme is already deleted");
  });

  it("returns 403 when user is unauthorized", async () => {
    const params = { 
      id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed",
      user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c", 
      user_type: USER_ROLES.USER_ROLE, // Not admin
    };

    const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.message).toBe("Unauthorized");
  });

  it("deletes meme successfully when user is admin", async () => {
    const params = { 
      id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed",
      user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c", 
      user_type: USER_ROLES.ADMIN_ROLE
    };

    const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.body.message).toBe("Meme deleted Succesfully");
  });
});
