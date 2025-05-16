
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetaAdsData } from "@/types/dashboard";
import { LineChart, BarChart } from "@/components/ui/chart";
import { formatNumber, formatCurrency, getWeekNumber } from "@/utils/format";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface WeeklyTabProps {
  data: MetaAdsData[];
}

const WeeklyTab = ({ data }: WeeklyTabProps) => {
  // Group data by week
  const weeklyData = data.reduce((acc, item) => {
    const date = new Date(item.date_start);
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    const weekKey = `${year}-W${week}`;
    
    if (!acc[weekKey]) {
      acc[weekKey] = {
        week: weekKey,
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
    
    acc[weekKey].spend += item.spend;
    acc[weekKey].impressions += item.impressions;
    acc[weekKey].clicks += item.clicks;
    acc[weekKey].ctr += item.ctr;
    acc[weekKey].cpc += item.cpc;
    acc[weekKey].cpm += item.cpm;
    acc[weekKey].actions_landing_page_view += item.actions_landing_page_view;
    acc[weekKey].cost_per_landing_page_view += item.cost_per_action_type_landing_page_view;
    acc[weekKey].actions_link_click += item.actions_link_click;
    acc[weekKey].cost_per_link_click += item.cost_per_action_type_link_click;
    acc[weekKey].actions_page_engagement += item.actions_page_engagement;
    acc[weekKey].cost_per_page_engagement += item.cost_per_action_type_page_engagement;
    acc[weekKey].actions_video_view += item.actions_video_view;
    acc[weekKey].cost_per_video_view += item.cost_per_action_type_video_view;
    acc[weekKey].count++;
    
    return acc;
  }, {} as Record<string, any>);
  
  // Calculate averages for metrics that need it
  Object.keys(weeklyData).forEach(week => {
    const count = weeklyData[week].count;
    weeklyData[week].ctr /= count;
    weeklyData[week].cpc /= count;
    weeklyData[week].cpm /= count;
    weeklyData[week].cost_per_landing_page_view /= count;
    weeklyData[week].cost_per_link_click /= count;
    weeklyData[week].cost_per_page_engagement /= count;
    weeklyData[week].cost_per_video_view /= count;
  });
  
  // Convert to array and sort by week
  const sortedWeeklyData = Object.values(weeklyData).sort((a, b) => 
    a.week.localeCompare(b.week));

  // Prepare data for Cost per Result chart
  const costPerResultData = sortedWeeklyData.map(week => ({
    week: week.week,
    'Landing Page View': week.cost_per_landing_page_view,
    'Link Click': week.cost_per_link_click,
    'Page Engagement': week.cost_per_page_engagement,
    'Video View': week.cost_per_video_view
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Spend vs Actions</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart 
              data={sortedWeeklyData}
              categories={['spend', 'actions_link_click', 'actions_video_view']}
              index="week"
              colors={["#ea384c", "#4CAF50", "#2563eb"]}
              valueFormatter={(value) => `${formatCurrency(value)}`}
              yAxisWidth={60}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Cost per Result</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart 
              data={costPerResultData}
              categories={['Landing Page View', 'Link Click', 'Page Engagement', 'Video View']}
              index="week"
              colors={["#ea384c", "#3B82F6", "#10B981", "#F59E0B"]}
              valueFormatter={(value) => `${formatCurrency(value)}`}
              yAxisWidth={60}
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Week</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                  <TableHead className="text-right">CPM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedWeeklyData.map((week) => (
                  <TableRow key={week.week}>
                    <TableCell>{week.week}</TableCell>
                    <TableCell className="text-right">{formatNumber(week.impressions)}</TableCell>
                    <TableCell className="text-right">{formatNumber(week.clicks)}</TableCell>
                    <TableCell className="text-right">{(week.ctr * 100).toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{formatCurrency(week.spend)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(week.cpc)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(week.cpm)}</TableCell>
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

export default WeeklyTab;
