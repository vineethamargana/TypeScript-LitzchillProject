import likememe from "@handler/_likes_module/LikeMeme.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { HTTP_STATUS_CODE } from "@shared/_constants/HttpStatusCodes.ts";
import { MEME_ERROR_MESSAGES, MEME_SUCCESS_MESSAGES } from "@shared/_messages/Meme_Module_Messages.ts";
import { LIKE_ERROR, LIKE_SUCCESS } from "@shared/_messages/LikeMessage.ts";
import { COMMON_ERROR_MESSAGES } from "@shared/_messages/ErrorMessages.ts";
import unlikememes from "@handler/_likes_module/UnlikeMeme.ts";


function mockCheckMemeExists(response: string | null) {
    return async () => {
        return response;
    };
}


function mockLikeMeme(response: boolean) {
    return async () => {
        return response;
    };
}

Deno.test('testing missing meme_id', async () => {
    const req = new Request("http://localhost", { method: "POST" });
    const params = { user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed" };
    
    const result = await unlikememes(req, params);
    const resultBody = await result.json();

    assertEquals(result.status, HTTP_STATUS_CODE.BAD_REQUEST);
    assertEquals(resultBody.message, MEME_ERROR_MESSAGES.MISSING_MEMEID);
})

Deno.test('testing invalid meme_id', async () => {
    const req = new Request("http://localhost", { method: "POST" });
    const params = { user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", id: "124" };
    
    const result = await unlikememes(req, params);
    const resultBody = await result.json();

    assertEquals(result.status, HTTP_STATUS_CODE.BAD_REQUEST);
    assertEquals(resultBody.message, MEME_ERROR_MESSAGES.MISSING_MEMEID);
})


Deno.test("checkMemeExists - Meme does not exist", async () => {
    const req = new Request("http://localhost", { method: "POST" });
    const params = { user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed" };

    const mockCheckMemeExistsResponse = mockCheckMemeExists(null);
    
    const result = await unlikememes(req, params,mockCheckMemeExistsResponse);
    const resultBody = await result.json();

    assertEquals(result.status, HTTP_STATUS_CODE.NOT_FOUND);
    assertEquals(resultBody.message, MEME_ERROR_MESSAGES.MEME_NOT_FOUND);
})


Deno.test("likememe should return success response", async () => {
    const req = new Request("http://localhost", { method: "POST" });
    const params = { user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed" };
    
    const mockCheckMemeExistsResponse = mockCheckMemeExists("test_meme");

    const mockLikeMemeResponse = mockLikeMeme(true);

    const result = await unlikememes(req, params, mockCheckMemeExistsResponse, mockLikeMemeResponse);
    const resultBody = await result.json();

    assertEquals(result.status, HTTP_STATUS_CODE.OK);
    assertEquals(resultBody.message, LIKE_SUCCESS.UNLIKED_SUCCESSFULLY);

})

Deno.test('error message when like failed',async()=>{
    const req = new Request("http://localhost", { method: "POST" });
    const params = { user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed" };
    
    const mockCheckMemeExistsResponse = mockCheckMemeExists("test_meme");
    const mockLikeMemeResponse = mockLikeMeme(false);
    
    const result = await unlikememes(req, params, mockCheckMemeExistsResponse, mockLikeMemeResponse);
    const resultBody = await result.json();
    
    assertEquals(result.status, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    assertEquals(resultBody.message, LIKE_ERROR.UNLIKE_FAILED);
})

// Deno.test("likememe should return error response when database connection fails", async () => {
//     const req = new Request("http://localhost", { method: "POST" });
//     const params = { user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed" };
    
//     const mockCheckMemeExistsResponse = mockCheckMemeExists("test_meme");
//     const mockLikeMemeResponse = mockLikeMeme({ data: null, error: "Database connection failed" });
    
//     const result = await unlikememes(req, params, mockCheckMemeExistsResponse, mockLikeMemeResponse);
//     const resultBody = await result.json();
    
//     assertEquals(result.status, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
//     assertEquals(resultBody.message, COMMON_ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
//     })

import * as Mockery from "https://deno.land/x/mockery/mod.ts";
import { mock } from "node:test";

console.log(Mockery); // Check available exports

Deno.test("unlikememes error handling", async () => {
    const mockCheckMemeExists = mock.fn(async () => { throw new Error("DB error"); });

    const response = await unlikememes(new Request("http://example.com"), { user_id: "123", id: "456" }, mockCheckMemeExists);

    assertEquals(response.status, 500);
});
