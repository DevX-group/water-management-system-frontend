import '@/index.css';
import React from 'react';
import { Search, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Inquiry } from '@/types/inquiry';

interface InquiryListProps {
  loading:       boolean;
  filtered:      Inquiry[];
  selectedId:    string | null;
  search:        string;
  filter:        string;
  currentIndex:  number;
  itemsPerPage:  number;
  setSearch:     (v: string) => void;
  setFilter:     (v: string) => void;
  setSelectedId: (id: string) => void;
  setCurrentIndex: (fn: (prev: number) => number) => void;
}

export const InquiryList: React.FC<InquiryListProps> = ({
  loading, filtered, selectedId, search, filter, currentIndex, itemsPerPage,
  setSearch, setFilter, setSelectedId, setCurrentIndex,
}) => {
  return (
    <Card className="shadow-card border-none flex flex-col h-full overflow-hidden bg-card">
      <CardHeader className="pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-10 h-11 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {['all', 'open', 'pending', 'resolved'].map((tab) => (
            <Button
              key={tab}
              variant={filter === tab ? 'default' : 'ghost'}
              size="sm"
              className="capitalize rounded-full px-4"
              onClick={() => setFilter(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-3">
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin text-primary" />
          </div>
        ) : (
          <>
            {filtered.slice(currentIndex, currentIndex + itemsPerPage).map((inq) => (
              <button
                key={inq.id}
                onClick={() => setSelectedId(inq.id)}
                className={`w-full text-left p-4 rounded-xl mb-2 transition-all border ${
                  selectedId === inq.id
                    ? 'bg-primary/5 border-primary/20 shadow-sm'
                    : 'border-transparent hover:bg-secondary/50'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm truncate">{inq.name}</span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {inq.messages[inq.messages.length - 1]?.time}
                  </span>
                </div>
                <p className="text-xs text-primary font-medium mb-1">{inq.id}</p>
                <p className="text-xs text-muted-foreground truncate line-clamp-1">
                  {inq.messages[inq.messages.length - 1]?.text}
                </p>
              </button>
            ))}

            {filtered.length > itemsPerPage && (
              <div className="flex justify-center items-center gap-2 mt-4 pb-4">
                <Button variant="ghost" size="icon" className="h-8 w-8"
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - itemsPerPage))}
                  disabled={currentIndex === 0}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {currentIndex + 1}-{Math.min(currentIndex + itemsPerPage, filtered.length)} / {filtered.length}
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8"
                  onClick={() => setCurrentIndex(prev => Math.min(filtered.length - itemsPerPage, prev + itemsPerPage))}
                  disabled={currentIndex + itemsPerPage >= filtered.length}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
