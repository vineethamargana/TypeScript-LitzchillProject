import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import DeletememebyID from "../../_handler/_meme_module/DeleteMeme.ts";
import { PostgrestError } from "@supabase/supabase-js";
import { USER_ROLES } from "@shared/_constants/UserRoles.ts";
import { MEME_STATUS } from "@shared/_constants/Types.ts";
import { mockMemeDB } from "../../tests/mockeddb.ts";


/**
 * Simulates the deletion of a meme by updating its status to "deleted" in a mock database.
 * 
 * This function performs several checks before deleting:
 * - Verifies if the meme exists in the mock database.
 * - Checks if the meme is already marked as deleted.
 * - Validates user authorization: Admins can delete any meme, while regular users can only delete their own.
 * 
 * @param {string} meme_id - The ID of the meme to delete.
 * @param {string} user_id - The ID of the user attempting to delete the meme.
 * @param {string} user_type - The role of the user (e.g., admin or regular user).
 * 
 * @returns {Promise<{ data: object | null, error: PostgrestError | null }>} - Returns an object containing the deleted meme's ID and status if successful, or an error object if any checks fail.
 */

const mockDeleteMemeQuery = async (meme_id: string, user_id: string, user_type: string) => {
  console.log(`\nExecuting mockDeleteMemeQuery() with: meme_id=${meme_id}, user_id=${user_id}, user_type=${user_type}`);

  const isAdmin = user_type === USER_ROLES.ADMIN_ROLE;
  const meme = mockMemeDB[meme_id];

  if (!meme) {
    return { data: null, error: { message: "Meme not found", code: "404" } as PostgrestError };
  }

  if (meme.meme_status === MEME_STATUS.DELETED) {
    return { data: null, error: { message: "Meme is already deleted", code: "409" } as PostgrestError };
  }

  console.log(`Meme Owner: ${meme.user_id}, Requesting User: ${user_id}, isAdmin: ${isAdmin}`);

  // Corrected ownership check: Admins can delete any meme, users can delete only their own
  if (!isAdmin || String(meme.user_id) !== String(user_id)) {
    return { data: null, error: { message: "Unauthorized", code: "403" } as PostgrestError };
  }

  meme.meme_status = MEME_STATUS.DELETED;
  return { data: { meme_id, meme_status: MEME_STATUS.DELETED }, error: null };
};


/**
 * Executes a test case for the DeletememebyID function, simulating the deletion of a meme.
 * 
 * @param {string} testName - The name of the test case being executed.
 * @param {Object} params - An object containing the parameters for the deletion request:
 * @param {string} params.id - The ID of the meme to be deleted.
 * @param {string} params.user_id - The ID of the user attempting the deletion.
 * @param {string} params.user_type - The role of the user (e.g., admin or regular user).
 * @param {number} expectedStatus - The expected HTTP status code of the response.
 * @param {string} expectedMessage - The expected message in the response body.
 * 
 * This function logs the test name and parameters, invokes the DeletememebyID function,
 * and asserts that the response status and message match the expected values.
 */

const runDeleteMemeTest = async (
  testName: string,
  params: { id: string; user_id: string; user_type: string },
  expectedStatus: number,
  expectedMessage: string
) => {
  console.log(`\n Running: ${testName}`);
  console.log("Params:", params);

  const response = await DeletememebyID(new Request("http://localhost"), params, mockDeleteMemeQuery);
  const body = await response.json();

  console.log(" Response Status:", response.status);
  console.log(" Response Body:", JSON.stringify(body, null, 2));

  assertEquals(response.status, expectedStatus, `Expected status ${expectedStatus} but got ${response.status}`);
  assertEquals(body.message, expectedMessage, `Expected message '${expectedMessage}' but got '${body.message}'`);
};

// Define test cases
const testCases = [
  {
    name: "DeletememebyID - Meme Not Found",
    params: {
      id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
      user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
      user_type: USER_ROLES.ADMIN_ROLE,
    },
    expectedStatus: 404,
    expectedMessage: "Meme not found",
  },
  {
    name: "DeletememebyID - Meme Already Deleted",
    params: {
      id: "2f161080-1788-4a68-8365-3d43dedeb976",
      user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
      user_type: USER_ROLES.ADMIN_ROLE,
    },
    expectedStatus: 409,
    expectedMessage: "Meme is already deleted",
  },
  {
    name: "DeletememebyID - Unauthorized User",
    params: {
      id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed",
      user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
      user_type: USER_ROLES.USER_ROLE,
    },
    expectedStatus: 403,
    expectedMessage: "Unauthorized",
  },
  {
    name: "DeletememebyID - Deletes Meme Successfully",
    params: {
      id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed",
      user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
      user_type: USER_ROLES.ADMIN_ROLE,
    },
    expectedStatus: 200,
    expectedMessage: "Meme deleted Succesfully",
  },
];



/*
 * Run the test cases by invoking the runDeleteMemeTest function for each test case.
 * This will log the test name and parameters, invoke the DeletememebyID function,
 * and assert that the response status and message match the expected values.
 * The test cases are defined in the `testCases` array.
 *
 * Note: Replace the `mockDeleteMemeQuery` function with the actual implementation of the deletion logic.
*/
for (const testCase of testCases) {
Deno.test(testCase.name, async () => {
    await runDeleteMemeTest(testCase.name, testCase.params, testCase.expectedStatus, testCase.expectedMessage);
  });
}
