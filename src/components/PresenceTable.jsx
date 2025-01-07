import React from "react";
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedTableRow from './AnimatedTableRow';

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
            className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
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
        Cell: ({ value }) => (
          <span className={`px-2 py-1 rounded-full text-sm font-medium
            ${value === 'Present' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
              : value === 'Late'
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`
          }>
            {value}
          </span>
        ),
      },
      {
        Header: 'Details',
        accessor: 'details',
      },
      {
        Header: 'Lateness',
        accessor: 'lateness',
        Cell: ({ value }) => (
          <span className="text-yellow-600 dark:text-yellow-400">
            {value || 'N/A'}
          </span>
        ),
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: () => (
          <div className="text-end">
            <button className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none">
              Inspect
            </button>
            <button className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 focus:outline-none ml-2">
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg"
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Attendance Records
        </h3>
        
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={globalFilter || ''}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search records..."
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700 dark:text-white placeholder-gray-400 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <Search size={16} className="absolute left-3 top-3 text-gray-400 dark:text-neutral-400" />
                </div>
              </div>

              <div className="overflow-hidden border border-gray-200 dark:border-neutral-700 rounded-lg">
                <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    {headerGroups.map((headerGroup) => (
                      <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                          <th 
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400"
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
                      className={`px-3 py-1 border rounded-md transition-colors duration-200
                        ${pageIndex === i 
                          ? 'bg-blue-500 text-white border-blue-500 dark:bg-blue-600 dark:border-blue-600' 
                          : 'dark:bg-neutral-700 dark:border-neutral-600 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-600'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-600 transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PresenceTable;
