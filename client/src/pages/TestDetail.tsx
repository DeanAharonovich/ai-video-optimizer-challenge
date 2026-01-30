import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useTest, useTestAnalytics, useAnalyzeTest } from "@/hooks/use-tests";
import { ArrowLeft, Clock, Users, PlayCircle, BarChart2, Lightbulb, Loader2, Share2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function TestDetail() {
  const [, params] = useRoute("/tests/:id");
  const id = parseInt(params?.id || "0");
  
  const { data: test, isLoading: isTestLoading, refetch: refetchTest } = useTest(id);
  const [timeRange, setTimeRange] = useState<'1h' | '1d' | '1w' | '1m'>('1w');
  const { data: analytics, isLoading: isAnalyticsLoading, refetch: refetchAnalytics } = useTestAnalytics(id, timeRange);
  const { mutate: analyze, isPending: isAnalyzing, data: analysis } = useAnalyzeTest();

  // Handle data refresh
  const handleRefresh = () => {
    refetchTest();
    refetchAnalytics();
  };

  if (isTestLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3 bg-slate-100" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-xl bg-slate-100" />
          <Skeleton className="h-32 rounded-xl bg-slate-100" />
          <Skeleton className="h-32 rounded-xl bg-slate-100" />
        </div>
        <Skeleton className="h-96 rounded-xl bg-slate-100" />
      </div>
    );
  }

  if (!test) return <div className="text-center p-12">Test not found</div>;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-display font-bold text-slate-900">{test.name}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Running
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              {test.durationDays} days remaining
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1.5" />
              {test.targetPopulation.toLocaleString()} targeted
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={handleRefresh}>
             <RefreshCw className="w-4 h-4 mr-2" /> Refresh Data
           </Button>
           <Button variant="outline" size="sm">
             <Share2 className="w-4 h-4 mr-2" /> Share Report
           </Button>
           <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
             Edit Configuration
           </Button>
        </div>
      </div>

      {/* Variants Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {test.variants.map((variant, idx) => (
          <div key={variant.id} className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
            <div className="aspect-video bg-slate-100 relative overflow-hidden">
               {/* Stock image placeholder using unsplash logic */}
              <img 
                src={variant.thumbnailUrl || (idx === 0 
                  ? "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60" /* marketing dashboard chart */
                  : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60" /* data analytics screen */
                )} 
                alt={variant.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                 <span className="font-medium bg-black/50 px-2 py-1 rounded text-sm backdrop-blur-sm">{variant.name}</span>
                 <PlayCircle className="w-8 h-8 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-slate-900">{variant.name}</h4>
              <p className="text-sm text-slate-500 mt-1 line-clamp-1">{variant.description || "No description provided."}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Chart Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-semibold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
              Performance Analytics
            </h3>
            <p className="text-sm text-slate-500">Real-time conversion metrics comparison</p>
          </div>
          <Tabs defaultValue="1w" onValueChange={(v) => setTimeRange(v as any)} className="w-auto">
            <TabsList className="bg-slate-100 p-1 rounded-lg">
              {['1h', '1d', '1w', '1m'].map(t => (
                <TabsTrigger 
                  key={t} 
                  value={t}
                  className="px-3 py-1.5 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
                >
                  {t.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="h-[400px] w-full">
          {isAnalyticsLoading ? (
            <div className="h-full w-full flex items-center justify-center bg-slate-50 rounded-xl">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(ts) => format(new Date(ts), timeRange === '1h' ? 'HH:mm' : 'MMM d')}
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }}
                  labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '8px' }}
                  labelFormatter={(ts) => format(new Date(ts), 'PPP p')}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                
                {/* Variant A Line */}
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  name="Variant A (Views)" 
                  stroke="#4f46e5" /* Indigo */
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                {/* Variant B Line */}
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  name="Variant B (Views)" 
                  stroke="#10b981" /* Emerald */
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 text-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Lightbulb className="w-6 h-6 text-yellow-300" />
              </div>
              <h3 className="text-xl font-display font-semibold">AI Optimization Insight</h3>
            </div>

            <AnimatePresence mode="wait">
              {!analysis && !isAnalyzing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <p className="text-indigo-100 text-lg leading-relaxed">
                    Ready to generate insights? Our AI will analyze user interaction patterns, retention rates, and conversion data to recommend the optimal variant.
                  </p>
                  <Button 
                    onClick={() => analyze(id)}
                    className="mt-4 bg-white text-indigo-900 hover:bg-indigo-50 border-none font-semibold shadow-lg shadow-black/10 transition-transform active:scale-95"
                  >
                    Generate Analysis
                  </Button>
                </motion.div>
              ) : isAnalyzing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <Loader2 className="w-10 h-10 animate-spin text-white/80 mb-4" />
                  <p className="text-indigo-100 font-medium">Analyzing behavioral data...</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-md border border-white/10">
                    <h4 className="text-sm font-bold text-indigo-200 uppercase tracking-wider mb-2">Executive Summary</h4>
                    <p className="text-white text-lg leading-relaxed font-medium">
                      {analysis?.summary}
                    </p>
                  </div>
                  
                  <div className="bg-emerald-500/20 rounded-xl p-6 backdrop-blur-md border border-emerald-500/30">
                     <h4 className="text-sm font-bold text-emerald-200 uppercase tracking-wider mb-2">Recommendation</h4>
                     <p className="text-white">
                       {analysis?.recommendation}
                     </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Stats Summary Box */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-center gap-6">
          <div className="text-center pb-6 border-b border-slate-100">
            <p className="text-sm text-slate-500 font-medium mb-1">Total Conversion Lift</p>
            <h3 className="text-5xl font-display font-bold text-emerald-600 tracking-tight">
              {test.totalGain || "+0.0%"}
            </h3>
            <span className="inline-block mt-2 text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
              Confidence: 94%
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Duration</span>
              <span className="font-medium text-slate-900">7 Days</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Sample Size</span>
              <span className="font-medium text-slate-900">{test.targetPopulation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Significance</span>
              <span className="font-medium text-slate-900">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
