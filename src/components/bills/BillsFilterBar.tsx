import '@/index.css';
import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BillsFilterBarProps {
  searchTerm:      string;
  statusFilter:    string;
  setSearchTerm:   (v: string) => void;
  setStatusFilter: (v: string) => void;
}

export const BillsFilterBar: React.FC<BillsFilterBarProps> = ({  
  searchTerm, statusFilter, setSearchTerm, setStatusFilter,
}) => (
  <Card className="shadow-card border-none mb-6">
    <CardContent className="pt-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">        {/*Search Input*/}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /> 
          <Input
            placeholder="Search by period (e.g. 2026-04)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 rounded-xl"
          />
        </div>
        {/*Status Filter Dropdown*/ } 
        <Select value={statusFilter} onValueChange={setStatusFilter}>   
          <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>
);
