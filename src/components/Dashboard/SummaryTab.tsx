import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetaAdsData } from "@/types/dashboard";
import { LineChart, BarChart } from "@/components/ui/chart";
import { formatNumber, formatCurrency } from "@/utils/format";

interface SummaryTabProps {
  data: MetaAdsData[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  summary: any;
  campaignPerformance: any[];
  actionBreakdown: any[];
}

const SummaryTab = ({ data, dateRange, summary, campaignPerformance, actionBreakdown }: SummaryTabProps) => {
  if (!summary) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading analytics data...</p>
      </div>
    );
  }
  const dateFilteredItems = data.filter(item => {
    const itemDate = new Date(item.date_start);
    return itemDate >= dateRange.from && itemDate <= dateRange.to;
});

const totalSpend = dateFilteredItems.reduce((sum, item) => {
  const spend = typeof item.spend === 'string' ? parseFloat(item.spend) : (item.spend || 0);
  return sum + (isNaN(spend) ? 0 : spend);
}, 0);

  

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.totalImpressions)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(summary.totalActions)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalSpend)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.averageCTR.toFixed(2)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Spend vs. Actions Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart 
              data={summary.spendOverTime}
              categories={['value']}
              index="date"
              colors={["#ea384c"]}
              valueFormatter={(value) => `${formatCurrency(value)}`}
              yAxisWidth={60}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Impressions Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <LineChart 
              data={summary.impressionsOverTime}
              categories={['value']}
              index="date"
              colors={["#2563eb"]}
              valueFormatter={(value) => `${formatNumber(value)}`}
              yAxisWidth={60}
            />
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
  <CardHeader>
    <CardTitle>Campaign Performance</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="rounded-md border max-w-[1000px] h-[300px] overflow-auto">
      <table className="w-full">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b">
            <th className="text-left p-4">Campaign</th>
            <th className="text-right p-4">Spend</th>
            <th className="text-right p-4">Impressions</th>
            <th className="text-right p-4">Actions</th>
            <th className="text-right p-4">CTR</th>
          </tr>
        </thead>
        <tbody>
          {campaignPerformance.map((campaign) => (
            <tr key={campaign.campaignName} className="border-b">
              <td className="p-4">{campaign.campaignName}</td>
              <td className="text-right p-4">{formatCurrency(campaign.spend)}</td>
              <td className="text-right p-4">{formatNumber(campaign.impressions)}</td>
              <td className="text-right p-4">{formatNumber(campaign.actions)}</td>
              <td className="text-right p-4">{campaign.ctr.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>


      {/* Action Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Action Type Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Action Type</th>
                  <th className="text-right p-4">Count</th>
                  <th className="text-right p-4">Cost</th>
                  <th className="text-right p-4">Cost per Action</th>
                </tr>
              </thead>
              <tbody>
                {actionBreakdown.map((action) => (
                  <tr key={action.actionType} className="border-b">
                    <td className="p-4">{action.actionType}</td>
                    <td className="text-right p-4">{formatNumber(action.count)}</td>
                    <td className="text-right p-4">{formatCurrency(action.cost)}</td>
                    <td className="text-right p-4">
                      {formatCurrency(action.count > 0 ? action.cost / action.count : 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryTab;
