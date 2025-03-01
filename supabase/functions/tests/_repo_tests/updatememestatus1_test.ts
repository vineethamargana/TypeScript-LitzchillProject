import { MEME_STATUS } from "@shared/_constants/Types.ts";
import { updateMemeStatusQuery } from "@repository/_meme_repo/MemeRepository.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";



Deno.test("updatememestatus- success", async function () {
    console.log("Running: updatememestatus- success");
    const mockClient = mockSupabase({ meme_id: "123", meme_status: MEME_STATUS.APPROVED, meme_title: "Funny memes" }, null);
    console.log("Mock Supabase client:", mockClient.from().update().eq());

    const result = await updateMemeStatusQuery("123", MEME_STATUS.APPROVED, "9a9afb14-acbc-481a-a315-4b946dbf0491", mockClient as any);
    console.log("Result:", result);
    assertEquals(result.data, null);

});


function mockSupabase(data: { meme_id: string; meme_status: string; meme_title: string }, error: null) {
    console.log("Running: mockSupabase");   

    function fromFunction() {
        console.log("Running: fromFunction → Calling updateFunction()");
        return { update: updateFunction };
    }

    function updateFunction() {
        console.log("Running: updateFunction → Calling eqFunction()");
        return { eq: eqFunction };
    }

    function eqFunction() {
        console.log("Running: eqFunction → Returning eqFunction() or neqFunction()");
        return { eq: eqFunction, neq: neqFunction };
    }

    function neqFunction() {
        console.log("Running: neqFunction → Calling selectFunction()");
        return { select: selectFunction };
    }

    function selectFunction() {
        console.log("Running: selectFunction → Calling singleFunction()");
        return { single: singleFunction };
    }

     function singleFunction() {
        console.log("Running: singleFunction → Returning final data.");
        return Promise.resolve({ data, error });
    }

    return { from: fromFunction };
}
