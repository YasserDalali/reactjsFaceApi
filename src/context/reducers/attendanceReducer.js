const initialAttendance = [
    {
      recordId: 1001,
      employee: "John Doe",
      date: "2024-12-01",
      status: "Present",
      details: "Checked in at 9:00 AM",
      lateness: "00:10", // 10 minutes late
    },
    {
      recordId: 1002,
      employee: "Jane Smith",
      date: "2024-12-01",
      status: "Absent",
      details: "Not reported",
      lateness: null,
    },
    {
      recordId: 1003,
      employee: "Alice Johnson",
      date: "2024-12-01",
      status: "Present",
      details: "Checked in at 9:00 AM",
      lateness: "00:10", // 10 minutes late
    },
    {
      recordId: 1004,
      employee: "Bob Brown",
      date: "2024-12-01",
      status: "Present",
      details: "Checked in at 9:00 AM",
      lateness: "00:10", // 10 minutes late
    },
    {
      recordId: 1005,
      employee: "Charlie Davis",
      date: "2024-12-01",
      status: "Absent",
      details: "Not reported",
      lateness: null,
    },
  ];
  
  const attendanceReducer = (state = initialAttendance, action) => {
    switch (action.type) {
      default:
        return state;
    }
  };
  
  export default attendanceReducer;