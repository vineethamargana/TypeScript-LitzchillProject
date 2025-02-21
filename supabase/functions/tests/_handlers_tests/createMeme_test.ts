import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import  createMeme  from "../../_handler/_meme_module/CreateMeme.ts";
import 'https://deno.land/x/dotenv@v3.2.2/load.ts'

Deno.test("createMeme: Valid Request", async () => {
  // Step 1: Generate a unique boundary
  const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";

  // Step 2: Construct the multipart form-data body
  const body = `
${boundary}
Content-Disposition: form-data; name="meme_title"

Test Meme
${boundary}
Content-Disposition: form-data; name="tags"

funny,deno
${boundary}
Content-Disposition: form-data; name="media_file"; filename="test.png"
Content-Type: image/png

<binary content here>
${boundary}--`;

  // Step 3: Create the request with the correct headers
  const request = new Request("http://localhost/createMeme", {
    method: "POST",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
    },
    body: body.trim(),
  });

  // Mock user object
  const user = { user_id: "12345" };

  // Call the createMeme function
  const response = await createMeme(request, user);

  // Assert the response status
  assertEquals(response.status, 201);
});
