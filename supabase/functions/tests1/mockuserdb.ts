// Mocked User Database
const mockUserDB: Record<
  string,
  {
    user_id: string;
    first_name: string;
    last_name: string;
    username: string;
    gender: string;
    dob: string;
    bio: string;
    interests: Record<string, any>;
    email: string;
    mobile: string;
    mfa_enabled: boolean;
    account_verified: Record<string, any>;
    preferences: string;
    languages: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    password_hash: string;
    profile_picture_url: string;
    account_status: string;
    user_type: string;
    rank: string;
    follower_count: number;
    following_count: number;
    created_at: string;
    updated_at: string;
    last_login: string | null;
    failed_login_count: number;
    lockout_time: string | null;
  }
> = {
  "550e8400-e29b-41d4-a716-446655440000": {
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    gender: "M",
    dob: "1990-01-01",
    bio: "I love memes!",
    interests: { hobbies: ["gaming", "coding"] },
    email: "john@example.com",
    mobile: "1234567890",
    mfa_enabled: false,
    account_verified: { email: true, mobile: true },
    preferences: "Public",
    languages: "English",
    address: "123 Street",
    city: "New York",
    state: "NY",
    country: "USA",
    postal_code: "10001",
    password_hash: "hashedpassword",
    profile_picture_url: "https://example.com/profile.jpg",
    account_status: "A",
    user_type: "R",
    rank: "Gold",
    follower_count: 50,
    following_count: 10,
    created_at: "2024-02-01T12:00:00Z",
    updated_at: "2024-02-02T12:00:00Z",
    last_login: "2024-02-10T15:00:00Z",
    failed_login_count: 0,
    lockout_time: null,
  },
  "123e4567-e89b-12d3-a456-426614174000": {
    user_id: "123e4567-e89b-12d3-a456-426614174000",
    first_name: "Jane",
    last_name: "Doe",
    username: "janedoe",
    gender: "F",
    dob: "1992-05-15",
    bio: "Private user.",
    interests: { hobbies: ["reading", "traveling"] },
    email: "jane@example.com",
    mobile: "9876543210",
    mfa_enabled: true,
    account_verified: { email: true, mobile: true },
    preferences: "Private",
    languages: "English, French",
    address: "456 Avenue",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    postal_code: "90001",
    password_hash: "securepassword",
    profile_picture_url: "https://example.com/jane.jpg",
    account_status: "A",
    user_type: "R",
    rank: "Silver",
    follower_count: 20,
    following_count: 5,
    created_at: "2023-12-10T10:00:00Z",
    updated_at: "2024-01-05T11:00:00Z",
    last_login: "2024-02-15T18:00:00Z",
    failed_login_count: 1,
    lockout_time: null,
  },
};
