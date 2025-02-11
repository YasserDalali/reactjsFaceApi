import React, { useState } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedTableRow from './AnimatedTableRow';

const LeaveManagementTable = ({ leaveData: initialLeaveData = [], employees = [] }) => {
  const [tableData, setTableData] = useState(initialLeaveData);

  const data = React.useMemo(() => tableData, [tableData]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Employee',
        accessor: 'employee_id',
        Cell: ({ value }) => {
          const employee = employees.find(emp => emp.id === value);
          return (
            <Link
              to={`/employees/${employee?.id}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {employee?.name || 'Unknown'}
            </Link>
          );
        },
      },
      {
        Header: 'Leave Type',
        accessor: 'type',
        Cell: ({ value }) => (
          <span className={`px-2 py-1 rounded-full text-sm font-medium
            ${value === 'Sick Leave' ? 'bg-red-100 text-red-700' :
              value === 'Vacation' ? 'bg-blue-100 text-blue-700' :
                value === 'Personal' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'}`
          }>
            {value}
          </span>
        ),
      },
      {
        Header: 'Start Date',
        accessor: 'start_date',
      },
      {
        Header: 'End Date',
        accessor: 'end_date',
      },
      {
        Header: 'Duration',
        accessor: 'duration',
        Cell: ({ value }) => `${value} days`,
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value, row }) => (
          <select
            value={value}
            onChange={(e) => {
              const newData = [...tableData];
              newData[row.index].status = e.target.value;
              setTableData(newData);
            }}
            className={`px-3 py-1 rounded-md text-sm font-medium border-2 cursor-pointer
              ${value === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' :
                value === 'Pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                  value === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'}`
            }
          >
            <option value="Pending" className="bg-white text-yellow-700">Pending</option>
            <option value="Approved" className="bg-white text-green-700">Approved</option>
            <option value="Rejected" className="bg-white text-red-700">Rejected</option>
          </select>
        ),
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
              onClick={() => console.log('View details', row.original)}
            >
              View
            </button>
            <button
              className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none"
              onClick={() => console.log('Delete', row.original)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [tableData, employees]
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
    setPageSize,
    state: { globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Leave Requests
        </h3>

        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              {/* Search bar */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search leave requests..."
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700 dark:text-white"
                  />
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-hidden border border-gray-200 dark:border-neutral-700 rounded-lg">
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
                  <tbody {...getTableBodyProps()} className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {page.map((row, index) => {
                      prepareRow(row);
                      return (
                        <AnimatedTableRow key={row.id} index={index}>
                          {row.cells.map((cell) => (
                            <td
                              {...cell.getCellProps()}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200"
                            >
                              {cell.render('Cell')}
                            </td>
                          ))}
                        </AnimatedTableRow>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-2">
                  <select
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                    className="px-3 py-1 border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    {[5, 10, 20].map(size => (
                      <option key={size} value={size}>
                        Show {size}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors duration-200"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pageCount }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => gotoPage(i)}
                      className={`px-3 py-1 border rounded-md ${pageIndex === i ? 'bg-blue-500 text-white' : ''
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="px-3 py-1 border rounded-md disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagementTable;
