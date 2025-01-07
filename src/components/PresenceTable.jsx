import React from "react";
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const PresenceTable = ({ attendanceData = [] }) => {
  const data = React.useMemo(() => attendanceData, [attendanceData]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Employee',
        accessor: 'employee',
        Cell: ({ value, row }) => (
          <Link 
            to={`/profile/${row.original.id}`}
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            {value}
          </Link>
        ),
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Details',
        accessor: 'details',
      },
      {
        Header: 'Lateness',
        accessor: 'lateness',
        Cell: ({ value }) => value || 'N/A',
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: () => (
          <div className="text-end">
            <button className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none dark:text-blue-500 dark:hover:text-blue-400">
              Inspect
            </button>
            <button className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 focus:outline-none dark:text-red-500 dark:hover:text-red-400 ml-2">
              Reject
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    canNextPage,
    canPreviousPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 5,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="flex flex-col">
      <div className="-m-1.5 overflow-x-auto">
        <div className="p-1.5 min-w-full inline-block align-middle">
          <div className="overflow-hidden">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={globalFilter || ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md"
                />
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th 
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500"
                      >
                        <div className="flex items-center gap-x-2">
                          {column.render('Header')}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? <ArrowDown size={12} />
                                : <ArrowUp size={12} />
                              : <ArrowUpDown size={12} />}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr key={row.id} className="hover:bg-gray-100 dark:hover:bg-neutral-700">
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresenceTable;
