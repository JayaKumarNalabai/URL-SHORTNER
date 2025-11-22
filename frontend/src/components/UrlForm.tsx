import { useState, FormEvent } from 'react';
import { CreateUrlRequest } from '../lib/types';
import { isValidUrl } from '../lib/utils';

interface UrlFormProps {
  onSubmit: (data: CreateUrlRequest) => Promise<void>;
  loading?: boolean;
}

const UrlForm = ({ onSubmit, loading = false }: UrlFormProps) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!originalUrl.trim()) {
      setError('URL is required');
      return;
    }

    if (!isValidUrl(originalUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await onSubmit({
        originalUrl: originalUrl.trim(),
        title: title.trim() || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });

      setSuccess('URL shortened successfully!');
      setOriginalUrl('');
      setTitle('');
      setTags('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create short URL');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="originalUrl" className="block text-sm font-medium text-slate-700 mb-1">
          Original URL *
        </label>
        <input
          type="text"
          id="originalUrl"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          required
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
          Title (optional)
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My awesome link"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-slate-700 mb-1">
          Tags (optional, comma-separated)
        </label>
        <input
          type="text"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="work, important, project"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Creating...' : 'Shorten URL'}
      </button>
    </form>
  );
};

export default UrlForm;

