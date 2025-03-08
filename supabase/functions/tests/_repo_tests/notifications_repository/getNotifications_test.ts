import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";
import { getNotificationsQuery } from "@repository/_notifications_repo/NotificationsQueries.ts";


function mockSupabaseResponse(data: object[], error: any) {
    return {
        from: () => ({
            select: () => ({
                eq: () => ({
                    order: () => ({
                        limit: () => Promise.resolve({ data, error }),
                    }),
                }),
            }),
        }),
    };
}

Deno.test("getNotificationsQuery should return notifications when successful", async () => {
    const mockData = [{ id: "1", meme_id: "123", user_id: "456", likeable_type: "meme" }];
    const mockquery = mockSupabaseResponse(mockData, null);
    const result = await getNotificationsQuery("123", mockquery as any);
    
    console.log(result);
    assertEquals(result.data, mockData);
});


  

  