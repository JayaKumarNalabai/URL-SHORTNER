import { useState, useEffect, useCallback } from 'react';
import { createUrl, getUrls, deleteUrl } from '../lib/api';
import { Url, CreateUrlRequest } from '../lib/types';
import { useAuth } from '../contexts/AuthContext';
import UrlForm from '../components/UrlForm';
import UrlTable from '../components/UrlTable';
import StatsCard from '../components/StatsCard';
import { formatDate } from '../lib/utils';

const DashboardPage = () => {
  const { user } = useAuth();
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [formLoading, setFormLoading] = useState(false);

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUrls({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
      });
      setUrls(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalItems(response.pagination.totalItems);
    } catch (err) {
      console.error('Failed to fetch URLs:', err);
      alert(err instanceof Error ? err.message : 'Failed to load URLs');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleCreateUrl = async (data: CreateUrlRequest) => {
    setFormLoading(true);
    try {
      await createUrl(data);
      await fetchUrls();
      setCurrentPage(1);
    } catch (err) {
      throw err;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteUrl(id);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Calculate stats from current page data
  const totalLinks = totalItems;
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const mostClicked = urls.length > 0 
    ? urls.reduce((max, url) => (url.clicks > max.clicks ? url : max), urls[0])
    : null;
  const lastActive = urls.length > 0 && urls.some(u => u.lastAccessedAt)
    ? urls
        .filter(u => u.lastAccessedAt)
        .sort((a, b) => new Date(b.lastAccessedAt!).getTime() - new Date(a.lastAccessedAt!).getTime())[0]
    : null;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome, {user?.email}
        </h1>
        <p className="text-slate-600">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Links"
          value={totalLinks}
          icon={<span className="text-3xl">🔗</span>}
        />
        <StatsCard
          title="Total Clicks"
          value={totalClicks}
          icon={<span className="text-3xl">👆</span>}
        />
        <StatsCard
          title="Most Clicked"
          value={mostClicked ? (mostClicked.title || mostClicked.shortId) : 'N/A'}
          icon={<span className="text-3xl">⭐</span>}
        />
        <StatsCard
          title="Last Active"
          value={lastActive ? formatDate(lastActive.lastAccessedAt!) : 'Never'}
          icon={<span className="text-3xl">🕐</span>}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shorten URL Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Shorten a URL</h2>
            <p className="text-sm text-slate-600 mb-4">
              Create a short, memorable link for any URL
            </p>
            <UrlForm onSubmit={handleCreateUrl} loading={formLoading} />
          </div>
        </div>

        {/* Recent Links (Optional) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Links</h2>
            {urls.length > 0 ? (
              <div className="space-y-3">
                {urls.slice(0, 5).map((url) => (
                  <div
                    key={url.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {url.title || url.shortId}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{url.originalUrl}</p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-semibold text-indigo-600">{url.clicks}</p>
                      <p className="text-xs text-slate-500">clicks</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No links yet. Create your first one!</p>
            )}
          </div>
        </div>
      </div>

      {/* Full URLs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Links</h2>
        <UrlTable
          urls={urls}
          loading={loading}
          onDelete={handleDelete}
          onRefresh={fetchUrls}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
