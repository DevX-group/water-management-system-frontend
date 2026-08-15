import '@/index.css';
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { X, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BlogCreateFormProps {
  showForm: boolean;
  uploading: boolean;
  formData: { title: string; category: string; image: string; content: string };
  imageFile: File | null;
  onToggle: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: { title: string; category: string; image: string; content: string }) => void;
  onFileChange: (file: File | null) => void;
}

export const BlogCreateForm: React.FC<BlogCreateFormProps> = ({
  showForm, uploading, formData, imageFile, onToggle, onSubmit, onChange, onFileChange,
}) => {
  const { t } = useTranslation('adminBlog');
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <Button onClick={onToggle} className="rounded-full px-6">
          {showForm ? <><X className="mr-2" />{t('cancel')}</> : <><Plus className="mr-2" />{t('addNewBlog')}</>}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} className="mb-12 overflow-hidden"
          >
            <Card className="border-none shadow-xl bg-card p-8 rounded-3xl">
              <form onSubmit={onSubmit} className="space-y-4">
                <Input placeholder={t('form.title')} value={formData.title}    // Title Input
                  onChange={e => onChange({ ...formData, title: e.target.value })} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder={t('form.category')} value={formData.category}   // Category Input
                    onChange={e => onChange({ ...formData, category: e.target.value })} required />
                  <div className="flex gap-2">
                    <div className="flex items-center h-10 w-full rounded-md border border-input bg-background overflow-hidden">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => onFileChange(e.target.files?.[0] || null)}
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-full px-3 border-r border-input bg-background hover:bg-primary/10 hover:text-primary text-foreground text-sm font-medium transition-colors whitespace-nowrap"
                      >
                        {t("form.chooseFile")}
                      </button>

                      <span className="px-3 text-sm text-muted-foreground truncate">
                        {imageFile ? imageFile.name : t("form.noFileChosen")}
                      </span>
                    </div>
                    <Input placeholder={t('form.image')} value={formData.image}  // Image URL Input
                      onChange={e => onChange({ ...formData, image: e.target.value })}
                      disabled={!!imageFile} />
                  </div>
                </div>
                <textarea    // Content Textarea
                  placeholder={t('form.content')} value={formData.content}
                  onChange={e => onChange({ ...formData, content: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={6}
                />
                <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={uploading}>
                  {uploading ? <><Loader2 className="animate-spin mr-2" />{t('form.publishing')}</> : t('form.publishNow')}
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
