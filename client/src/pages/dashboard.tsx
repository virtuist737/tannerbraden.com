import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Eye, Clock, MousePointer, PenSquare, Mail, Smartphone, History, Heart, 
  Star, Code, Music, RefreshCw, Calendar, ArrowUp, Layers, Smartphone as MobileIcon,
  Laptop, Monitor, BarChart as ChartIcon, Globe, Maximize, Chrome  
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { PageView, BlogPost } from "@shared/schema";
import { dateFormat } from "@/lib/utils";

// Enhanced Analytics types
interface AnalyticsData {
  pageViews: { date: string; count: number }[];
  metrics: {
    totalViews: number;
    bounceRate: number;
    averageEngagement: number;
    deviceBreakdown: Record<string, number>;
  };
  browserStats: Record<string, number>;
  topPages: { path: string; count: number }[];
  rawPageViews: PageView[];
}

interface PageViewsByPath {
  pageViewsByPath: { path: string; count: number; date: string }[];
  topPages: { path: string; count: number }[];
}

interface DeviceStats {
  deviceStats: Record<string, number>;
  browserStats: Record<string, number>;
}

interface TrendData {
  trends: { date: string; count: number }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF80AB", "#8884d8", "#82ca9d", "#ffc658"];

const getFormattedDate = (dateStr: string) => {
  try {
    // First try to parse as ISO string
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');
  const [activeTab, setActiveTab] = useState("overview");

  // Main analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics, refetch: refetchAnalytics } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/pageviews", { days: timeRange }],
  });

  // Page analytics
  const { data: pageAnalytics, isLoading: isLoadingPageAnalytics } = useQuery<PageViewsByPath>({
    queryKey: ["/api/analytics/pages", { days: timeRange }],
    enabled: activeTab === "pages",
  });

  // Device analytics
  const { data: deviceAnalytics, isLoading: isLoadingDeviceAnalytics } = useQuery<DeviceStats>({
    queryKey: ["/api/analytics/devices"],
    enabled: activeTab === "devices",
  });

  // Trend analytics
  const { data: trendAnalytics, isLoading: isLoadingTrendAnalytics } = useQuery<TrendData>({
    queryKey: ["/api/analytics/trends", { days: timeRange }],
    enabled: activeTab === "trends",
  });

  // Blog posts for reference
  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const metrics = analyticsData?.metrics ?? {
    totalViews: 0,
    bounceRate: 0,
    averageEngagement: 0,
    deviceBreakdown: {},
  };

