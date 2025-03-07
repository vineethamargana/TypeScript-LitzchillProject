import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import sinon from "https://cdn.skypack.dev/sinon@14.0.0" assert { type: "json" };
import { insertLikeQuery } from "../path/to/insertLikeQuery.ts";

// Mock Supabase client
const supabaseMock = {
    from: sinon.stub().returns({
        upsert: sinon.stub(),
    }),
};

// ✅ Test case: Successful insert
Deno.test("insertLikeQuery should return data on success", async () => {
    const fakeData = { id: "like123" };

    // Mock upsert to return fake data
    supabaseMock.from().upsert.resolves({ data: fakeData, error: null });

    const result = await insertLikeQuery("meme123", "user123", "like");
    assertEquals(result, { data: fakeData, error: null });
});

// ❌ Test case: Failure (Database Error)
Deno.test("insertLikeQuery should return an error on failure", async () => {
    const fakeError = { message: "Database failure" };

    // Mock upsert to return an error
    supabaseMock.from().upsert.resolves({ data: null, error: fakeError });

    const result = await insertLikeQuery("meme123", "user123", "like");
    assertEquals(result, { data: null, error: fakeError });
});
