import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { getCachedData } from '../api';

type Post = {
  id: number;
  content: string;
  comments?: string[];
};

// Extend Post to include imageUrl dynamically
type PostWithImage = Omit<Post, 'comments'> & { imageUrl: string; comments: string[] };

const randomImages = [
  "https://source.unsplash.com/random/400x300/?nature",
  "https://source.unsplash.com/random/400x300/?technology",
  "https://source.unsplash.com/random/400x300/?city",
  "https://source.unsplash.com/random/400x300/?people",
  "https://source.unsplash.com/random/400x300/?animals",
  "https://source.unsplash.com/random/400x300/?abstract"
];

const getRandomImage = () => randomImages[Math.floor(Math.random() * randomImages.length)];

export default function LiveFeed() {
  const [posts, setPosts] = useState<PostWithImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getCachedData('posts');
        console.log("API Response:", data);

        if (!Array.isArray(data)) {
          console.error('Unexpected API response:', data);
          return;
        }

        const postsWithImageUrl: PostWithImage[] = data.map((post: Post) => ({
          ...post,
          imageUrl: getRandomImage(),
          comments: post.comments ?? [] // Ensuring comments is always an array
        }));

        setPosts(postsWithImageUrl);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Live Feed</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <p className="text-gray-900 mb-4">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
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
