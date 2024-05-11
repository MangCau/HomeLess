import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChartActive = () => {
  const [data, setData] = useState([
    {
      name: 'Page A',
      uv: 4000,
      người: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      người: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      người: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      người: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      người: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      người: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      người: 4300,
      amt: 2100,
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (data, index) => {
    setActiveIndex(index);
  };

  const activeItem = data[activeIndex];

  return (
    <div style={{ width: '100%' }}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="người" fill="#0095FF" />
          <Bar dataKey="uv" fill="#00E096" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartActive;
