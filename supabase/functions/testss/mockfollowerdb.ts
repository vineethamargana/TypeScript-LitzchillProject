// Mocked Followers Database
const mockFollowerDB: Record<
  string, // user_id of the followed user
  { follower_id: string }[]
> = {
  // John Doe (Followed by Jane, Mike, Emma)
  "550e8400-e29b-41d4-a716-446655440000": [
    { follower_id: "123e4567-e89b-12d3-a456-426614174000" },
    { follower_id: "789e4567-e89b-12d3-a456-426614174999" },
    { follower_id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" },
  ],

  // Jane Smith (Followed by John, Alex, Chris)
  "123e4567-e89b-12d3-a456-426614174000": [
    { follower_id: "550e8400-e29b-41d4-a716-446655440000" },
    { follower_id: "a0b1c2d3-e4f5-6789-abcd-ef0123456789" },
    { follower_id: "b1c2d3e4-f567-890a-bcde-f01234567890" },
  ],

  // Mike Johnson (Followed by Sarah, David, Rachel)
  "789e4567-e89b-12d3-a456-426614174999": [
    { follower_id: "c2d3e4f5-6789-0abc-def0-123456789abc" },
    { follower_id: "d3e4f567-890a-bcde-f012-34567890abcd" },
    { follower_id: "e4f56789-0abc-def0-1234-567890abcdef" },
  ],

  // Emma Davis (Followed by Brian, Olivia, Ethan)
  "f47ac10b-58cc-4372-a567-0e02b2c3d479": [
    { follower_id: "f567890a-bcde-f012-3456-7890abcdef01" },
    { follower_id: "67890abc-def0-1234-5678-90abcdef0123" },
    { follower_id: "7890abcd-ef01-2345-6789-0abcdef01234" },
  ],
};