  const getDeviceIcon = (deviceType: string) => {
    switch(deviceType.toLowerCase()) {
      case 'mobile':
        return <MobileIcon className="h-4 w-4" />;
      case 'tablet':
        return <Laptop className="h-4 w-4" />;
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  const getBrowserIcon = (browser: string) => {
    return <Globe className="h-4 w-4" />;
  };

  const formatPathName = (path: string) => {
    if (path === '/') return 'Home';
    return path.replace(/^\/|\/$/g, '').replace(/-/g, ' ').replace(/\//g, ' › ');
  };

  const handleRefresh = () => {
    refetchAnalytics();
  };

  const isLoading = isLoadingAnalytics || 
    (activeTab === "pages" && isLoadingPageAnalytics) || 
    (activeTab === "devices" && isLoadingDeviceAnalytics) || 
    (activeTab === "trends" && isLoadingTrendAnalytics);

  return (
    <div className="py-6 sm:py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter mb-1">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Track and analyze website traffic</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="inline-flex bg-muted p-1 rounded-md">
            <Button 
              variant={timeRange === '7' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setTimeRange('7')}
              className="text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              7 Days
            </Button>
            <Button 
              variant={timeRange === '30' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setTimeRange('30')}
              className="text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              30 Days
            </Button>
            <Button 
              variant={timeRange === '90' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setTimeRange('90')}
              className="text-xs"
            >
              <Calendar className="h-3 w-3 mr-1" />
              90 Days
            </Button>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Last {timeRange} days</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(metrics.bounceRate * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Single page sessions</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(metrics.averageEngagement)}s
                </div>
                <p className="text-xs text-muted-foreground">Time on page</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mobile Traffic</CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.deviceBreakdown?.mobile && metrics.totalViews
                    ? ((metrics.deviceBreakdown.mobile / metrics.totalViews) * 100).toFixed(0)
                    : 0}%
                </div>
                <p className="text-xs text-muted-foreground">Of total visitors</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Traffic Trends</CardTitle>
                  <CardDescription>Visitor count over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {isLoadingAnalytics ? (
                      <div className="h-full flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : analyticsData?.pageViews && analyticsData.pageViews.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.pageViews}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={getFormattedDate}
                          />
                          <YAxis />
                          <RechartsTooltip 
                            formatter={(value: any) => [`${value} views`, 'Views']}
                            labelFormatter={(label) => getFormattedDate(label as string)}
                          />
                          <Line
                            type="monotone"
                            dataKey="count"
                            name="Views"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center flex-col">
                        <ChartIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No traffic data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg">Device Distribution</CardTitle>
                  <CardDescription>Visits by device type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {isLoadingAnalytics ? (
                      <div className="h-full flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : Object.keys(metrics.deviceBreakdown).length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(metrics.deviceBreakdown).map(([key, value]) => ({
                              name: key === 'mobile' ? 'Mobile' : key === 'desktop' ? 'Desktop' : key === 'tablet' ? 'Tablet' : key,
                              value,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.keys(metrics.deviceBreakdown).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center flex-col">
                        <Smartphone className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No device data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Top Pages</CardTitle>
                  <CardDescription>Most visited pages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {isLoadingAnalytics ? (
                      <div className="h-full flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : analyticsData?.topPages && analyticsData.topPages.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.topPages.slice(0, 10)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="path" 
                            tickFormatter={formatPathName}
                            angle={-45}
                            textAnchor="end"
                            height={70}
                          />
                          <YAxis />
                          <RechartsTooltip
                            formatter={(value: any) => [`${value} views`, 'Views']}
                            labelFormatter={(label) => formatPathName(label as string)}
                          />
                          <Bar
                            dataKey="count"
                            name="Page Views"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center flex-col">
                        <Globe className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No page view data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="pages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Page Performance</CardTitle>
                <CardDescription>Popularity of pages over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {isLoadingPageAnalytics ? (
                    <div className="h-full flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : pageAnalytics?.topPages && pageAnalytics.topPages.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pageAnalytics.topPages.slice(0, 15)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="path" 
                          width={150} 
                          tickFormatter={formatPathName}
                        />
                        <RechartsTooltip
                          formatter={(value: any) => [`${value} views`, 'Views']}
                          labelFormatter={(label) => formatPathName(label as string)}
                        />
                        <Bar
                          dataKey="count"
                          name="Page Views"
                          fill="hsl(var(--primary))"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center flex-col">
                      <Layers className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No page performance data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="devices" className="space-y-6">
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Device Types</CardTitle>
                  <CardDescription>Visitor breakdown by device</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {isLoadingDeviceAnalytics ? (
                      <div className="h-full flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : deviceAnalytics?.deviceStats && Object.keys(deviceAnalytics.deviceStats).length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(deviceAnalytics.deviceStats).map(([key, value]) => ({
                              name: key === 'mobile' ? 'Mobile' : key === 'desktop' ? 'Desktop' : key === 'tablet' ? 'Tablet' : key,
                              value,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.entries(deviceAnalytics.deviceStats).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center flex-col">
                        <Smartphone className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No device data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Browser Types</CardTitle>
                  <CardDescription>Visitor breakdown by browser</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    {isLoadingDeviceAnalytics ? (
                      <div className="h-full flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : deviceAnalytics?.browserStats && Object.keys(deviceAnalytics.browserStats).length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={Object.entries(deviceAnalytics.browserStats).map(([key, value]) => ({
                              name: key || 'Unknown',
                              value,
                            }))}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {Object.entries(deviceAnalytics.browserStats).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center flex-col">
                        <Globe className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No browser data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Device Breakdown</CardTitle>
                  <CardDescription>Detailed device statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {isLoadingDeviceAnalytics ? (
                      <div className="h-32 flex items-center justify-center">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : deviceAnalytics?.deviceStats && Object.keys(deviceAnalytics.deviceStats).length > 0 ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Device Types</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(deviceAnalytics.deviceStats).map(([device, count], i) => (
                              <Card key={i} className="p-4 flex items-center gap-3">
                                {getDeviceIcon(device)}
                                <div>
                                  <div className="font-medium capitalize">{device || 'Unknown'}</div>
                                  <div className="text-sm text-muted-foreground">{count} visitors</div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">Browser Types</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(deviceAnalytics.browserStats).map(([browser, count], i) => (
                              <Card key={i} className="p-4 flex items-center gap-3">
                                {getBrowserIcon(browser)}
                                <div>
                                  <div className="font-medium">{browser || 'Unknown'}</div>
                                  <div className="text-sm text-muted-foreground">{count} visitors</div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 flex items-center justify-center flex-col">
                        <Maximize className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No detailed device data available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Traffic Trends</CardTitle>
                <CardDescription>Detailed view of traffic patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  {isLoadingTrendAnalytics ? (
                    <div className="h-full flex items-center justify-center">
                      <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : trendAnalytics?.trends && trendAnalytics.trends.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendAnalytics.trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={getFormattedDate}
                        />
                        <YAxis />
                        <RechartsTooltip 
                          formatter={(value: any) => [`${value} views`, 'Views']}
                          labelFormatter={(label) => getFormattedDate(label as string)}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          name="Views"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center flex-col">
                      <ChartIcon className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No trend data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/blog">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenSquare className="h-5 w-5" />
                  Blog Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create, edit, and manage your blog posts
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/timeline">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Timeline Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage your professional timeline and experiences
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/interests">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Interests Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Update and organize your interests and activities
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/favorites">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Favorites Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Curate and manage your favorite items
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/projects">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Projects Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage and showcase your projects
                </p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/loop-machine">
            <Card className="hover:bg-accent transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Loop Machine Presets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage default settings and presets for the Loop Machine
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;