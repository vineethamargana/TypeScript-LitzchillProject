import { HTTP_STATUS_CODE } from "@shared/_constants/HttpStatusCodes.ts";
import { MEME_ERROR_MESSAGES } from "@shared/_messages/Meme_Module_Messages.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import updateMemeStatus from "@handler/_meme_module/UpdateMemeStatus.ts";
import { COMMON_ERROR_MESSAGES } from "@shared/_messages/ErrorMessages.ts";


//Test for missing meme_id
Deno.test("updateMemeStatus - Missing meme_id", async () => {
    const req = new Request("http://localhost", { method: "POST" });
    const params = { user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed" }; 
    const response = await updateMemeStatus(req, params);
    const responseBody = await response.json();
    assertEquals(responseBody.message, MEME_ERROR_MESSAGES.MISSING_MEMEID);
    console.log(responseBody);
    assertEquals(response.status, HTTP_STATUS_CODE.BAD_REQUEST);
  });

Deno.test('invalid meme_id',async () => {
    const req = new Request("http://localhost", { method: "POST" });
    const params = { user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", id: "124" };
    const response = await updateMemeStatus(req, params);
    const responseBody = await response.json();
    assertEquals(responseBody.message, MEME_ERROR_MESSAGES.MISSING_MEMEID);
    console.log("RESPONSE:",response);
    console.log("RESPONSE BODY:",responseBody);
    assertEquals(response.status, HTTP_STATUS_CODE.BAD_REQUEST);
});

Deno.test("missing meme_status",async() => {
    const req= new Request("http://localhost", { method: "POST",body: JSON.stringify({}) });
    const params = { id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed",user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed"};

    const response = await updateMemeStatus(req, params);
    const responseBody = await response.json();
    assertEquals(responseBody.message, MEME_ERROR_MESSAGES.MISSING_STATUS_VALUE);
    console.log("RESPONSE BODY:",responseBody);
    assertEquals(response.status, HTTP_STATUS_CODE.BAD_REQUEST);
});

Deno.test("invalid meme_status", async() => {
    const req = new Request("http://localhost", { method: "POST", body: JSON.stringify({ meme_status: "invalid" }) });
    const params = { id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed", user_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed" };
    const response = await updateMemeStatus(req, params);
    const responseBody = await response.json();
    assertEquals(responseBody.message, COMMON_ERROR_MESSAGES.INVALID_DATA);
    console.log("RESPONSE BODY:",responseBody);
    assertEquals(response.status, HTTP_STATUS_CODE.BAD_REQUEST);
});


