const API_URL = 'http://20.244.56.144/test';

type Users = {
  [key: string]: string; 
};

type Post = {
  id: number;
  userId: number;
  content: string;
  timestamp: string;
  comments: string;
};

export type ApiResponse = {
  users: Users;
  posts: Post[];
};

export async function fetchData(): Promise<ApiResponse> {
  try {
    const [usersResponse, postsResponse] = await Promise.all([
      fetch(`${API_URL}/users`),
      fetch(`${API_URL}/posts`)
    ]);

    if (!usersResponse.ok || !postsResponse.ok) {
      throw new Error(`HTTP Error! Users: ${usersResponse.status}, Posts: ${postsResponse.status}`);
    }

    const users: Users = await usersResponse.json();
    const posts: Post[] = await postsResponse.json();

    return { users, posts };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data. Please try again later.');
  }
}

let cachedData: ApiResponse | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; 

export async function getCachedData(): Promise<ApiResponse> {
  const now = Date.now();
  if (!cachedData || now - lastFetchTime > CACHE_DURATION) {
    try {
      cachedData = await fetchData();
      lastFetchTime = now;
    } catch (error) {
      console.error('Error updating cache:', error);
      throw error;
    }
  }
  return cachedData;
}
