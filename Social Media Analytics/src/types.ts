export interface User {
    id: string;
    name: string;
    postCount: number;
    avatarUrl: string;
  }
  
export interface Comment {
  id: number;
  postid: number;
  content: string;
}

export interface Post {
  id: number; 
  userId: number;
  content: string;
  timestamp?: string; 
  comments?: string;  
  imageUrl?: string;  
}


export interface ApiResponse {
  users: User[];
  posts: Post[];
  comments: Comment[]; 
}