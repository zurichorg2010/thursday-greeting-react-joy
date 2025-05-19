import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronDown, Filter, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { MetaAdsData } from "@/types/dashboard";

interface FilterPanelProps {
  partners: string[];
  campaigns: string[];
  objectives: string[];
  customers: string[];
  applyFilters: (filters: any) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  selectedCampaigns: string[];
  selectedObjectives: string[];
  selectedCustomers: string[];
  isFiltering?: boolean;
  data?: MetaAdsData[];
}

const FilterPanel = ({
  partners,
  campaigns,
  objectives,
  customers,
  applyFilters,
  dateRange,
  selectedCampaigns,
  selectedObjectives,
  selectedCustomers,
  isFiltering,
  data,
}: FilterPanelProps) => {
  const [tempDateRange, setTempDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>(dateRange);
  
  const [tempCampaigns, setTempCampaigns] = useState<string[]>(selectedCampaigns);
  const [tempObjectives, setTempObjectives] = useState<string[]>(selectedObjectives);
  const [tempCustomers, setTempCustomers] = useState<string[]>(selectedCustomers);
  const [frequencyRange, setFrequencyRange] = useState<number[]>([1, 10]);
  const [spendRange, setSpendRange] = useState<number[]>([0, 5000]);
  const [orderIds, setOrderIds] = useState<string>("");
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [campaignSearch, setCampaignSearch] = useState<string>("");
  const [partnerSearch, setPartnerSearch] = useState("");
  const [orderIdSearch, setOrderIdSearch] = useState("");

  // Get unique partners and order IDs from data
  const uniquePartners = Array.from(new Set(partners || []));
  const uniqueOrderIds = Array.from(new Set(data?.map(item => item.order_id).filter(Boolean) || []));

  const handleApplyFilters = () => {
    applyFilters({
      dateRange: tempDateRange,
      campaigns: tempCampaigns,
      partners: selectedPartners,
      orderIds: selectedOrderIds,
    });
  };

  const handleResetFilters = () => {
    setTempDateRange({ from: undefined, to: undefined });
    setTempCampaigns([]);
    setTempObjectives([]);
    setTempCustomers([]);
    setFrequencyRange([1, 10]);
    setSpendRange([0, 5000]);
    setOrderIds("");
    setSelectedPartners([]);
    setSelectedOrderIds([]);
    setCampaignSearch("");
    setPartnerSearch("");
    setOrderIdSearch("");
    
    applyFilters({
      dateRange: { from: undefined, to: undefined },
      campaigns: [],
      partners: [],
      orderIds: [],
    });
  };

  const toggleCampaign = (campaign: string) => {
    if (tempCampaigns.includes(campaign)) {
      setTempCampaigns(tempCampaigns.filter(c => c !== campaign));
    } else {
      setTempCampaigns([...tempCampaigns, campaign]);
    }
  };

  const handleRangeSelection = (range: DateRange | undefined) => {
    if (range) {
      setTempDateRange({
        from: range.from,
        to: range.to || range.from
      });
    } else {
      setTempDateRange({ from: undefined, to: undefined });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !tempDateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {tempDateRange.from ? (
                  tempDateRange.to ? (
                    <>
                      {format(tempDateRange.from, "LLL dd, y")} -{" "}
                      {format(tempDateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(tempDateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={tempDateRange.from}
                selected={tempDateRange}
                onSelect={handleRangeSelection}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Partners</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>
                  {selectedPartners.length === 0
                    ? "Select partners"
                    : `${selectedPartners.length} selected`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="p-4 space-y-3">
                <Input
                  placeholder="Search partners..."
                  className="mb-2"
                  value={partnerSearch}
                  onChange={(e) => setPartnerSearch(e.target.value)}
                />
                <div className="max-h-72 overflow-auto space-y-3">
                  {uniquePartners
                    .filter(partner => 
                      partner.toLowerCase().includes(partnerSearch.toLowerCase())
                    )
                    .map((partner) => (
                      <div key={partner} className="flex items-center space-x-2">
                        <Checkbox
                          id={`partner-${partner}`}
                          checked={selectedPartners.includes(partner)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPartners([...selectedPartners, partner]);
                            } else {
                              setSelectedPartners(selectedPartners.filter(p => p !== partner));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`partner-${partner}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {partner}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Campaigns</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>
                  {tempCampaigns.length === 0
                    ? "Select campaigns"
                    : `${tempCampaigns.length} selected`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="p-4 space-y-3">
                <Input
                  placeholder="Search campaigns..."
                  className="mb-2"
                  value={campaignSearch}
                  onChange={(e) => setCampaignSearch(e.target.value)}
                />
                <div className="max-h-72 overflow-auto space-y-3">
                  {campaigns
                    .filter(campaign => 
                      campaign.toLowerCase().includes(campaignSearch.toLowerCase())
                    )
                    .map((campaign) => (
                      <div key={campaign} className="flex items-center space-x-2">
                        <Checkbox
                          id={`campaign-${campaign}`}
                          checked={tempCampaigns.includes(campaign)}
                          onCheckedChange={() => toggleCampaign(campaign)}
                        />
                        <Label
                          htmlFor={`campaign-${campaign}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {campaign}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Order IDs</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>
                  {selectedOrderIds.length === 0
                    ? "Select Order IDs"
                    : `${selectedOrderIds.length} selected`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="p-4 space-y-3">
                <Input
                  placeholder="Search Order IDs..."
                  className="mb-2"
                  value={orderIdSearch}
                  onChange={(e) => setOrderIdSearch(e.target.value)}
                />
                <div className="max-h-72 overflow-auto space-y-3">
                  {uniqueOrderIds
                    .filter(orderId => 
                      String(orderId).toLowerCase().includes(orderIdSearch.toLowerCase())
                    )
                    .map((orderId) => (
                      <div key={String(orderId)} className="flex items-center space-x-2">
                        <Checkbox
                          id={`orderId-${orderId}`}
                          checked={selectedOrderIds.includes(String(orderId))}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedOrderIds([...selectedOrderIds, String(orderId)]);
                            } else {
                              setSelectedOrderIds(selectedOrderIds.filter(id => id !== String(orderId)));
                            }
                          }}
                        />
                        <Label
                          htmlFor={`orderId-${orderId}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {String(orderId)}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="pt-4 space-y-2">
          <Button 
            className="w-full" 
            onClick={handleApplyFilters}
            disabled={isFiltering}
          >
            {isFiltering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Applying Filters...
              </>
            ) : (
              'Apply Filters'
            )}
          </Button>
          <Button 
            onClick={handleResetFilters} 
            variant="outline" 
            className="w-full"
          >
            Reset Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
