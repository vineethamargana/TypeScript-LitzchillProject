// deno-lint-ignore-file no-explicit-any require-await
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { updateMemeStatusQuery } from "../../_repository/_meme_repo/MemeRepository.ts"; // Adjust the import path
import {  MEME_STATUS } from "../../_shared/_constants/Types.ts";

function createMockSupabase(mockResponse: (conditions: object) => any) {
  return {
    from: (tableName: string) => {
      console.log(`[Mock] from(${tableName}) called`);
      return {
        update: (updateObj: object) => {
          console.log(`[Mock] update(${JSON.stringify(updateObj)}) called`);
          return {
            eq: (column: string, value: any) => {
              console.log(`[Mock] eq(${column} = ${value}) called`);
              return {
                eq: (column2: string, value2: any) => {
                  console.log(`[Mock] eq(${column2} = ${value2}) called`);
                  return {
                    neq: (column3: string, value3: any) => {
                      console.log(`[Mock] neq(${column3} != ${value3}) called`);
                      return {
                        select: (columns: string) => {
                          console.log(`[Mock] select(${columns}) called`);
                          return {
                            single: async () => {
                              console.log(`[Mock] single() called - Executing mock response`);
                              return mockResponse({
                                meme_id: value,
                                meme_status: updateObj,
                                user_id: value2,
                              });
                            },
                          };
                        },
                      };
                    },
                  };
                },
              };
            }, 
          };
        },
      };
    },
  };
}

//  Test 1: Successfully updating a meme's status
Deno.test("updateMemeStatusQuery should update meme status successfully", async () => {
  console.log("\n Running Test: Successfully updating a meme's status ");

  const mockSupabase = createMockSupabase(() => ({
    data: { meme_id: "0488fbc7-e8b9-4341-9e5b-9f0eb90a6d84", meme_status: MEME_STATUS.APPROVED, meme_title: "Funny Meme" },
    error: null,
  }));
 console.log("mock supabase:",mockSupabase); 
 const result = await updateMemeStatusQuery("0488fbc7-e8b9-4341-9e5b-9f0eb90a6d84", MEME_STATUS.APPROVED, "9a9afb14-acbc-481a-a315-4b946dbf0491", mockSupabase as any);

  const expectedResult = {
    data: { meme_id: "0488fbc7-e8b9-4341-9e5b-9f0eb90a6d84", meme_status: MEME_STATUS.APPROVED, meme_title: "Funny Meme" },
    error: null,
  };

  console.log("[Test] Expected result:", expectedResult);
  console.log("[Test] Actual result:", result);

  assertEquals(result, expectedResult);
});

//Test 2: Failing when the meme is already deleted
Deno.test("updateMemeStatusQuery should fail if meme is deleted", async () => {
  console.log("\n  Running Test: Failing when the meme is already deleted ");

  const mockSupabase = createMockSupabase(() => ({
    data: null,
    error: { message: "Meme is already deleted" },
  }));

  const result = await updateMemeStatusQuery("0488fbc7-e8b9-4341-9e5b-9f0eb90a6d84", MEME_STATUS.APPROVED, "9a9afb14-acbc-481a-a315-4b946dbf0491", mockSupabase as any);

  const expectedResult = {
    data: null,
    error: { message: "Meme is already deleted" },
  };

  console.log("[Test] Expected result:", expectedResult);
  console.log("[Test] Actual result:", result);

  assertEquals(result, expectedResult);
});

// Test 3: Failing when the user is not the meme owner
Deno.test("updateMemeStatusQuery should fail if user is not meme owner", async () => {
  console.log("\n  Running Test: Failing when the user is not meme owner ");

  const mockSupabase = createMockSupabase(() => ({
    data: null,
    error: { message: "User is not the owner of this meme" },
  }));

  const result = await updateMemeStatusQuery("0488fbc7-e8b9-4341-9e5b-9f0eb90a6d84", MEME_STATUS.APPROVED, "9a9afb14-acbc-481a-a315-4b946dbf0491", mockSupabase as any);

  const expectedResult = {
    data: null,
    error: { message: "User is not the owner of this meme" },
  };

  console.log("[Test] Expected result:", expectedResult);
  console.log("[Test] Actual result:", result);

  assertEquals(result, expectedResult);
});
