import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Plus, Trash2, Edit2, Loader, RefreshCw, BookOpen, User, Calendar, Check, AlertCircle } from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function BlogsTab() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    coverImageUrl: '',
    author: '',
    seoTitle: '',
    seoDescription: '',
    published: false
  });

  const [previewMode, setPreviewMode] = useState(false); // Edit vs Live HTML Preview

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      // Fetch admin blogs (includes drafts)
      const data = await apiService.getBlogsAdmin(page, 10);
      setBlogs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Title and Content are required.");
      return;
    }
    setSubmitLoading(true);
    try {
      const payload = {
        ...form,
        author: form.author.trim() || 'Admin'
      };

      if (editingBlogId) {
        await apiService.updateBlog(editingBlogId, payload);
      } else {
        await apiService.createBlog(payload);
      }

      setShowAddForm(false);
      setEditingBlogId(null);
      resetForm();
      fetchBlogs();
    } catch (err) {
      alert(`Failed to save blog: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      slug: '',
      content: '',
      coverImageUrl: '',
      author: '',
      seoTitle: '',
      seoDescription: '',
      published: false
    });
    setPreviewMode(false);
  };

  const handleEditClick = (blog) => {
    setEditingBlogId(blog.id);
    setForm({
      title: blog.title || '',
      slug: blog.slug || '',
      content: blog.content || '',
      coverImageUrl: blog.coverImageUrl || '',
      author: blog.author || '',
      seoTitle: blog.seoTitle || '',
      seoDescription: blog.seoDescription || '',
      published: blog.published || false
    });
    setShowAddForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post? This action is irreversible.")) return;
    try {
      await apiService.deleteBlog(id);
      fetchBlogs();
    } catch (err) {
      alert(`Failed to delete blog: ${err.message}`);
    }
  };

  const generateSlugFromTitle = (title) => {
    return title.toLowerCase()
      .replaceAll(/[^a-z0-9\s-]/g, "")
      .replaceAll(/\s+/g, "-")
      .replaceAll(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug === generateSlugFromTitle(prev.title) ? generateSlugFromTitle(title) : prev.slug
    }));
  };

  return (
    <div style={{ animation: 'slideDown 0.3s forwards' }}>
      
      {/* Title & Action Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 className="luxury-title" style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={18} color="var(--gold-primary)" />
          <span>Blogs & Content Management</span>
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => {
              if (showAddForm) {
                resetForm();
                setEditingBlogId(null);
                setShowAddForm(false);
              } else {
                setShowAddForm(true);
              }
            }} 
            className="btn-primary" 
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            {editingBlogId ? 'Cancel Editing' : 'Write New Post'}
          </button>
          <button onClick={fetchBlogs} className="btn-outline" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Write/Edit Post Form */}
      {showAddForm && (
        <div className="exclusive-details-card" style={{ marginBottom: '25px', padding: '20px', background: 'rgba(7,15,30,0.85)', border: '1px solid var(--border-gold)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: 'var(--gold-primary)' }}>
            {editingBlogId ? 'Edit Blog Post' : 'Publish New Blog Post'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              
              <div className="form-group">
                <label className="form-label">Blog Title *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. 5 Investment Hotspots in Pune 2026" 
                  value={form.title} 
                  onChange={handleTitleChange} 
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Custom Slug (auto-generated)</label>
                <input 
                  type="text" 
                  placeholder="e.g. investment-hotspots-pune-2026" 
                  value={form.slug} 
                  onChange={e => setForm({ ...form, slug: generateSlugFromTitle(e.target.value) })} 
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Author Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Prasad Kulkarni" 
                  value={form.author} 
                  onChange={e => setForm({ ...form, author: e.target.value })} 
                  className="form-input" 
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-light)' }}>
                  <input 
                    type="checkbox" 
                    checked={form.published} 
                    onChange={e => setForm({ ...form, published: e.target.checked })} 
                  />
                  Publish Instantly (Draft if unchecked)
                </label>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '15px', marginBottom: '15px' }}>
              {/* Cover Image Upload */}
              <ImageUploader 
                label="Cover Image" 
                currentValue={form.coverImageUrl} 
                onUploadSuccess={(url) => setForm({ ...form, coverImageUrl: url })} 
              />
            </div>

            {/* Content Field with preview tabs */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px' }}>
                <button 
                  type="button" 
                  onClick={() => setPreviewMode(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: !previewMode ? 'var(--gold-primary)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    paddingBottom: '4px',
                    borderBottom: !previewMode ? '2px solid var(--gold-primary)' : 'none'
                  }}
                >
                  Write Content (HTML Allowed)
                </button>
                <button 
                  type="button" 
                  onClick={() => setPreviewMode(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: previewMode ? 'var(--gold-primary)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    paddingBottom: '4px',
                    borderBottom: previewMode ? '2px solid var(--gold-primary)' : 'none'
                  }}
                >
                  Live Render Preview
                </button>
              </div>

              {!previewMode ? (
                <div className="form-group">
                  <textarea 
                    required 
                    placeholder="Write your article here. You can use standard HTML tags like <p>, <h3>, <strong>, <ul>, <li> for rich formatting..." 
                    value={form.content} 
                    onChange={e => setForm({ ...form, content: e.target.value })} 
                    className="form-input" 
                    rows="10"
                    style={{ minHeight: '220px', fontFamily: 'monospace', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                </div>
              ) : (
                <div style={{ 
                  minHeight: '220px', 
                  maxHeight: '400px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-muted)', 
                  borderRadius: '6px', 
                  padding: '15px', 
                  background: 'rgba(255, 255, 255, 0.02)',
                  color: 'var(--text-light)'
                }}>
                  {form.content ? (
                    <div className="blog-preview-content" dangerouslySetInnerHTML={{ __html: form.content }} />
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center', paddingTop: '80px' }}>
                      No content written yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SEO Metadata Box */}
            <div style={{ border: '1px solid rgba(212, 175, 55, 0.2)', padding: '15px', borderRadius: '8px', marginBottom: '20px', background: 'rgba(255, 255, 255, 0.01)' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--gold-primary)', fontWeight: 600 }}>SEO Meta Configuration</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">SEO Meta Title</label>
                  <input 
                    type="text" 
                    placeholder="Optimized title tag for search engines" 
                    value={form.seoTitle} 
                    onChange={e => setForm({ ...form, seoTitle: e.target.value })} 
                    className="form-input" 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">SEO Meta Description</label>
                  <textarea 
                    placeholder="Brief snippet describing article in Google Search" 
                    rows="2" 
                    value={form.seoDescription} 
                    onChange={e => setForm({ ...form, seoDescription: e.target.value })} 
                    className="form-input" 
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }}>
              <button type="button" onClick={() => { setShowAddForm(false); setEditingBlogId(null); resetForm(); }} className="btn-outline">Cancel</button>
              <button type="submit" disabled={submitLoading} className="btn-gold">
                {submitLoading ? 'Saving...' : (editingBlogId ? 'Update Post' : 'Publish Blog')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blogs list */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <Loader className="animate-spin" size={24} color="#D4AF37" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="empty-state">No blog posts found. Click "Write New Post" to start blogging.</div>
      ) : (
        <div>
          <div className="table-responsive">
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Post Info</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map(blog => (
                  <tr key={blog.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {blog.coverImageUrl && (
                          <img 
                            src={blog.coverImageUrl.startsWith('/') ? `${apiService.BASE_URL.replace('/api/v1', '')}${blog.coverImageUrl}` : blog.coverImageUrl} 
                            alt="Cover" 
                            style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }} 
                          />
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-light)' }}>{blog.title}</div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/{blog.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} color="var(--gold-primary)" />
                        <span>{blog.author}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.7rem',
                        background: blog.published ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: blog.published ? '#10B981' : '#F59E0B',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} />
                        <span>{new Date(blog.createdDate || new Date()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleEditClick(blog)} 
                          className="btn-outline" 
                          style={{ padding: '6px 8px', borderColor: 'rgba(212, 175, 55, 0.2)', color: 'var(--gold-primary)' }}
                          title="Edit Post"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(blog.id)} 
                          className="btn-outline" 
                          style={{ padding: '6px 8px', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}
                          title="Delete Post"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Simple Pagination Footer */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', padding: '10px 0' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing page {page + 1} of {totalPages} ({totalElements} posts)</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  disabled={page === 0} 
                  onClick={() => setPage(page - 1)} 
                  className="btn-outline" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  Previous
                </button>
                <button 
                  disabled={page === totalPages - 1} 
                  onClick={() => setPage(page + 1)} 
                  className="btn-outline" 
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
