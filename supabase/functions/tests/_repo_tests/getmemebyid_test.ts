import { getMemeByIdQuery } from "../../_repository/_meme_repo/MemeRepository.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { TABLE_NAMES } from "@shared/_db_table_details/TableNames.ts";

const TEST_MEME_ID = "0488fbc7-e8b9-4341-9e5b-9f0eb90a6d84";
const TEST_USER_ID = "9a9afb14-acbc-481a-a315-4b946dbf0491";
const MEME_OWNER_ID = "12345678-abcd-efgh-ijkl-9876543210ab";

interface MemeData {
    meme_title: string;
    image_url: string;
    tags: string[];
    like_count: number;
    created_at: string;
    user_id: string;
}
interface QueryConditions {
    meme_id: string;
}

interface MockResponse {
    data: MemeData|null;
    error: Error|null;
}
// Mock Supabase client
function createMockSupabase(mockResponse: (query: QueryConditions) => MockResponse) {
    return {
        from: function (tableName: string) {
            console.log(`[Mock] from(${tableName}) called`);
            return {
                select: function (columns: string) {
                    console.log(`[Mock] select(${columns}) called`);

                    // Handling `from(memes)`
                    if (tableName === TABLE_NAMES.MEME_TABLE) {
                        return {
                            neq: function (column: string, value: any) {
                                console.log(`[Mock] neq(${column} != ${value}) called`);
                                return {
                                    eq: function (eqColumn: string, eqValue: any) {
                                        console.log(`[Mock] eq(${eqColumn} = ${eqValue}) called`);
                                        return {
                                            single: async function () {
                                                console.log(`[Mock] single() called - Executing mock response`);
                                                const response = mockResponse({ meme_id: eqValue });
                                                console.log("Mock response:", response);
                                                return response;
                                            }
                                        };
                                    }
                                };
                            }
                        };
                    }

                    // Handling `from(users)`
                    if (tableName === TABLE_NAMES.USER_TABLE) {
                        return {
                            eq: function (eqColumn: string, eqValue: any) {
                                console.log(`[Mock] eq(${eqColumn} = ${eqValue}) called`);
                                return {
                                    limit: function (count: number) {  
                                        console.log(`[Mock] limit(${count}) called`);
                                        return {
                                            single: async function () {
                                                console.log(`[Mock] single() called - Executing mock response for users`);
                                                if (eqColumn === "user_id" && eqValue === MEME_OWNER_ID) {
                                                    return { data: { preferences: "Public" }, error: null };
                                                }
                                                return { data: null, error: "User not found" };
                                            }
                                        };
                                    }
                                };
                            }
                        };
                    }

                    // Handling `from(followers)`
                    if (tableName === TABLE_NAMES.FOLLOWERS_TABLE) {
                        return {
                            eq: function (eqColumn1: string, eqValue1: any) {
                                console.log(`[Mock] eq(${eqColumn1} = ${eqValue1}) called`);
                                return {
                                    eq: function (eqColumn2: string, eqValue2: any) {
                                        console.log(`[Mock] eq(${eqColumn2} = ${eqValue2}) called`);
                                        return {
                                            limit: function (count: number) {  // ✅ FIX: Add limit()
                                                console.log(`[Mock] limit(${count}) called`);
                                                return {
                                                    async single() {
                                                        console.log(`[Mock] single() called - Checking follower`);
                                                        if (eqValue1 === TEST_USER_ID && eqValue2 === MEME_OWNER_ID) {
                                                            return { data: { follower_id: TEST_USER_ID }, error: null };
                                                        }
                                                        return { data: null, error: null }; // Not a follower
                                                    }
                                                };
                                            }
                                        };
                                    }
                                };
                            }
                        };
                    }

                    return {};
                }
            };
        }
    };
}
// Unit test
Deno.test("Successfully fetches meme by ID", async function () {
    console.log("Running: Successfully fetches meme by ID");
    
   function mockSupabaseQuery(query: QueryConditions): MockResponse 
   {
    console.log(`[Mock] Query: ${JSON.stringify(query)}`);

    if (query.meme_id === TEST_MEME_ID) 
    {
        return { data:{ meme_title: "Test Meme", 
                        image_url: "https://example.com/test-meme.jpg", 
                        tags: ["funny", "cute"], 
                        like_count: 10, 
                        created_at: "2023-06-01T10:00:00Z", 
                        user_id: MEME_OWNER_ID 
                      }, 
                 error: null 
               };
    }  
    else 
    {
        return { data: null, error: new Error("Meme not found") };
    }

   }
 
   const mockSupabase = createMockSupabase(mockSupabaseQuery);
    // Call function with mocked Supabase
    const result = await getMemeByIdQuery(TEST_MEME_ID, TEST_USER_ID, mockSupabase as any);

    console.log("Expected result: No error, Meme data fetched");
    console.log("Actual result:", result);

    // Assertions
    assertEquals(result.error, null);
    assertEquals(result.data?.meme_title, "Funny Meme");
});


