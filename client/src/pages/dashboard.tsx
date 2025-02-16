import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, Clock, MousePointer } from "lucide-react";

// Mock data - In a real application, this would come from your analytics API
const pageViewsData = [
  { date: "2024-02-10", views: 120 },
  { date: "2024-02-11", views: 150 },
  { date: "2024-02-12", views: 180 },
  { date: "2024-02-13", views: 220 },
  { date: "2024-02-14", views: 190 },
  { date: "2024-02-15", views: 250 },
  { date: "2024-02-16", views: 280 },
];

const pageEngagementData = [
  { page: "Home", avgTimeSpent: 145 },
  { page: "About", avgTimeSpent: 90 },
  { page: "Portfolio", avgTimeSpent: 180 },
  { page: "Blog", avgTimeSpent: 210 },
  { page: "Contact", avgTimeSpent: 60 },
];

const trafficSourceData = [
  { name: "Direct", value: 400 },
  { name: "Social", value: 300 },
  { name: "Search", value: 500 },
  { name: "Referral", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const totalViews = pageViewsData.reduce((sum, item) => sum + item.views, 0);
  const avgEngagement = Math.round(
    pageEngagementData.reduce((sum, item) => sum + item.avgTimeSpent, 0) /
      pageEngagementData.length,
  );

  return (
    <div className="py-6 sm:py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sm:space-y-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter">Analytics Dashboard</h1>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Engagement</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgEngagement}s</div>
              <p className="text-xs text-muted-foreground">Per page visit</p>
            </CardContent>
          </Card>
          {/* Add more overview cards as needed */}
        </div>

        {/* Charts */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Page Views Trend */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Page Views Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pageViewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="views"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Page Engagement */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Page Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageEngagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="page" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar
                      dataKey="avgTimeSpent"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={trafficSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trafficSourceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;