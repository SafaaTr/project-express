import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { API_ENDPOINTS } from '../services/api.js';
import { PlusCircle, Trash2, Edit3, Loader2, X, Check, User } from 'lucide-react';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // حالات التعديل
  const [editingPostId, setEditingPostId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const { token, user } = useContext(AuthContext); // جلب الـ user من الـ Context

 
  const userName = user?.name || localStorage.getItem('userName') || 'User';

  // دالة ذكية لاستخراج مصفوفة البوستات من أي شكل استجابة للباك إند
  const extractPostsArray = (resData) => {
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData?.posts)) return resData.posts;
    if (Array.isArray(resData?.data)) return resData.data;
    if (Array.isArray(resData?.data?.posts)) return resData.data.posts;
    return [];
  };

  // دالة ذكية لاستخراج بوست واحد (عند الإنشاء أو التعديل)
  const extractSinglePost = (resData) => {
    return resData?.post || resData?.data?.post || resData?.data || resData;
  };

  const fetchPosts = async () => {
    const activeToken = token || localStorage.getItem('token');

    if (!activeToken) {
      setError("Please log in first to see the posts.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.posts, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts');
      }

      const postsArray = extractPostsArray(data);
      setPosts(postsArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token !== undefined) {
      fetchPosts();
    }
  }, [token]);

  // إضافة بوست جديد (POST)
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const activeToken = token || localStorage.getItem('token');
    setSubmitting(true);

    try {
      const response = await fetch(API_ENDPOINTS.posts, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create post');
      }

      const newPost = extractSinglePost(data);
      
      if (newPost && (newPost._id || newPost.id)) {
        setPosts([newPost, ...posts]);
        setTitle('');
        setContent('');
      } else {
        fetchPosts();
        setTitle('');
        setContent('');
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // فتح وضع التعديل
  const startEditing = (post) => {
    setEditingPostId(post._id || post.id);
    setEditTitle(post.title || '');
    setEditContent(post.content || '');
  };

  // إلغاء التعديل
  const cancelEditing = () => {
    setEditingPostId(null);
    setEditTitle('');
    setEditContent('');
  };

 
  const handleUpdatePost = async (postId) => {
    if (!editTitle.trim() || !editContent.trim()) return;

    const activeToken = token || localStorage.getItem('token');

    try {
      const response = await fetch(`${API_ENDPOINTS.posts}/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`,
        },
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update post');
      }

      const updatedPost = extractSinglePost(data);
      const targetId = postId;

      setPosts(
        posts.map((post) => {
          const currentId = post._id || post.id;
          return currentId === targetId ? (updatedPost && (updatedPost._id || updatedPost.id) ? updatedPost : { ...post, title: editTitle, content: editContent }) : post;
        })
      );
      
      cancelEditing();
    } catch (err) {
      alert(err.message);
    }
  };

  // حذف بوست (DELETE)
  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const activeToken = token || localStorage.getItem('token');

    try {
      const response = await fetch(`${API_ENDPOINTS.posts}/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts(posts.filter((post) => (post._id || post.id) !== postId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="text-center py-20 font-medium flex justify-center items-center gap-2 text-slate-600"><Loader2 className="animate-spin text-blue-600" /> Loading posts...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-medium">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
   
      <div className="flex justify-between items-center mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-blue-900 font-medium">
          <User size={20} className="text-blue-600" />
          <span>Welcome</span>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-slate-800">Latest Posts</h1>

      {/* نموذج إنشاء بوست جديد */}
      <form onSubmit={handleCreatePost} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <PlusCircle className="text-blue-600" size={20} /> Add New Post
        </h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Post Content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
        >
          {submitting ? 'Posting...' : 'Publish Post'}
        </button>
      </form>

      {/* عرض المنشورات */}
      <div className="grid gap-6 md:grid-cols-2">
        {posts.length === 0 ? (
          <p className="text-slate-500 col-span-2 text-center py-6">No posts found.</p>
        ) : (
          posts.map((post) => {
            const postId = post._id || post.id;
            const isEditing = editingPostId === postId;

            return (
              <div key={postId || Math.random()} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                {isEditing ? (
                  // === وضع التعديل ===
                  <div className="space-y-3 mb-4">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg font-semibold"
                    />
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdatePost(postId)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        <Check/> Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // === العرض العادي ===
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">{post.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">{post.content}</p>
                  </div>
                )}

                {/* أزرار التعديل والحذف */}
                {!isEditing && (
                  <div className="flex justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => startEditing(post)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      <Edit3 size={16} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePost(postId)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}