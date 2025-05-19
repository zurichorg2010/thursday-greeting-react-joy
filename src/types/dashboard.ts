export interface MetaAdsData {
  id: string;
  other_id: string;
  campaign_name: string;
  date_start: string;
  date_stop: string;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  spend: number;
  reach: number;
  frequency: number;
  objective: string;
  unique_clicks: number;
  unique_ctr: number;
  DisplayName: string;
  partner: string;
  order_id: string;
  
  // Action types
  actions_landing_page_view: number;
  actions_link_click: number;
  actions_omni_landing_page_view: number;
  actions_page_engagement: number;
  actions_post_engagement: number;
  actions_post_reaction: number;
  actions_video_view: number;
  
  // Cost per action types
  cost_per_action_type_landing_page_view: number;
  cost_per_action_type_link_click: number;
  cost_per_action_type_page_engagement: number;
  cost_per_action_type_video_view: number;
  
  // Unique actions
  unique_actions_link_click: number;
  
  // Other fields
  created_at: string;
}
