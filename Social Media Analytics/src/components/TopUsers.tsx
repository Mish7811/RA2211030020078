import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { getCachedData } from '../api';

type User = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  userid: number;
};

export default function TopUsers() {
  const [users, setUsers] = useState<(User & { postCount: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopUsers() {
      try {
        const usersResponse = await getCachedData('users');
        const postsResponse = await getCachedData('posts');

        const usersData: User[] = Array.isArray(usersResponse) ? usersResponse : [];
        const postsData: Post[] = Array.isArray(postsResponse) ? postsResponse : [];

        const postCounts: Record<number, number> = {};
        postsData.forEach((post) => {
          postCounts[post.userid] = (postCounts[post.userid] || 0) + 1;
        });

        const sortedUsers = usersData
          .map((user) => ({
            ...user,
            postCount: postCounts[user.id] || 0, 
          }))
          .sort((a, b) => b.postCount - a.postCount) 
          .slice(0, 5); 

        setUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching top users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopUsers();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
        Top Users
      </h1>
      <div className="grid gap-6">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 transform hover:scale-102 transition-transform"
          >
            <div className="flex-shrink-0">
              <img
                src={`https://source.unsplash.com/random/100x100?portrait=${user.id}`}
                alt={user.name}
                className="h-16 w-16 rounded-full"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600">{user.postCount} posts</p>
            </div>
            <div className="flex-shrink-0">
              <div className={`text-2xl font-bold ${index === 0 ? 'text-yellow-500' : 'text-gray-400'}`}>
                #{index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
