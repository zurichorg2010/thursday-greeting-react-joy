
import { useQuery } from "@tanstack/react-query";
import { fetchMetaAdsData } from "@/utils/api";
import { MetaAdsData } from "@/types/dashboard";

export const useMetaAdsData = (forceRefresh = false) => {
  const query = useQuery({
    queryKey: ["metaAdsData", forceRefresh],
    queryFn: () => fetchMetaAdsData(forceRefresh),
  });

  return {
    ...query,
    data: query.data || [],
  };
};
