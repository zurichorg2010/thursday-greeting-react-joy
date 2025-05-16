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

interface MonthlyTabProps {
  data: MetaAdsData[];
}

const MonthlyTab = ({ data }: MonthlyTabProps) => {
  // Get start and end dates
  const dates = data.map(item => new Date(item.date_start));
  const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const endDate = new Date(Math.max(...dates.map(d => d.getTime())));

  // Generate all months in range
  const allMonths: Record<string, any> = {};
  for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
    
    allMonths[monthKey] = {
      month: monthKey,
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

  // Fill in actual data
  data.forEach(item => {
    const date = new Date(item.date_start);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
    
    if (allMonths[monthKey]) {
      allMonths[monthKey].spend += item.spend;
      allMonths[monthKey].impressions += item.impressions;
      allMonths[monthKey].clicks += item.clicks;
      allMonths[monthKey].ctr += item.ctr;
      allMonths[monthKey].cpc += item.cpc;
      allMonths[monthKey].cpm += item.cpm;
      allMonths[monthKey].actions_landing_page_view += item.actions_landing_page_view;
      allMonths[monthKey].cost_per_landing_page_view += item.cost_per_action_type_landing_page_view;
      allMonths[monthKey].actions_link_click += item.actions_link_click;
      allMonths[monthKey].cost_per_link_click += item.cost_per_action_type_link_click;
      allMonths[monthKey].actions_page_engagement += item.actions_page_engagement;
      allMonths[monthKey].cost_per_page_engagement += item.cost_per_action_type_page_engagement;
      allMonths[monthKey].actions_video_view += item.actions_video_view;
      allMonths[monthKey].cost_per_video_view += item.cost_per_action_type_video_view;
      allMonths[monthKey].count++;
    }
  });

  // Calculate averages for metrics that need it
  Object.keys(allMonths).forEach(month => {
    const count = allMonths[month].count;
    if (count > 0) {
      allMonths[month].ctr /= count;
      allMonths[month].cpc /= count;
      allMonths[month].cpm /= count;
      allMonths[month].cost_per_landing_page_view /= count;
      allMonths[month].cost_per_link_click /= count;
      allMonths[month].cost_per_page_engagement /= count;
      allMonths[month].cost_per_video_view /= count;
    }
  });

  // Convert to array and sort by month
  const sortedMonthlyData = Object.values(allMonths).sort((a, b) => 
    a.month.localeCompare(b.month));

  // Format month labels for display
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const displayMonthlyData = sortedMonthlyData.map(item => {
    const [year, monthNum] = item.month.split('-');
    const monthIndex = parseInt(monthNum) - 1;
    return {
      ...item,
      displayMonth: `${monthNames[monthIndex]} ${year}`
    };
  });

  // Prepare data for Cost per Result chart
  const costPerResultData = displayMonthlyData.map(month => ({
    month: month.displayMonth,
    'Landing Page View': month.cost_per_landing_page_view,
    'Link Click': month.cost_per_link_click,
    'Page Engagement': month.cost_per_page_engagement,
    'Video View': month.cost_per_video_view
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spend vs Actions</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart 
              data={displayMonthlyData}
              categories={['spend', 'actions_link_click', 'actions_video_view']}
              index="displayMonth"
              colors={["#ea384c", "#4CAF50", "#2563eb"]}
              valueFormatter={(value) => `${formatCurrency(value)}`}
              yAxisWidth={60}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Cost per Result</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <BarChart 
              data={costPerResultData}
              categories={['Landing Page View', 'Link Click', 'Page Engagement', 'Video View']}
              index="month"
              colors={["#ea384c", "#3B82F6", "#10B981", "#F59E0B"]}
              valueFormatter={(value) => `${formatCurrency(value)}`}
              yAxisWidth={60}
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Spend</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                  <TableHead className="text-right">CPM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayMonthlyData.map((month) => (
                  <TableRow key={month.month}>
                    <TableCell>{month.displayMonth}</TableCell>
                    <TableCell className="text-right">{formatNumber(month.impressions)}</TableCell>
                    <TableCell className="text-right">{formatNumber(month.clicks)}</TableCell>
                    <TableCell className="text-right">{(month.ctr * 100).toFixed(2)}%</TableCell>
                    <TableCell className="text-right">{formatCurrency(month.spend)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(month.cpc)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(month.cpm)}</TableCell>
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

export default MonthlyTab;
