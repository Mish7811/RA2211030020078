import { useEffect, useState } from 'react';
import { Post } from '../types';
import { getCachedData } from '../api';
import { MessageSquare, Clock } from 'lucide-react';

export default function LiveFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getCachedData();
        setPosts(data.posts.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
    const interval = setInterval(fetchPosts, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <Clock className="w-8 h-8 mr-3 text-blue-500" />
        Live Feed
      </h1>
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <img
                  src={`https://source.unsplash.com/random/40x40?portrait=${post.userId}`}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <p className="text-sm text-gray-600">
                    {new Date(post.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-900 mb-4">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={`https://source.unsplash.com/random/800x400?nature=${post.id}`}
                  alt="Post content"
                  className="rounded-lg mb-4"
                />
              )}
              <div className="flex items-center text-gray-600">
                <MessageSquare className="w-5 h-5 mr-2" />
                <span>{post.comments.length} comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}