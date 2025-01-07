import React from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { Search } from 'lucide-react';
import ModalButton from './Modal';
import ProfilePage from '../pages/ProfilePage';

const AbsenceTable = ({ data: initialData = [] }) => {
  const data = React.useMemo(() => initialData, [initialData]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value, row }) => (
          <div className="flex items-center">
            <img src={row.original.faceImage} alt={value} className="w-8 h-8 rounded-full object-cover mr-4" />
            <ModalButton 
              value={value}
              title="Employee Profile"
              buttonStyle="text"
              className="text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ProfilePage employeeId={row.original.id} />
            </ModalButton>
          </div>
        ),
      },
      {
        Header: 'Time of Attendance',
        accessor: 'time',
      },
      {
        Header: 'Late',
        accessor: 'late',
      },
      {
        Header: 'Accurate Scan',
        accessor: 'accurateScan',
      },
      {
        Header: 'Screenshot',
        accessor: 'screenshot',
        Cell: ({ value, row }) => (
          <img src={value} alt={row.original.name} className="w-32 h-20 object-cover rounded-lg" />
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
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Absence Records
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
                    placeholder="Search records..."
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-neutral-600 rounded-md dark:bg-neutral-700 dark:text-white"
                  />
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </div>

              <div className="overflow-hidden border border-gray-200 dark:border-neutral-700 rounded-lg">
                <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-6 py-3 text-left">Name</th>
                      <th className="px-6 py-3 text-left">Time of Attendance</th>
                      <th className="px-6 py-3 text-left">Late</th>
                      <th className="px-6 py-3 text-left">Accurate Scan</th>
                      <th className="px-6 py-3 text-left">Screenshot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-6 py-3 flex items-center">
                          <img src={item.faceImage} alt={item.name} className="w-8 h-8 rounded-full object-cover mr-4" />
                          {item.name}
                        </td>
                        <td className="px-6 py-3">{item.time}</td>
                        <td className="px-6 py-3">{item.late}</td>
                        <td className="px-6 py-3">{item.accurateScan}</td>
                        <td className="px-6 py-3">
                          <img src={item.screenshot} alt={item.name} className="w-32 h-20 object-cover rounded-lg" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-2">
                  <select
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                    className="px-3 py-1 border rounded-md dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
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
                    className="px-3 py-1 border rounded-md disabled:opacity-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pageCount }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => gotoPage(i)}
                      className={`px-3 py-1 border rounded-md ${
                        pageIndex === i ? 'bg-blue-500 text-white' : 'dark:bg-neutral-700 dark:border-neutral-600 dark:text-white'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
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

export default AbsenceTable;
  