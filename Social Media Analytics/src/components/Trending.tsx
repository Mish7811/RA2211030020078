import { useEffect, useState } from 'react';
import { getCachedData } from '../api';
import { TrendingUp as Trending } from 'lucide-react';

type Post = {
  id: number;
  content: string;
  userid: number;
};

type Comment = {
  id: number;
  postid: number;
  content: string;
};

export default function TrendingPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsCount, setCommentsCount] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingPosts() {
      try {
        const postsData = await getCachedData<Post>('posts');
        const commentsData = await getCachedData<Comment>('comments');
  
        const commentCount: Record<number, number> = {};
        commentsData.forEach((comment) => {
          commentCount[comment.postid] = (commentCount[comment.postid] || 0) + 1;
        });
  
        const sortedPosts = postsData.sort(
          (a, b) => (commentCount[b.id] || 0) - (commentCount[a.id] || 0)
        );
  
        const maxComments = commentCount[sortedPosts[0]?.id] || 0;
        const trendingPosts = sortedPosts.filter(
          (post) => commentCount[post.id] === maxComments
        );
  
        setPosts(trendingPosts);
        setCommentsCount(commentCount);
      } catch (error) {
        console.error('Error fetching trending posts:', error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchTrendingPosts();
  }, []);
  

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <Trending className="w-8 h-8 mr-3 text-red-500" />
        Trending Posts
      </h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={`https://source.unsplash.com/random/800x400?nature=${post.id}`}
              alt="Post cover"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <p className="text-gray-900 text-lg mb-4">{post.content}</p>
              <div className="border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  {commentsCount[post.id] || 0} comments
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
