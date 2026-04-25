import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Trash2, Calendar, User, ArrowRight, FileText, X, Send 
} from 'lucide-react';

// --- Mock Data matching your image ---
const MOCK_BLOGS = [
  {
    id: 1,
    title: "Understanding Your Digital Water Bill",
    category: "Billing Dept",
    date: "March 22, 2026",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "The Future of Smart Water Management",
    category: "Engineering",
    date: "February 15, 2026",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
  }
];

export const AdminBlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState(MOCK_BLOGS);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '', image: '', description: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newPost = {
      id: Date.now(),
      title: formData.title,
      category: formData.category,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      image: formData.image || "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    };
    setBlogs([newPost, ...blogs]);
    setShowForm(false);
    setFormData({ title: '', category: '', image: '', description: '' });
  };

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

                    <div className="space-y-4">
                      <textarea 
                        placeholder="write here..." 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})} 
                        required 
                        className="w-full p-3 border border-gray-300 rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                 
                  <Button type="submit" className="w-full gradient-primary h-12 rounded-xl font-bold">Publish Now</Button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- THE BLOG GRID (Matching your image) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <motion.div key={blog.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[32px] overflow-hidden bg-white group">
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
                    onClick={() => setBlogs(blogs.filter(b => b.id !== blog.id))}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <CardContent className="p-7">
                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{blog.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} />
                      <span>{blog.category}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-8">
                    {blog.title}
                  </h3>

                  {/* Read More Link */}
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