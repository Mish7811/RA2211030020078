const API_URL = 'http://20.244.56.144/test';

type Users = {
  [key: string]: string; 
};

type Post = {
  id: number;
  userId: number;
  content: string;
};

type Comment = {
  id: number;
  postid: number;
  content: string;
};

export type ApiResponse = {
  users: Users;
  posts: Post[];
  comments: Comment[];
};

export async function fetchData(): Promise<ApiResponse> {
  try {
    const usersResponse = await fetch(`${API_URL}/users`);
    if (!usersResponse.ok) {
      throw new Error(`Users API error: ${usersResponse.status}`);
    }
    const users: Users = await usersResponse.json();

    let posts: Post[] = [];
    let comments: Comment[] = [];

    for (const userId of Object.keys(users)) {
      const postsResponse = await fetch(`${API_URL}/users/${userId}/posts`);
      if (postsResponse.ok) {
        const userPosts = await postsResponse.json();
        posts = posts.concat(userPosts.posts);
      }
    }

    for (const post of posts) {
      const commentsResponse = await fetch(`${API_URL}/posts/${post.id}/comments`);
      if (commentsResponse.ok) {
        const postComments = await commentsResponse.json();
        comments = comments.concat(postComments.comments);
      }
    }

    return { users, posts, comments };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data. Please try again later.');
  }
}

let cachedData: ApiResponse | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; 

export async function getCachedData<T = any>(key: string): Promise<T[]> {
  const response = await fetch(`/api/${key}`);
  if (!response.ok) throw new Error(`Failed to fetch ${key}`);
  
  const data = await response.json();
  
  return Array.isArray(data) ? data : data.data || [];
}

