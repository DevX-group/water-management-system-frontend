import { useState, useEffect } from 'react';
import type { BlogPost, BlogFormData } from '@/types/blog';

const API_URL = "http://localhost:8081/api/blogs";

export const useAdminBlogs = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<BlogFormData>({ title: '', category: '', image: '', content: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [expandedBlog, setExpandedBlog] = useState<BlogPost | null>(null);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = formData.image || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800";

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('file', imageFile);
      try {
        const uploadRes = await fetch(`${API_URL}/upload-image`, { method: 'POST', body: uploadData });
        if (uploadRes.ok) imageUrl = (await uploadRes.json()).imageUrl;
        else { setUploading(false); return; }
      } catch (err) { setUploading(false); return; }
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: formData.title, category: formData.category, imageUrl, content: formData.content }),
      });
      if (response.ok) {
        setShowForm(false);
        setFormData({ title: '', category: '', image: '', content: '' });
        setImageFile(null);
        fetchBlogs();
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const toggleForm = () => setShowForm(prev => !prev);
  const closeExpandedBlog = () => setExpandedBlog(null);

  return {
    blogs,
    loading,
    showForm,
    formData,
    imageFile,
    uploading,
    expandedBlog,
    setFormData,
    setImageFile,
    setExpandedBlog,
    handleCreate,
    handleDelete,
    toggleForm,
    closeExpandedBlog,
    fetchBlogs
  };
};
