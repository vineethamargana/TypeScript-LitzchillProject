import { MEME_STATUS } from "@shared/_constants/Types.ts";

export const mockMemeDB: Record<string, {
    meme_id: string;
    user_id: string | null;
    meme_title: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    meme_status: string;
    like_count: number;
    comment_count: number;
    flag_count: number;
    risk_score: number;
    tags: Record<string, any> | null;
  }> = {
    "088f3d23-6136-48ea-9ede-6f8d64f1e6ed": {
      meme_id: "088f3d23-6136-48ea-9ede-6f8d64f1e6ed",
      user_id: "ee03f406-fb76-4432-ba82-cddea44c5b1c",
      meme_title: "Funny Cat Meme",
      image_url: "https://example.com/meme1.jpg",
      created_at: "2024-02-20T12:00:00Z",
      updated_at: "2024-02-20T12:30:00Z",
      meme_status: MEME_STATUS.APPROVED, // One of: 'Pending', 'Approved', 'Rejected'
      like_count: 15,
      comment_count: 4,
      flag_count: 0,
      risk_score: 0.2,
      tags: { category: "animals", trending: true },
    },
    "2f161080-1788-4a68-8365-3d43dedeb976": {
      meme_id: "2f161080-1788-4a68-8365-3d43dedeb976",
      user_id: "c5229ac1-ea19-46f9-afd2-545c66f3d6d5",
      meme_title: "Office Humor",
      image_url: "https://example.com/meme2.jpg",
      created_at: "2024-02-18T15:30:00Z",
      updated_at: "2024-02-19T10:45:00Z",
      meme_status: MEME_STATUS.DELETED, 
      like_count: 8,
      comment_count: 2,
      flag_count: 1,
      risk_score: 0.8,
      tags: { category: "work", nsfw: false },
    },
    "5a7d39b4-908c-4cbb-9b57-3f1e3a58d6a4": {
      meme_id: "5a7d39b4-908c-4cbb-9b57-3f1e3a58d6a4",
      user_id: "dd722c6a-2176-4ff2-a003-a8b391108501", 
      meme_title: "Programming Joke",
      image_url: "https://example.com/meme3.jpg",
      created_at: "2024-02-15T08:45:00Z",
      updated_at: "2024-02-16T09:10:00Z",
      meme_status: MEME_STATUS.PENDING, 
      like_count: 2,
      comment_count: 0,
      flag_count: 3,
      risk_score: 2.5,
      tags: { category: "tech", language: "JavaScript" },
    },
    "aa8c1d2e-76bf-4920-8473-d6b6c2f0e788": {
      meme_id: "aa8c1d2e-76bf-4920-8473-d6b6c2f0e788",
      user_id: "f6d6e7f8-9a10-4b2c-a1b3-5c6d7e8f9a10",
      meme_title: "Dark Humor",
      image_url: "https://example.com/meme4.jpg",
      created_at: "2024-02-10T20:15:00Z",
      updated_at: "2024-02-11T21:30:00Z",
      meme_status: MEME_STATUS.APPROVED, 
      like_count: 20,
      comment_count: 5,
      flag_count: 2,
      risk_score: 1.5,
      tags: { category: "dark", adult_content: true },
    }
  };
  
  