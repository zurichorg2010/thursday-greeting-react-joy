import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { MetaAdsData } from "@/types/dashboard";
import { fetchMetaAdsData } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [campaignFilter, setCampaignFilter] = useState("");
  const [objectiveFilter, setObjectiveFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [spendRange, setSpendRange] = useState({ min: 0, max: 1000000 });
  const [frequencyRange, setFrequencyRange] = useState({ min: 0, max: 100 });
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({ from: null, to: null });

  // Fetch data
  const { data: rawData } = useQuery({
    queryKey: ["metaAdsData"],
    queryFn: () => fetchMetaAdsData(),
  });

  // Apply filters
  const applyFilters = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter logic here
      const filteredData = rawData?.filter(item => {
        const matchesCampaign = !campaignFilter || 
          `${item.campaign_name}`.toLowerCase().includes(`${campaignFilter}`.toLowerCase());
        const matchesObjective = !objectiveFilter || 
          `${item.objective}`.toLowerCase().includes(`${objectiveFilter}`.toLowerCase());
        const matchesCustomer = !customerFilter || 
          `${item.DisplayName}`.toLowerCase().includes(`${customerFilter}`.toLowerCase());
        const matchesSpend = item.spend >= spendRange.min && item.spend <= spendRange.max;
        const matchesFrequency = item.frequency >= frequencyRange.min && item.frequency <= frequencyRange.max;
        
        // Date range filtering
        const itemDate = new Date(item.date_start);
        const matchesDateRange = !dateRange.from || !dateRange.to || (
          itemDate >= new Date(dateRange.from.setHours(0, 0, 0, 0)) && 
          itemDate <= new Date(dateRange.to.setHours(0, 0,0, 0))
        );
        
        return matchesCampaign && matchesObjective && matchesCustomer && 
               matchesSpend && matchesFrequency && matchesDateRange;
      }) || [];

      // Calculate metrics
      const totalImpressions = filteredData.reduce((sum, item) => sum + item.impressions, 0);
      const totalActions = filteredData.reduce((sum, item) => sum + item.clicks, 0);
      const totalSpend = filteredData.reduce((sum, item) => sum + item.spend, 0);
      const averageCTR = totalImpressions > 0 ? (totalActions / totalImpressions) * 100 : 0;

      // Group data by date for charts
      const spendOverTime = filteredData.reduce((acc, item) => {
        // Extract only the date part (YYYY-MM-DD)
        const date = new Date(item.date_start).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + item.spend;
        return acc;
      }, {} as Record<string, number>);

      const impressionsOverTime = filteredData.reduce((acc, item) => {
        // Extract only the date part (YYYY-MM-DD)
        const date = new Date(item.date_start).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + item.impressions;
        return acc;
      }, {} as Record<string, number>);

      // Sort dates chronologically
      const sortedDates = Object.keys(spendOverTime).sort();
      
      // Convert to array format for charts with sorted dates
      const spendData = sortedDates.map(date => ({ 
        date, 
        value: spendOverTime[date] 
      }));
      
      const impressionsData = sortedDates.map(date => ({ 
        date, 
        value: impressionsOverTime[date] 
      }));

      // Update state with filtered data and metrics
      setFilteredData(filteredData);
      setMetrics({
        totalImpressions,
        totalActions,
        totalSpend,
        averageCTR,
        spendOverTime: spendData,
        impressionsOverTime: impressionsData
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [filteredData, setFilteredData] = useState<MetaAdsData[]>([]);
  const [metrics, setMetrics] = useState({
    totalImpressions: 0,
    totalActions: 0,
    totalSpend: 0,
    averageCTR: 0,
    spendOverTime: [] as { date: string; value: number }[],
    impressionsOverTime: [] as { date: string; value: number }[]
  });

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">Meta Ads Analytics</h1>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="campaign">Campaign</Label>
          <Input
            id="campaign"
            placeholder="Filter by campaign name"
            value={campaignFilter}
            onChange={(e) => setCampaignFilter(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="objective">Objective</Label>
          <Input
            id="objective"
            placeholder="Filter by objective"
            value={objectiveFilter}
            onChange={(e) => setObjectiveFilter(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customer">Customer</Label>
          <Input
            id="customer"
            placeholder="Filter by customer name"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          />
        </div>
      </div>

      <Button 
        onClick={applyFilters} 
        disabled={isLoading}
        className="w-full md:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Applying Filters...
          </>
        ) : (
          'Apply Filters'
        )}
      </Button>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.totalImpressions)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(metrics.totalActions)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.totalSpend)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.averageCTR.toFixed(2)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Spend Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.spendOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Impressions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.impressionsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold border border-black">Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] border border-black overflow-auto">
            <div className="space-y-4 min-w-[800px]">
              {filteredData.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between">
                  <div className="font-medium">{campaign.campaign_name}</div>
                  <div className="flex gap-4">
                    <div>Spend: {formatCurrency(campaign.spend)}</div>
                    <div>Impressions: {formatNumber(campaign.impressions)}</div>
                    <div>Actions: {formatNumber(campaign.clicks)}</div>
                    <div>CTR: {((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
