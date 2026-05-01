import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Trash2, Calendar, User, ArrowRight, X, Loader2 
} from 'lucide-react';

const API_URL = "http://localhost:8081/api/blogs";

export const AdminBlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '', image: '', content: '' });

  // 1. Fetch Blogs on Load
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

  // 2. Handle Create (POST)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const blogPost = {
      title: formData.title,
      category: formData.category,
      imageUrl: formData.image || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
      content: formData.content
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogPost),
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ title: '', category: '', image: '', content: '' });
        fetchBlogs(); // Refresh list
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  };

  // 3. Handle Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Blog Management</h1>
          <Button onClick={() => setShowForm(!showForm)} className="rounded-full px-6 gradient-primary">
            {showForm ? <X className="mr-2" /> : <Plus className="mr-2" />}
            {showForm ? "Cancel" : "Add New Blog"}
          </Button>
        </div>

        {/* Create Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-12 overflow-hidden">
              <Card className="border-none shadow-xl bg-white p-8 rounded-3xl">
                <form onSubmit={handleCreate} className="space-y-4">
                  <Input placeholder="Blog Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Department/Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                    <Input placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                  </div>
                  <textarea 
                    placeholder="Blog Content" 
                    value={formData.content} 
                    onChange={e => setFormData({...formData, content: e.target.value})} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                    rows={6} 
                  />
                  <Button type="submit" className="w-full gradient-primary h-12 rounded-xl font-bold">Publish Now</Button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <motion.div key={blog.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[32px] overflow-hidden bg-white group">
                <div className="relative h-56 overflow-hidden">
                  <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <Button 
                    variant="destructive" size="icon" 
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                    onClick={() => handleDelete(blog.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <CardContent className="p-7">
                  <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      <span>{blog.category}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-8">{blog.title}</h3>
                  <div className="flex items-center gap-2 text-blue-500 font-bold cursor-pointer hover:gap-4 transition-all">
                    <span>Read More</span>
                    <ArrowRight size={18} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    
  );
};