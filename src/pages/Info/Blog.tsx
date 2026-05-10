import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, ArrowLeft, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const posts = [
  { 
    id: 1, 
    title: "5 Ways to Save Water This Summer", 
    date: "April 10, 2026", 
    author: "HydroPay Team",
    image: "https://images.unsplash.com/photo-1527031252199-070894000398?auto=format&fit=crop&q=80&w=800",
    content: "With summer temperatures rising, water conservation is more critical than ever. Here are five easy ways to reduce your footprint: 1. Fix leaky faucets immediately. 2. Water your garden only at night. 3. Upgrade to high-efficiency showerheads. 4. Use a broom, not a hose, to clean driveways. 5. Only run the dishwasher when it's full."
  },
  { 
    id: 2, 
    title: "Understanding Your Digital Water Bill", 
    date: "March 22, 2026", 
    author: "Billing Dept",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
    content: "Our new HydroPay digital bills are designed for clarity. Every bill breaks down your base rate, unit usage, and tax amount. By logging into your dashboard, you can see historical trends and compare this month's usage to the previous year to help you manage your budget better."
  },
  { 
    id: 3, 
    title: "The Future of Smart Water Management", 
    date: "February 15, 2026", 
    author: "Engineering",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    content: "Smart meters are just the beginning. The future of water management involves AI-driven leak detection and IoT sensors that can automatically shut off supply in case of emergencies. HydroPay is currently testing pressure sensors that help identify micro-leaks before they become expensive burst pipes."
  }
];

export const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<typeof posts[0] | null>(null);

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
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                        <span className="flex items-center gap-1"><User size={12}/> {post.author}</span>
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
                src={selectedPost.image} 
                alt={selectedPost.title} 
                className="w-full h-[400px] object-cover rounded-3xl shadow-lg mb-8"
              />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 bg-secondary/30 px-3 py-1 rounded-full text-xs">
                    <Calendar size={14}/> {selectedPost.date}
                  </span>
                  <span className="flex items-center gap-1.5 bg-secondary/30 px-3 py-1 rounded-full text-xs">
                    <User size={14}/> {selectedPost.author}
                  </span>
                </div>
                
              </div>

              <h1 className="text-4xl font-bold mb-8 leading-tight">
                {selectedPost.title}
              </h1>

              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-700 leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left">
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