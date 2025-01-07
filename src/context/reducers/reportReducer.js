const initialReports = [
    {
      reportId: 1,
      employeeId: 1,
      type: "Performance",
      content: "Achieved 120% of Q4 targets.",
    },
    {
      reportId: 2,
      employeeId: 2,
      type: "Attendance",
      content: "Absent for three days in December.",
    },
  ];
  
  const reportReducer = (state = initialReports, action) => {
    switch (action.type) {
      default:
        return state;
    }
  };
  
  export default reportReducer;
  