const initialLeaveRequests = [
    {
      requestId: 101,
      employeeId: 1,
      startDate: "2024-12-20",
      endDate: "2024-12-25",
      type: "Vacation",
      status: "Approved",
      documents: "URL-to-approval-document",
    },
    {
      requestId: 102,
      employeeId: 2,
      startDate: "2024-11-10",
      endDate: "2024-11-12",
      type: "Sick Leave",
      status: "Pending",
      documents: "URL-to-medical-report",
    },
  ];
  
  const leaveRequestReducer = (state = initialLeaveRequests, action) => {
    switch (action.type) {
      default:
        return state;
    }
  };
  
  export default leaveRequestReducer;
  