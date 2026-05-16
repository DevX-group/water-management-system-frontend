import '@/index.css';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { X, Plus } from 'lucide-react';

interface BlogCreateFormProps {
  showForm:   boolean;
  uploading:  boolean;
  formData:   { title: string; category: string; image: string; content: string };
  imageFile:  File | null;
  onToggle:   () => void;
  onSubmit:   (e: React.FormEvent) => void;
  onChange:   (data: { title: string; category: string; image: string; content: string }) => void;
  onFileChange: (file: File | null) => void;
}

export const BlogCreateForm: React.FC<BlogCreateFormProps> = ({
  showForm, uploading, formData, imageFile, onToggle, onSubmit, onChange, onFileChange,
}) => (
  <>
    <div className="flex justify-between items-center mb-10">
      <h1 className="text-3xl font-bold">Blog Management</h1>
      <Button onClick={onToggle} className="rounded-full px-6 gradient-primary">
        {showForm ? <><X className="mr-2" />Cancel</> : <><Plus className="mr-2" />Add New Blog</>}
      </Button>
    </div>

    <AnimatePresence>
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }} className="mb-12 overflow-hidden"
        >
          <Card className="border-none shadow-xl bg-white p-8 rounded-3xl">
            <form onSubmit={onSubmit} className="space-y-4">
              <Input placeholder="Blog Title" value={formData.title}
                onChange={e => onChange({ ...formData, title: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Department/Category" value={formData.category}
                  onChange={e => onChange({ ...formData, category: e.target.value })} required />
                <div className="flex gap-2">
                  <Input type="file" accept="image/*"
                    onChange={e => onFileChange(e.target.files?.[0] || null)} />
                  <Input placeholder="Or Image URL" value={formData.image}
                    onChange={e => onChange({ ...formData, image: e.target.value })}
                    disabled={!!imageFile} />
                </div>
              </div>
              <textarea
                placeholder="Blog Content" value={formData.content}
                onChange={e => onChange({ ...formData, content: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={6}
              />
              <Button type="submit" className="w-full gradient-primary h-12 rounded-xl font-bold" disabled={uploading}>
                {uploading ? <><Loader2 className="animate-spin mr-2" />Publishing...</> : 'Publish Now'}
              </Button>
            </form>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  </>
);
