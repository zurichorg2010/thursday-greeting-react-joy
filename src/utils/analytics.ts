import { MetaAdsData } from "@/types/dashboard";

const DB_NAME = 'meta_ads_db';
const STORE_NAME = 'ads_data';
const DB_VERSION = 1;

interface TimeSeriesData {
  date: string;
  value: number;
}

interface AnalyticsSummary {
  totalImpressions: number;
  totalActions: number;
  totalLeads: number;
  totalSpend: number;
  averageCTR: number;
  totalReach: number;
  averageFrequency: number;
  averageCostPerAction: number;
  spendOverTime: TimeSeriesData[];
  impressionsOverTime: TimeSeriesData[];
}

// Initialize IndexedDB
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Read data from IndexedDB
const readCache = async (): Promise<MetaAdsData[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        db.close();
        resolve(request.result);
      };

      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error reading cache:', error);
    return [];
  }
};

// Calculate total actions across all action types
const calculateTotalActions = (data: MetaAdsData): number => {
  return (
    (data.actions_landing_page_view || 0) +
    (data.actions_link_click || 0) +
    (data.actions_omni_landing_page_view || 0) +
    (data.actions_page_engagement || 0) +
    (data.actions_post_engagement || 0) +
    (data.actions_post_reaction || 0) +
    (data.actions_video_view || 0)
  );
};

// Calculate total cost per action
const calculateCostPerAction = (data: MetaAdsData): number => {
  const totalActions = calculateTotalActions(data);
  return totalActions > 0 ? data.spend / totalActions : 0;
};

// Filter data by date range
export const filterByDateRange = async (
  startDate: string,
  endDate: string,
  data: MetaAdsData[]
): Promise<MetaAdsData[]> => {
  return data.filter(
    (item) => {
      const itemDate = new Date(item.date_start);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return itemDate >= start && itemDate <= end;
    }
  );
};

// Filter data by campaign name
export const filterByCampaign = async (
  campaignName: string,
  data: MetaAdsData[]
): Promise<MetaAdsData[]> => {
  return data.filter((item) =>
    item.campaign_name.toLowerCase().includes(campaignName.toLowerCase())
  );
};

// Filter data by objective
export const filterByObjective = async (
  objective: string,
  data: MetaAdsData[]
): Promise<MetaAdsData[]> => {
  return data.filter((item) =>
    item.objective.toLowerCase().includes(objective.toLowerCase())
  );
};

// Filter data by customer
export const filterByCustomer = async (
  customerName: string,
  data: MetaAdsData[]
): Promise<MetaAdsData[]> => {
  return data.filter((item) =>
    item.DisplayName.toLowerCase().includes(customerName.toLowerCase())
  );
};

// Filter data by spend range
export const filterBySpendRange = async (
  minSpend: number,
  maxSpend: number,
  data: MetaAdsData[]
): Promise<MetaAdsData[]> => {
  return data.filter((item) =>
    item.spend >= minSpend && item.spend <= maxSpend
  );
};

// Filter data by frequency range
export const filterByFrequencyRange = async (
  minFrequency: number,
  maxFrequency: number,
  data: MetaAdsData[]
): Promise<MetaAdsData[]> => {
  return data.filter((item) =>
    item.frequency >= minFrequency && item.frequency <= maxFrequency
  );
};

// Get analytics summary for the given data
export const getAnalyticsSummary = async (
  data: MetaAdsData[]
): Promise<AnalyticsSummary> => {
  const summary: AnalyticsSummary = {
    totalImpressions: 0,
    totalActions: 0,
    totalLeads: 0,
    totalSpend: 0,
    averageCTR: 0,
    totalReach: 0,
    averageFrequency: 0,
    averageCostPerAction: 0,
    spendOverTime: [],
    impressionsOverTime: [],
  };

  // Group data by date for time series
  const dateGroups = new Map<string, { spend: number; impressions: number }>();

  data.forEach((item) => {
    // Aggregate totals
    summary.totalImpressions += item.impressions;
    summary.totalSpend += item.spend;
    summary.totalReach += item.reach;
    summary.totalActions += calculateTotalActions(item);

    // Track leads (assuming leads are landing page views)
    summary.totalLeads += item.actions_landing_page_view || 0;

    // Aggregate time series data
    const date = item.date_start.split('T')[0];
    const existing = dateGroups.get(date) || { spend: 0, impressions: 0 };
    dateGroups.set(date, {
      spend: existing.spend + item.spend,
      impressions: existing.impressions + item.impressions,
    });
  });

  // Calculate averages
  summary.averageCTR = summary.totalImpressions > 0
    ? (summary.totalActions / summary.totalImpressions) * 100
    : 0;

  summary.averageFrequency = summary.totalReach > 0
    ? summary.totalImpressions / summary.totalReach
    : 0;

  summary.averageCostPerAction = summary.totalActions > 0
    ? summary.totalSpend / summary.totalActions
    : 0;

  // Convert date groups to time series arrays
  summary.spendOverTime = Array.from(dateGroups.entries())
    .map(([date, data]) => ({
      date,
      value: data.spend,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  summary.impressionsOverTime = Array.from(dateGroups.entries())
    .map(([date, data]) => ({
      date,
      value: data.impressions,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return summary;
};

// Get campaign performance comparison
export const getCampaignPerformance = async (
  data: MetaAdsData[]
): Promise<{
  campaignName: string;
  spend: number;
  impressions: number;
  actions: number;
  ctr: number;
}[]> => {
  const campaignMap = new Map<
    string,
    { spend: number; impressions: number; actions: number }
  >();

  data.forEach((item) => {
    const existing = campaignMap.get(item.campaign_name) || {
      spend: 0,
      impressions: 0,
      actions: 0,
    };

    campaignMap.set(item.campaign_name, {
      spend: existing.spend + item.spend,
      impressions: existing.impressions + item.impressions,
      actions: existing.actions + calculateTotalActions(item),
    });
  });

  return Array.from(campaignMap.entries()).map(([campaignName, metrics]) => ({
    campaignName,
    spend: metrics.spend,
    impressions: metrics.impressions,
    actions: metrics.actions,
    ctr: metrics.impressions > 0 ? (metrics.actions / metrics.impressions) * 100 : 0,
  }));
};

// Get action type breakdown
export const getActionTypeBreakdown = async (
  data: MetaAdsData[]
): Promise<{
  actionType: string;
  count: number;
  cost: number;
}[]> => {
  const actionTypes = [
    { key: 'actions_landing_page_view', name: 'Landing Page Views' },
    { key: 'actions_link_click', name: 'Link Clicks' },
    { key: 'actions_page_engagement', name: 'Page Engagement' },
    { key: 'actions_post_engagement', name: 'Post Engagement' },
    { key: 'actions_post_reaction', name: 'Post Reactions' },
    { key: 'actions_video_view', name: 'Video Views' },
  ];

  return actionTypes.map(({ key, name }) => {
    const total = data.reduce((sum, item) => sum + (item[key as keyof MetaAdsData] as number || 0), 0);
    const cost = data.reduce((sum, item) => {
      const costKey = `cost_per_action_type_${key.replace('actions_', '')}` as keyof MetaAdsData;
      return sum + (item[costKey] as number || 0);
    }, 0);

    return {
      actionType: name,
      count: total,
      cost: cost,
    };
  });
}; 