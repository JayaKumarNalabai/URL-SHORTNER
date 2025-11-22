import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Url } from '../lib/types';
import { truncateUrl, formatDate } from '../lib/utils';
import CopyButton from './CopyButton';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

interface UrlTableProps {
  urls: Url[];
  loading: boolean;
  onDelete: (id: string) => Promise<void>;
  onRefresh: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UrlTable = ({
  urls,
  loading,
  onDelete,
  onRefresh,
  searchQuery,
  onSearchChange,
  currentPage,
  totalPages,
  onPageChange,
}: UrlTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete URL');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && urls.length === 0) {
    return <LoadingSpinner />;
  }

  if (!loading && urls.length === 0 && !searchQuery) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search by URL or title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Short URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Original URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {loading && urls.length > 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : urls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No URLs found
                  </td>
                </tr>
              ) : (
                urls.map((url) => (
                  <tr key={url.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700 font-mono text-sm"
                        >
                          {url.shortUrl}
                        </a>
                        <CopyButton text={url.shortUrl} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm text-slate-600 max-w-xs truncate"
                        title={url.originalUrl}
                      >
                        {truncateUrl(url.originalUrl, 40)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {url.title || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {url.clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {formatDate(url.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/stats/${url.id}`}
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          Stats
                        </Link>
                        <button
                          onClick={() => handleDelete(url.id)}
                          disabled={deletingId === url.id}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          {deletingId === url.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UrlTable;

