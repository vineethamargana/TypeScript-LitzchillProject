import { assertStrictEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { uploadFileToBucket } from "@repository/_meme_repo/MemeRepository.ts";

function createMockSupabase(response: { publicUrl?: string; error?: string }) {
  return {
    storage: {
      from: () => ({
        getPublicUrl: () => ({
          data: { publicUrl: response.publicUrl || null },
        }),
        upload: async () => {
          if (response.error) {
            return { data: null, error: response.error };
          }
          return { data: response.publicUrl ? { path: "memes/funny_meme.jpg" } : null, error: null };
        },
      }),
    },
  };
}

Deno.test("uploadFileToBucket - success case", async function () {
  const mediaFile = new File(["test content"], "test-image.jpg", { type: "image/jpeg" });
  const memeTitle = "funny_meme";
  const supabaseMock = createMockSupabase({ publicUrl: "https://example.com/memes/funny_meme.jpg" });

  const result = await uploadFileToBucket(mediaFile, memeTitle, supabaseMock as any);
  assertStrictEquals(result, "https://example.com/memes/funny_meme.jpg");
});

Deno.test("uploadFileToBucket - unsupported file type", async function () {
  const mediaFile = new File(["test content"], "test.txt", { type: "text/plain" });
  const memeTitle = "funny_meme";

  const result = await uploadFileToBucket(mediaFile, memeTitle);
  assertStrictEquals(result, null);
});

Deno.test("uploadFileToBucket - file already exists", async function () {
  const mediaFile = new File(["test content"], "test-image.jpg", { type: "image/jpeg" });
  const memeTitle = "funny_meme";
  const supabaseMock = createMockSupabase({ publicUrl: "https://example.com/memes/funny_meme.jpg" });

  const result = await uploadFileToBucket(mediaFile, memeTitle, supabaseMock as any);
  assertStrictEquals(result, "https://example.com/memes/funny_meme.jpg");
});

Deno.test("uploadFileToBucket - upload error", async function () {
  const mediaFile = new File(["test content"], "test-image.jpg", { type: "image/jpeg" });
  const memeTitle = "funny_meme";
  const supabaseMock = createMockSupabase({ error: "Upload failed" });

  const result = await uploadFileToBucket(mediaFile, memeTitle, supabaseMock as any);
  assertStrictEquals(result, null);
});
