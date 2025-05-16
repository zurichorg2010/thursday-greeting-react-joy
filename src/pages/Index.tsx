import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard/Dashboard";
import { useMetaAdsData } from "@/hooks/use-meta-ads-data";
import { 
  getAnalyticsSummary, 
  getCampaignPerformance, 
  getActionTypeBreakdown,
  filterByDateRange,
  filterByCampaign,
  filterByObjective,
  filterBySpendRange
} from '@/utils/analytics';
import { MetaAdsData } from "@/types/dashboard";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data, isLoading, isError, error } = useMetaAdsData();
  const [isFiltering, setIsFiltering] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<{
    summary: any;
    campaignPerformance: any[];
    actionBreakdown: any[];
    filteredData: MetaAdsData[];
    filteredSummary: any;
  }>({
    summary: null,
    campaignPerformance: [],
    actionBreakdown: [],
    filteredData: [],
    filteredSummary: null
  });

  // If loading or error, fall back to mock data
  const displayData = data;

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsFiltering(true);
      try {
        let filteredData = [...displayData];

        // Default date range (May 1st, 2024 to yesterday)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() - 1); // Set to yesterday
        const startDate = new Date('2024-05-01'); // Set to May 1st, 2024
        filteredData = await filterByDateRange(startDate.toISOString(), endDate.toISOString(), filteredData);

        // Default spend range ($0 - $5000)
        filteredData = await filterBySpendRange(0, 5000, filteredData);

        // Default frequency range (1-10)
        filteredData = filteredData.filter(item => 
          item.frequency >= 1 && item.frequency <= 10
        );

        // Get analytics using filtered data
        const summary = await getAnalyticsSummary(filteredData);
        const campaignPerformance = await getCampaignPerformance(filteredData);
        const actionBreakdown = await getActionTypeBreakdown(filteredData);
        const filteredSummary = await getAnalyticsSummary(filteredData);

        setAnalyticsData({
          summary,
          campaignPerformance,
          actionBreakdown,
          filteredData,
          filteredSummary
        });

        toast({
          title: "Default filters applied",
          description: "Analytics data has been updated with default filters.",
        });
      } catch (error) {
        console.error('Error loading analytics data:', error);
        toast({
          title: "Error applying filters",
          description: error instanceof Error ? error.message : "Failed to apply filters",
          variant: "destructive",
        });
      } finally {
        setIsFiltering(false);
      }
    };

    if (displayData.length > 0) {
      loadAnalyticsData();
    }
  }, [displayData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && (
        <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow-md">
          Loading data...
        </div>
      )}
      {isError && (
        <div className="fixed top-4 right-4 bg-red-100 text-red-800 px-4 py-2 rounded shadow-md">
          Error loading data: {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}
      {isFiltering && (
        <div className="fixed top-4 right-4 bg-blue-100 text-blue-800 px-4 py-2 rounded shadow-md flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Applying filters...
        </div>
      )}
      <Dashboard 
        data={displayData} 
        analyticsData={analyticsData}
      />
    </div>
  );
};

export default Index;
