import '@/index.css';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { BlogCreateForm } from '@/components/blog/BlogCreateForm';
import { BlogCardGrid, BlogPostModal } from '@/components/blog/BlogCardGrid';
import type { BlogPost, BlogFormData } from '@/types/blog';

import { useAdminBlogs } from '@/hooks/useAdminBlogs';

export const AdminBlogPage: React.FC = () => {
  const {
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
    closeExpandedBlog
  } = useAdminBlogs();

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogCreateForm
        showForm={showForm} uploading={uploading} formData={formData} imageFile={imageFile}
        onToggle={toggleForm} onSubmit={handleCreate} onChange={setFormData} onFileChange={setImageFile}
      />
      <BlogCardGrid blogs={blogs} onDelete={handleDelete} onExpand={setExpandedBlog} />
      <BlogPostModal blog={expandedBlog} onClose={closeExpandedBlog} />
    </div>
  );
};