import likememe from "@handler/_likes_module/LikeMeme.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { HTTP_STATUS_CODE } from "@shared/_constants/HttpStatusCodes.ts";
import { MEME_ERROR_MESSAGES } from "@shared/_messages/Meme_Module_Messages.ts";


Deno.test('testing missing meme_id', async () => {
    const req = new Request("http://localhost", { method: "POST" });
    const params = { user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed" };
    
    const result = await likememe(req, params);
    const resultBody = await result.json();

    assertEquals(result.status, HTTP_STATUS_CODE.BAD_REQUEST);
    assertEquals(resultBody.message, MEME_ERROR_MESSAGES.MISSING_MEMEID);
})

Deno.test('testing invalid meme_id', async () => {
    const req = new Request("http://localhost", { method: "DELETE" });
    const params = { user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", id: "124" };
    
    const result = await likememe(req, params);
    const resultBody = await result.json();

    assertEquals(result.status, HTTP_STATUS_CODE.BAD_REQUEST);
    assertEquals(resultBody.message, MEME_ERROR_MESSAGES.MISSING_MEMEID);
})


function mockCheckMemeExists(response: string | null) {
    return async () => {
        return response;
    };
}

Deno.test("checkMemeExists - Meme does not exist", async () => {
    const req = new Request("http://localhost", { method: "DELETE" });
    const params = { user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed" };

    const mockCheckMemeExistsResponse = mockCheckMemeExists(null);
    
    const result = await likememe(req, params,mockCheckMemeExistsResponse);
    const resultBody = await result.json();

    assertEquals(result.status, HTTP_STATUS_CODE.NOT_FOUND);
    assertEquals(resultBody.message, MEME_ERROR_MESSAGES.MEME_NOT_FOUND);
})

function mockLikeMeme(response: { data: any; error: any }) {
    return async () => {
        if (response.error === "Database connection failed") {
            throw new Error(response.error);
        }
        return response;
    };
}



