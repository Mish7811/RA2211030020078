import { useEffect, useState } from 'react';
import { User } from '../types';
import { getCachedData } from '../api';
import { Trophy } from 'lucide-react';

export default function TopUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getCachedData();
        const sortedUsers = [...data.users].sort((a, b) => b.postCount - a.postCount).slice(0, 5);
        setUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
        Top Contributors
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
              <p className="text-gray-500">{user.postCount} posts</p>
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