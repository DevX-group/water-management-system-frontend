import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/blogs");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <MainLayout isAuthenticated={true}>
        <div className="flex justify-center p-20">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout isAuthenticated={true}>
      <div className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            /* --- BLOG LIST VIEW --- */
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h1 className="text-4xl font-bold mb-10 text-center text-gradient">HydroPay Blog</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {posts.map(post => (
                  <Card 
                    key={post.id} 
                    onClick={() => setSelectedPost(post)}
                    className="border-none shadow-card hover:translate-y-[-6px] transition-all cursor-pointer group overflow-hidden"
                  >
                    <div className="h-48 overflow-hidden">
                        <img 
                            src={post.imageUrl || post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(post.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><User size={12}/> {post.category || post.author}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <Button variant="link" className="p-0 text-primary flex items-center">
                        Read More <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          ) : (
            /* --- FULL POST VIEW --- */
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-3xl mx-auto"
            >
              <Button 
                variant="ghost" 
                onClick={() => setSelectedPost(null)}
                className="mb-8 hover:bg-secondary/50 rounded-xl"
              >
                <ArrowLeft size={18} className="mr-2" /> Back to Blog
              </Button>

              <img 
                src={selectedPost.imageUrl || selectedPost.image} 
                alt={selectedPost.title} 
                className="w-full h-[400px] object-cover rounded-3xl shadow-lg mb-8"
              />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 bg-secondary/30 px-3 py-1 rounded-full text-xs">
                    <Calendar size={14}/> {new Date(selectedPost.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5 bg-secondary/30 px-3 py-1 rounded-full text-xs">
                    <User size={14}/> {selectedPost.category || selectedPost.author}
                  </span>
                </div>
                
              </div>

              <h1 className="text-4xl font-bold mb-8 leading-tight">
                {selectedPost.title}
              </h1>

              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-700 leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
                <div className="mt-12 p-6 bg-primary/5 border-l-4 border-primary rounded-r-xl italic text-slate-600">
                    Join HydroPay in our mission to conserve water and protect our natural resources for future generations.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};