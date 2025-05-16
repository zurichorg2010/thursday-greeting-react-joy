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

interface FilterPanelProps {
  campaigns: string[];
  objectives: string[];
  customers: string[];
  applyFilters: (filters: any) => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  selectedCampaigns: string[];
  selectedObjectives: string[];
  selectedCustomers: string[];
  isFiltering?: boolean;
}

const FilterPanel = ({
  campaigns,
  objectives,
  customers,
  applyFilters,
  dateRange,
  selectedCampaigns,
  selectedObjectives,
  selectedCustomers,
  isFiltering,
  
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
  const [partners, setPartners] = useState<string>("");

  const handleApplyFilters = () => {
    applyFilters({
      dateRange: tempDateRange,
      campaigns: tempCampaigns,
      objectives: tempObjectives,
      customers: tempCustomers,
      frequencyRange,
      spendRange,
      orderIds: orderIds.trim() ? orderIds.split(',').map(id => id.trim()) : [],
      partners: partners.trim() ? partners.split(',').map(partner => partner.trim()) : [],
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
    setPartners("");
    
    applyFilters({
      dateRange: { from: undefined, to: undefined },
      campaigns: [],
      objectives: [],
      customers: [],
      frequencyRange: [1, 10],
      spendRange: [0, 5000],
      orderIds: [],
      partners: [],
    });
  };

  const toggleCampaign = (campaign: string) => {
    if (tempCampaigns.includes(campaign)) {
      setTempCampaigns(tempCampaigns.filter(c => c !== campaign));
    } else {
      setTempCampaigns([...tempCampaigns, campaign]);
    }
  };

  const toggleObjective = (objective: string) => {
    if (tempObjectives.includes(objective)) {
      setTempObjectives(tempObjectives.filter(o => o !== objective));
    } else {
      setTempObjectives([...tempObjectives, objective]);
    }
  };

  const toggleCustomer = (customer: string) => {
    if (tempCustomers.includes(customer)) {
      setTempCustomers(tempCustomers.filter(c => c !== customer));
    } else {
      setTempCustomers([...tempCustomers, customer]);
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
          <Label>Order IDs</Label>
          <Input 
            placeholder="Enter order IDs, comma separated" 
            value={orderIds}
            onChange={(e) => setOrderIds(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Partners</Label>
          <Input 
            placeholder="Enter partners, comma separated" 
            value={partners}
            onChange={(e) => setPartners(e.target.value)}
          />
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
              <div className="p-4 max-h-72 overflow-auto space-y-3">
                {campaigns.map((campaign) => (
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
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Objectives</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>
                  {tempObjectives.length === 0
                    ? "Select objectives"
                    : `${tempObjectives.length} selected`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="p-4 max-h-72 overflow-auto space-y-3">
                {objectives.map((objective) => (
                  <div key={objective} className="flex items-center space-x-2">
                    <Checkbox
                      id={`objective-${objective}`}
                      checked={tempObjectives.includes(objective)}
                      onCheckedChange={() => toggleObjective(objective)}
                    />
                    <Label
                      htmlFor={`objective-${objective}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {objective}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Customers</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>
                  {tempCustomers.length === 0
                    ? "Select customers"
                    : `${tempCustomers.length} selected`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <div className="p-4 max-h-72 overflow-auto space-y-3">
                {customers.map((customer) => (
                  <div key={customer} className="flex items-center space-x-2">
                    <Checkbox
                      id={`customer-${customer}`}
                      checked={tempCustomers.includes(customer)}
                      onCheckedChange={() => toggleCustomer(customer)}
                    />
                    <Label
                      htmlFor={`customer-${customer}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {customer}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Frequency</Label>
              <span className="text-xs text-gray-500">
                {frequencyRange[0]} - {frequencyRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[1, 10]}
              max={20}
              min={1}
              step={1}
              value={frequencyRange}
              onValueChange={setFrequencyRange}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Spend Range ($)</Label>
              <span className="text-xs text-gray-500">
                ${spendRange[0]} - ${spendRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 5000]}
              max={10000}
              min={0}
              step={100}
              value={spendRange}
              onValueChange={setSpendRange}
            />
          </div>
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
