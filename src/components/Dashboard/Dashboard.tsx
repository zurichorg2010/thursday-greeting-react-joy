import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "./DashboardHeader";
import SummaryTab from "./SummaryTab";
import DailyTab from "./DailyTab";
import WeeklyTab from "./WeeklyTab";
import MonthlyTab from "./MonthlyTab";
import DetailedTab from "./DetailedTab";
import FilterPanel from "./FilterPanel";
import { MetaAdsData } from "@/types/dashboard";
import { getActionTypeBreakdown } from "@/utils/analytics";
import { getAnalyticsSummary, getCampaignPerformance } from "@/utils/analytics";

interface DashboardProps {
  data: MetaAdsData[];
  analyticsData: {
    summary: any;
    campaignPerformance: any[];
    actionBreakdown: any[];
    filteredData: MetaAdsData[];
    filteredSummary: any;
  };
}

const Dashboard = ({ data, analyticsData }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredData, setFilteredData] = useState<MetaAdsData[]>(data);
  const [newAnalyticsData, setNewAnalyticsData] = useState<any>(analyticsData);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  // Get unique values for filters
  const uniqueCampaigns = Array.from(new Set(data.map(item => item.campaign_name)));
  const uniqueObjectives = Array.from(new Set(data.map(item => item.objective)));
  const uniqueCustomers = Array.from(new Set(data.map(item => item.DisplayName)));
  const uniquePartners = Array.from(new Set(data.map(item => item.partner)));
  
  // Apply filters function
  const applyFilters = async (filters: {
    dateRange: { from: Date | undefined; to: Date | undefined };
    campaigns: string[];
    partners: string[];
    orderIds: string[];
  }) => {
    setIsFiltering(true);
    try {
      setDateRange(filters.dateRange);
      setSelectedCampaigns(filters.campaigns);
      setSelectedPartners(filters.partners);

      let newFilteredData = [...data];
      let uniqueData = new Map<string | number, MetaAdsData>();

      // First, create unique data set using ID as key
      data.forEach(item => {
        if (item.id) {
          uniqueData.set(item.id, item);
        }
      });

      // Convert unique data back to array
      const uniqueDataArray = Array.from(uniqueData.values());

      console.log("Total records:", data.length);
      console.log("Unique records:", uniqueDataArray.length);

      // Date filtering with proper date handling
      if (filters.dateRange.from && filters.dateRange.to) {
        const startDate = new Date(filters.dateRange.from);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(filters.dateRange.to);
        endDate.setHours(0,0,0,0);

        const dateFilteredItems = uniqueDataArray.filter(item => {
          let itemDate = new Date(item.date_start);
          itemDate.setHours(0,0,0,0) - 7;
          return itemDate >= startDate && itemDate <= endDate;
        });

        // Calculate total spend for date filtered items
        const totalSpend = dateFilteredItems.reduce((sum, item) => {
          const spend = typeof item.spend === 'string' ? parseFloat(item.spend) : (item.spend || 0);
          return sum + (isNaN(spend) ? 0 : spend);
        }, 0);

        console.log("Date filtered items:", dateFilteredItems.length);
        console.log("Total spend for filtered period:", totalSpend);

        newFilteredData = dateFilteredItems;
      }

      if (filters.campaigns.length > 0) {
        newFilteredData = newFilteredData.filter(item => 
          filters.campaigns.includes(item.campaign_name)
        );
      }

      // Partner filter
      if (filters.partners.length > 0) {
        newFilteredData = newFilteredData.filter(item => {
          return filters.partners.some(partner => 
            `${item.partner}`?.toLowerCase().includes(partner.toLowerCase())
          );
        });
      }

      // Order ID filter
      if (filters.orderIds.length > 0) {
        newFilteredData = newFilteredData.filter(item => {
          return filters.orderIds.some(orderId => 
            `${item.order_id}`?.toLowerCase().includes(`${orderId}`.toLowerCase())
          );
        });
      }

      let summary = await getAnalyticsSummary(newFilteredData);
      const campaignPerformance = await getCampaignPerformance(newFilteredData);
      const actionBreakdown = await getActionTypeBreakdown(newFilteredData);
      const filteredSummary = await getAnalyticsSummary(newFilteredData);
      setNewAnalyticsData({
        summary: summary,
        campaignPerformance: campaignPerformance,
        actionBreakdown: actionBreakdown,
        filteredData: newFilteredData,
        filteredSummary: filteredSummary,
        uniqueData: uniqueDataArray
      });
      setFilteredData(newFilteredData);
    } finally {
      setIsFiltering(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-1">
          <FilterPanel 
            partners={uniquePartners}
            campaigns={uniqueCampaigns}
            objectives={uniqueObjectives}
            customers={uniqueCustomers}
            applyFilters={applyFilters}
            dateRange={dateRange}
            selectedCampaigns={selectedCampaigns}
            selectedObjectives={selectedObjectives}
            selectedCustomers={selectedCustomers}
            isFiltering={isFiltering}
            data={data}
          />
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="summary" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-5">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary">
              <SummaryTab 
                data={filteredData} 
                dateRange={dateRange}
                summary={newAnalyticsData.summary || analyticsData.summary}
                campaignPerformance={newAnalyticsData.campaignPerformance || analyticsData.campaignPerformance}
                actionBreakdown={newAnalyticsData.actionBreakdown || analyticsData.actionBreakdown}
              />
            </TabsContent>
            
            <TabsContent value="daily">
              <DailyTab data={filteredData} />
            </TabsContent>
            
            <TabsContent value="weekly">
              <WeeklyTab data={filteredData} />
            </TabsContent>
            
            <TabsContent value="monthly">
              <MonthlyTab data={filteredData} />
            </TabsContent>
            
            <TabsContent value="detailed">
              <DetailedTab data={filteredData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
