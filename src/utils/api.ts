import { toast } from "@/hooks/use-toast";
import { MetaAdsData } from "@/types/dashboard";

interface ApiResponse {
  status: string;
  result: any[];
}

interface ApiErrorResponse {
  status: string;
  message: string;
}

const DB_NAME = 'meta_ads_db';
const STORE_NAME = 'ads_data';
const DB_VERSION = 1;

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

// Save data to IndexedDB
const saveToIndexedDB = async (data: MetaAdsData[]): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing data
    store.clear();

    // Add new data
    data.forEach(item => {
      store.add(item);
    });

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

// Read data from IndexedDB
const readFromIndexedDB = async (): Promise<MetaAdsData[]> => {
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
};

export const fetchMetaAdsData = async (forceRefresh = false): Promise<MetaAdsData[]> => {
  console.log("Fetching data from API loda lahsun");
  if (!forceRefresh) {
    try {
      const cachedData = await readFromIndexedDB();

      if (cachedData && cachedData.length > 0) {
        return cachedData;
      }
    } catch (error) {
      console.error('Error reading cached data:', error);
    }
  }

  try {
    console.log("Fetching data from local file");

    let data: ApiResponse | ApiErrorResponse;
    try {
      const userResponse = await fetch(
        "https://testing0-0035.laxroute53.com/OxygenRTables/api/_FFFFFFFFFFFFFF00001713960477110008_/createSession",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
    "attributionId": "24721804",
    "contextPE": "11owner1_FFFFFFFFFFFFFF00001567790434071286_1owner1_FFFFFFFFFFFFFF00001743977882277128_",
    "tableId": "_FFFFFFFFFFFFFF00001734098136240176_"
}),
        }
      );
      const response = await fetch(
        "https://testing0-0035.laxroute53.com/OxygenRTables/api/_FFFFFFFFFFFFFF00001713960477110008_/getData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientId: (await userResponse.json() as ApiResponse).result,
            tableId: "_FFFFFFFFFFFFFF00001747150501443726_",
            pageSize: 25000,
            conditions: [],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      data = await response.json() as ApiResponse | ApiErrorResponse;

    } catch (error) {
      const response = await fetch('/data.json');
      if (!response.ok) {
        throw new Error(`Failed to load data.json: ${response.status}`);
      }
      data = await response.json() as ApiResponse;
    }







    if (data.status !== "success" || !("result" in data)) {
      toast({
        title: "Error fetching data",
        description: "result" in data ? "Invalid data structure received" : "Failed to fetch data from API",
        variant: "destructive",
      });
      return [];
    }
    console.log(data.result[0].created_at)
    console.log(convertUTCToPST(data.result[0].created_at))
    
    // Create a Map to store unique items by ID
    const uniqueItemsMap = new Map();
    
    // First pass: collect unique items by ID
    data.result.forEach(item => {
      const itemId = item["Primary Key"] || String(item["Row ID"]);
      // If item doesn't exist in map or has a newer created_at, add/update it
      if (!uniqueItemsMap.has(itemId) || 
          new Date(item.created_at) > new Date(uniqueItemsMap.get(itemId).created_at)) {
        uniqueItemsMap.set(itemId, item);
      }
    });

    const transformedData = Array.from(uniqueItemsMap.values()).map(item => ({
      id: item["Primary Key"] || String(item["Row ID"]),
      campaign_name: item.campaign_name || "",
      date_start: item.date_start ? convertUTCToPST(item.date_start) : "",
      date_stop: item.date_stop ? convertUTCToPST(item.date_stop) : "",
      impressions: Number(item.impressions) || 0,
      other_id: item.id || "",
      clicks: Number(item.clicks) || 0,
      ctr: Number(item.ctr) || 0,
      cpc: Number(item.cpc) || 0,
      cpm: Number(item.cpm) || 0,
      spend: Number(item.spend) || 0,
      reach: Number(item.reach) || 0,
      frequency: Number(item.frequency) || 0,
      objective: item.objective || "",
      unique_clicks: Number(item.unique_clicks) || 0,
      unique_ctr: Number(item.unique_ctr) || 0,
      DisplayName: item.DisplayName || "",
      partner: item.partner || "",
      order_id: item.order_id || "",
      // Action types
      actions_landing_page_view: Number(item.actions_landing_page_view) || 0,
      actions_link_click: Number(item.actions_link_click) || 0,
      actions_omni_landing_page_view: Number(item.actions_omni_landing_page_view) || 0,
      actions_page_engagement: Number(item.actions_page_engagement) || 0,
      actions_post_engagement: Number(item.actions_post_engagement) || 0,
      actions_post_reaction: Number(item.actions_post_reaction) || 0,
      actions_video_view: Number(item.actions_video_view) || 0,

      // Cost per action types
      cost_per_action_type_landing_page_view: Number(item.cost_per_action_type_landing_page_view) || 0,
      cost_per_action_type_link_click: Number(item.cost_per_action_type_link_click) || 0,
      cost_per_action_type_page_engagement: Number(item.cost_per_action_type_page_engagement) || 0,
      cost_per_action_type_video_view: Number(item.cost_per_action_type_video_view) || 0,

      // Unique actions
      unique_actions_link_click: Number(item.unique_actions_link_click) || 0,

      // Other fields
      created_at: item.created_at ? convertUTCToPST(item.created_at) : "",
    }));

    // Save the transformed data to IndexedDB
    try {
      await saveToIndexedDB(transformedData);
      console.log('Data cached successfully');
    } catch (error) {
      console.error('Error caching data:', error);
    }

    return transformedData;
  } catch (error) {
    console.error("Error fetching Meta Ads data:", error);
    toast({
      title: "Error fetching data",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return [];
  }
};

function convertUTCToPST(date: string): string {
  console.log("Converting UTC to PST", date);
  const dateObj = new Date(date);
  
  // Format the date in PST/PDT
  const pstDate = dateObj.toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  console.log("PST Date", pstDate);
  return pstDate;
}
