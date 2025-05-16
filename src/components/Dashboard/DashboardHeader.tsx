import { ChevronDown } from "lucide-react";
import { fetchMetaAdsData } from "@/utils/api";
import { useState } from "react";

const DashboardHeader = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchMetaAdsData(true); 
      window.location.reload(); 
      
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Meta Ads Performance Analytics</h1>
        <p className="text-sm text-gray-500">Track, analyze, and optimize your Meta ad campaigns</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <button className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm font-medium border border-gray-200 flex items-center">
          <span>Export</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </button>
        
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium ${
            isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
