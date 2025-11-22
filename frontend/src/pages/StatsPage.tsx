import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUrlStats } from '../lib/api';
import { UrlStats } from '../lib/types';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CopyButton from '../components/CopyButton';
import { formatDate } from '../lib/utils';

const StatsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [stats, setStats] = useState<UrlStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!id) {
        setError('Invalid URL ID');
        setLoading(false);
        return;
      }

      try {
        const response = await getUrlStats(id);
        setStats(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'Stats not found'}</p>
          <Link
            to="/dashboard"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Link Statistics</h1>
        <Link
          to="/dashboard"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">URL Details</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-600">Short URL</label>
            <div className="flex items-center gap-2 mt-1">
              <a
                href={stats.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 font-mono"
              >
                {stats.shortUrl}
              </a>
              <CopyButton text={stats.shortUrl} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Original URL</label>
            <p className="mt-1 text-slate-900 break-all">{stats.originalUrl}</p>
          </div>
          {stats.title && (
            <div>
              <label className="text-sm font-medium text-slate-600">Title</label>
              <p className="mt-1 text-slate-900">{stats.title}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Clicks"
          value={stats.totalClicks}
          icon={<span className="text-3xl">👆</span>}
        />
        <StatsCard
          title="Created At"
          value={formatDate(stats.createdAt)}
          icon={<span className="text-3xl">📅</span>}
        />
        <StatsCard
          title="Last Accessed"
          value={stats.lastAccessedAt ? formatDate(stats.lastAccessedAt) : 'Never'}
          icon={<span className="text-3xl">🕐</span>}
        />
      </div>
    </div>
  );
};

export default StatsPage;

