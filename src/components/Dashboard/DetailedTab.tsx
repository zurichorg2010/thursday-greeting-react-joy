import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetaAdsData } from "@/types/dashboard";
import { formatNumber, formatCurrency } from "@/utils/format";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DetailedTabProps {
  data: MetaAdsData[];
}

const DetailedTab = ({ data }: DetailedTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MetaAdsData;
    direction: 'ascending' | 'descending';
  }>({
    key: 'date_start',
    direction: 'descending'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Handle search
  const filteredData = data.filter(item => {
    return (
      item.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.DisplayName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Request sort
  const requestSort = (key: keyof MetaAdsData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirection = (key: keyof MetaAdsData) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '';
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Detailed Campaign Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search by campaign name, objective, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('campaign_name')}>
                    Campaign Name {getSortDirection('campaign_name')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('date_start')}>
                    Date {getSortDirection('date_start')}
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => requestSort('impressions')}>
                    Impressions {getSortDirection('impressions')}
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => requestSort('clicks')}>
                    Clicks {getSortDirection('clicks')}
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => requestSort('ctr')}>
                    CTR {getSortDirection('ctr')}
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => requestSort('spend')}>
                    Spend {getSortDirection('spend')}
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => requestSort('cpc')}>
                    CPC {getSortDirection('cpc')}
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => requestSort('cpm')}>
                    CPM {getSortDirection('cpm')}
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => requestSort('reach')}>
                    Reach {getSortDirection('reach')}
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => requestSort('frequency')}>
                    Freq {getSortDirection('frequency')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('objective')}>
                    Objective {getSortDirection('objective')}
                  </TableHead>
                  <TableHead className="cursor-pointer text-right" onClick={() => requestSort('unique_clicks')}>
                    Unique Clicks {getSortDirection('unique_clicks')}
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => requestSort('DisplayName')}>
                    Customer {getSortDirection('DisplayName')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.length > 0 ? (
                  currentData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.campaign_name}</TableCell>
                      <TableCell>{new Date(item.date_start).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">{formatNumber(item.impressions)}</TableCell>
                      <TableCell className="text-right">{formatNumber(item.clicks)}</TableCell>
                      <TableCell className="text-right">{(item.ctr * 100).toFixed(2)}%</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.spend)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.cpc)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.cpm)}</TableCell>
                      <TableCell className="text-right">{formatNumber(item.reach)}</TableCell>
                      <TableCell className="text-right">{item.frequency.toFixed(2)}</TableCell>
                      <TableCell>{item.objective}</TableCell>
                      <TableCell className="text-right">{formatNumber(item.unique_clicks)}</TableCell>
                      <TableCell>{item.DisplayName}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={13} className="text-center py-4">
                      No data found for the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} records
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetailedTab;
