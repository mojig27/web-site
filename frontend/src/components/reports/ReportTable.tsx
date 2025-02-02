
// frontend/src/components/reports/ReportTable.tsx
import { useState } from 'react';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/Button';

interface ReportTableProps {
  data: any[];
  columns: any[];
  config: {
    labels: { [key: string]: string };
  };
}

export const ReportTable = ({ data, columns, config }: ReportTableProps) => {
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortColumn] > b[sortColumn] ? 1 : -1;
      }
      return a[sortColumn] < b[sortColumn] ? 1 : -1;
    });
  }, [data, sortColumn, sortDirection]);

  const paginatedData = sortedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort(column.key)}
              >
                <div className="flex items-center">
                  {config.labels[column.key]}
                  {sortColumn === column.key && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="flex justify-between items-center">
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(data.length / itemsPerPage)}
          onPageChange={setPage}
        />
        <div className="text-sm text-gray-500">
          نمایش {((page - 1) * itemsPerPage) + 1} تا {Math.min(page * itemsPerPage, data.length)} از {data.length} مورد
        </div>
      </div>
    </div>
  );
};
