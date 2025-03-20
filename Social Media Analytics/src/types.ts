export interface User {
    id: string;
    name: string;
    postCount: number;
    avatarUrl: string;
  }
  
  export interface Comment {
    id: string;
    userId: string;
    content: string;
    timestamp: string;
  }
  
  export interface Post {
    id: string;
    userId: string;
    content: string;
    timestamp: string;
    comments: Comment[];
    imageUrl: string;
  }
  
  export interface ApiResponse {
    users: User[];
    posts: Post[];
  }