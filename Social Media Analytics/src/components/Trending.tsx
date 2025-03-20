import { useEffect, useState } from 'react';
import { Post } from '../types';
import { getCachedData } from '../api';
import { TrendingUp as Trending } from 'lucide-react';

export default function TrendingPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrendingPosts() {
      try {
        const data = await getCachedData();
        const sortedPosts = [...data.posts].sort(
          (a, b) => b.comments.length - a.comments.length
        );
        const maxComments = sortedPosts[0]?.comments.length || 0;
        const trendingPosts = sortedPosts.filter(
          post => post.comments.length === maxComments
        );
        setPosts(trendingPosts);
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
        {posts.map(post => (
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
                  {post.comments.length} comments
                </h3>
                <div className="space-y-3">
                  {post.comments.slice(0, 3).map(comment => (
                    <div key={comment.id} className="text-sm text-gray-600">
                      {comment.content}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}