// import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import api from "../api";

// const ChartActive = ({ selectedRange, type }) => {
//   const [data, setData] = useState([]);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch records if needed (this line is present in your original code but not used)
//         await api.get("/api/record");

//         // Fetch the latest temperature or data based on the selectedRange
//         const latestTempResponse = await api.get(`/api/light/${selectedRange}`);
//         console.log(latestTempResponse.data, `/api/light/${selectedRange}`, "/api/light/1");

//         // Set the data state
//         setData(latestTempResponse.data);
        
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//     const intervalId = setInterval(fetchData, 1000);

//     return () => clearInterval(intervalId);
//   }, [selectedRange]); // Adding selectedRange to dependency array

//   const handleClick = (data, index) => {
//     setActiveIndex(index);
//   };

//   const activeItem = data[activeIndex];

//   // Debugging
//   console.log("Data:", data);

//   return (
//     <div style={{ width: '100%' }}>
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart
//           width={500}
//           height={300}
//           data={data}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//           onClick={handleClick}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="working_time_seconds" fill="#0095FF" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default ChartActive;
