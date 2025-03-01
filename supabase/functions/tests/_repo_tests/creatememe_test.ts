// deno-lint-ignore-file no-explicit-any require-await
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { createMemeQuery } from "@repository/_meme_repo/MemeRepository.ts";

const TEST_USER_ID = "9a9afb14-acbc-481a-a315-4b946dbf0491";
const TEST_MEME_TITLE = "Funny Meme";
const TEST_IMAGE_URL = "https://example.com/meme.jpg";
const TEST_TAGS = ["funny", "humor"];
function createMockSupabase(mockResponse:(meme:object) => any){
    return {
        from: function(tableName:string){
            console.log(`[Mock] from(${tableName}) called`);
            return{
                insert: function(insertObj: object[]){
                    console.log(`[Mock] insert(${JSON.stringify(insertObj)}) called`);
                    return{
                        select: function(columns: string){
                            console.log(`[Mock] select(${columns}) called`);
                            return{
                                single: async function(){
                                    console.log(`[Mock] single() called - Executing mock response`);
                                    const response = mockResponse(insertObj[0]);
                                    console.log(`[Mock] Returning response:`, response);
                                    return response;
                                }
                            };
                        },
                    };
                }
            }
        }
    }
}

Deno.test("Should successfully create a meme", async () => {
    const mockSupabase = createMockSupabase((meme) => ({
      data: { ...meme, meme_id: "1234-5678-91011" },
      error: null,
    }));
  
    const memeData = {
      user_id: TEST_USER_ID,
      meme_title: TEST_MEME_TITLE,
      media_file: TEST_IMAGE_URL,
      tags: TEST_TAGS,
    };
  
    const result = await createMemeQuery( memeData,mockSupabase as any);
  
    const expectedResult = { data: { 
        user_id: TEST_USER_ID,
        meme_title: TEST_MEME_TITLE,
        image_url: TEST_IMAGE_URL, 
        tags: TEST_TAGS,
        meme_id: "1234-5678-91011",
      },
       error: null };
    console.log(result);
    console.log(expectedResult);
    assertEquals(result, expectedResult);
  });

Deno.test("Should return an error when inserting meme fails", async () => {
    const mockSupabase = createMockSupabase(() => ({
      data: null,
      error: { message: "Insertion failed" },
    }));
  
    const memeData = {
      user_id: TEST_USER_ID,
      meme_title: TEST_MEME_TITLE,
      media_file: TEST_IMAGE_URL,
      tags: TEST_TAGS,
    };
  
    const result = await createMemeQuery( memeData,mockSupabase as any);
  
    const expectedResult = { data: null, error: { message: "Insertion failed" } };
  
    console.log(result);
    console.log(expectedResult);
    assertEquals(result, expectedResult);
}); 