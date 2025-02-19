import DeletememebyID from "../../functions/_handler/_meme_module/DeleteMeme.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";


Deno.test("DeletememebyID: Valid Request", async () => {
  // Mock request object
  const request = new Request("http://localhost/deleteMeme", {
    method: "DELETE",
  });

  // Mock parameters
  const params = {
    id: "0488fbc7-e8b9-4341-9e5b-9f0eb90a6d84",       // Replace with a valid UUID
    user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",  // Replace with a valid user ID
    user_type: "admin",        // Replace with the appropriate user type
  };

  // Call the DeletememebyID function
  const response = await DeletememebyID(request, params);

  // Assert the response status
  assertEquals(response.status, 200);

  // Assert the response message
  const responseBody = await response.json();
  assertEquals(responseBody.message, "Meme deleted successfully.");
});
