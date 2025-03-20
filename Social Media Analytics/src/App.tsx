import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import TopUsers from './components/TopUsers';
import TrendingPosts from './components/Trending';
import LiveFeed from './components/LiveFeed';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<TopUsers />} />
            <Route path="/trending" element={<TrendingPosts />} />
            <Route path="/feed" element={<LiveFeed />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;