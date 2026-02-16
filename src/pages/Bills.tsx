import { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, TrendingUp, AlertCircle, CheckCircle2, Download, Eye } from "lucide-react";

const bills = [
  { period: "2025 November", amount: 3200, usage: 112, status: "unpaid", dueDate: "Dec 15, 2025" },
  { period: "2025 October", amount: 2800, usage: 98, status: "paid", dueDate: "Nov 15, 2025" },
  { period: "2025 September", amount: 3100, usage: 108, status: "paid", dueDate: "Oct 15, 2025" },
  { period: "2025 August", amount: 2600, usage: 91, status: "paid", dueDate: "Sep 15, 2025" },
  { period: "2025 July", amount: 2900, usage: 102, status: "paid", dueDate: "Aug 15, 2025" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Bills = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.period.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const summaryStats = [
    { 
      label: "Total Paid", 
      value: "LKR 23,790", 
      icon: CheckCircle2, 
      color: "text-success",
      bgColor: "bg-success/10"
    },
    { 
      label: "Outstanding", 
      value: "LKR 2,390", 
      icon: AlertCircle, 
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    { 
      label: "Avg Monthly", 
      value: "LKR 2,100", 
      icon: TrendingUp, 
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
  ];

  

export default Bills;