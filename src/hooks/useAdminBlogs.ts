import { useState, useEffect } from 'react';
import type { BlogPost, BlogFormData } from '@/types/blog';
import { api } from '@/services/api';

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
      const response = await api.get<BlogPost[]>('/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  // Handles the creation of a new blog post. 
  
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let imageUrl = formData.image || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800";

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('file', imageFile);
      try {
        const uploadRes = await api.post<{ imageUrl: string }>('/blogs/upload-image', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = uploadRes.data.imageUrl;
      } catch (err) { setUploading(false); return; }
    }

    try {
      await api.post('/blogs', { title: formData.title, category: formData.category, imageUrl, content: formData.content });
      setShowForm(false);
      setFormData({ title: '', category: '', image: '', content: '' });
      setImageFile(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error creating blog:", error);
    } finally {
      setUploading(false);
    }
  };

  // Deletes a blog post by its ID using a DELETE request to the API.
 
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/blogs/${id}`);
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
