
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetaAdsData } from "@/types/dashboard";
import { LineChart, BarChart } from "@/components/ui/chart";
import { formatNumber, formatCurrency } from "@/utils/format";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface DailyTabProps {
  data: MetaAdsData[];
}

const DailyTab = ({ data }: DailyTabProps) => {
  // Group data by day
  const dailyData = data.reduce((acc, item) => {
    const date = item.date_start;
    
    if (!acc[date]) {
      acc[date] = {
        date,
        spend: 0,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        actions_landing_page_view: 0,
        cost_per_landing_page_view: 0,
        actions_link_click: 0,
        cost_per_link_click: 0,
        actions_page_engagement: 0,
        cost_per_page_engagement: 0,
        actions_video_view: 0,
        cost_per_video_view: 0,
        count: 0
      };
    }
    
    acc[date].spend += item.spend;
    acc[date].impressions += item.impressions;
    acc[date].clicks += item.clicks;
    acc[date].ctr += item.ctr;
    acc[date].cpc += item.cpc;
    acc[date].cpm += item.cpm;
    acc[date].actions_landing_page_view += item.actions_landing_page_view;
    acc[date].cost_per_landing_page_view += item.cost_per_action_type_landing_page_view;
    acc[date].actions_link_click += item.actions_link_click;
    acc[date].cost_per_link_click += item.cost_per_action_type_link_click;
    acc[date].actions_page_engagement += item.actions_page_engagement;
    acc[date].cost_per_page_engagement += item.cost_per_action_type_page_engagement;
    acc[date].actions_video_view += item.actions_video_view;
    acc[date].cost_per_video_view += item.cost_per_action_type_video_view;
    acc[date].count++;
    
    return acc;
  }, {} as Record<string, any>);
  
  // Calculate averages for metrics that need it
  Object.keys(dailyData).forEach(date => {
    const count = dailyData[date].count;
    dailyData[date].ctr /= count;
    dailyData[date].cpc /= count;
    dailyData[date].cpm /= count;
    dailyData[date].cost_per_landing_page_view /= count;
    dailyData[date].cost_per_link_click /= count;
    dailyData[date].cost_per_page_engagement /= count;
    dailyData[date].cost_per_video_view /= count;
  });
  
  // Convert to array and sort by date
  const sortedDailyData = Object.values(dailyData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime());

  // Prepare data for Cost per Result chart
  const costPerResultData = sortedDailyData.map(day => ({
    date: day.date,
    'Landing Page View': day.cost_per_landing_page_view,
    'Link Click': day.cost_per_link_click,
    'Page Engagement': day.cost_per_page_engagement,
    'Video View': day.cost_per_video_view
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Spend vs Actions</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart 
              data={sortedDailyData}
              categories={['spend', 'actions_link_click', 'actions_video_view']}
              index="date"
              colors={["#ea384c", "#4CAF50", "#2563eb"]}
              valueFormatter={(value) => `${formatCurrency(value)}`}
              yAxisWidth={60}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Daily Cost per Result</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart 
              data={costPerResultData}
              categories={['Landing Page View', 'Link Click', 'Page Engagement', 'Video View']}
              index="date"
              colors={["#ea384c", "#3B82F6", "#10B981", "#F59E0B"]}
              valueFormatter={(value) => `${formatCurrency(value)}`}
              yAxisWidth={60}
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Daily Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                  <TableHead className="text-right">CPM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDailyData.map((day) => (
                  <TableRow key={day.date}>
                    <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{formatNumber(day.impressions)}</TableCell>
                    <TableCell className="text-right">{formatNumber(day.clicks)}</TableCell>
                    <TableCell className="text-right">{(day.ctr * 100).toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{formatCurrency(day.spend)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(day.cpc)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(day.cpm)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTab;
