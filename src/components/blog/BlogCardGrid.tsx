import '@/index.css';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar, User, ArrowRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Blog {
  id:       number;
  title:    string;
  category: string;
  date:     string;
  imageUrl: string;
  content:  string;
}

interface BlogCardGridProps {
  blogs:       Blog[];
  onDelete:    (id: number) => void;
  onExpand:    (blog: Blog) => void;
}

export const BlogCardGrid: React.FC<BlogCardGridProps> = ({ blogs, onDelete, onExpand }) => {
  const { t } = useTranslation('adminBlog');

  return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {blogs.map(blog => (
      <motion.div key={blog.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[32px] overflow-hidden bg-card group">
          <div className="relative h-56 overflow-hidden">
            <img src={blog.imageUrl} alt={blog.title}       // Blog Image with hover zoom effect
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <Button variant="destructive" size="icon"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
              onClick={() => onDelete(blog.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
          <CardContent className="p-7">
            <div className="flex items-center gap-4 text-slate-400 text-sm mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} /> {/*Display formatted date*/}
                <span>{new Date(blog.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={14} />
                <span>{blog.category}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-8">{blog.title}</h3>
            <div className="flex items-center gap-2 text-primary font-bold cursor-pointer hover:gap-4 transition-all"
              onClick={() => onExpand(blog)}>
              <span>{t('readMore')}</span><ArrowRight size={18} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
  );
};

interface BlogPostModalProps {
  blog:    Blog | null;
  onClose: () => void;
}

export const BlogPostModal: React.FC<BlogPostModalProps> = ({ blog, onClose }) => (
  <AnimatePresence>
    {blog && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}>
        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
          className="bg-card rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
          onClick={e => e.stopPropagation()}>
          <div className="relative h-[300px] sm:h-[400px]">
            <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" />
            <Button variant="ghost" size="icon"
              className="absolute top-6 right-6 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white rounded-full h-12 w-12"
              onClick={onClose}>
              <X size={24} />
            </Button>
          </div>
          <div className="p-8 sm:p-12 overflow-y-auto flex-1">
            <div className="flex items-center gap-4 text-slate-400 text-sm mb-6">
              {[{ icon: Calendar, text: new Date(blog.date).toLocaleDateString() }, { icon: User, text: blog.category }].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full font-medium text-slate-600">
                  <Icon size={16} /><span>{text}</span>
                </div>
              ))}
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-8 leading-tight">{blog.title}</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">{blog.content}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
