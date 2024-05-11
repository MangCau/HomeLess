import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const data = [
    {
        name: 'Page A',
        "độ ẩm": 4000,
        "nhiệt độ": 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        "độ ẩm": 3000,
        "nhiệt độ": 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        "độ ẩm": 2000,
        "nhiệt độ": 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        "độ ẩm": 2780,
        "nhiệt độ": 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        "độ ẩm": 1890,
        "nhiệt độ": 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        "độ ẩm": 2390,
        "nhiệt độ": 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        "độ ẩm": 3490,
        "nhiệt độ": 4300,
        amt: 2100,
    },
];

const ChartO = () => {
    useEffect(() => {
        // Any lifecycle logic here if needed
        return () => {
            // Cleanup logic here if needed
        };
    }, []); // Empty dependency array means it runs only once on mount

    return (
        <div style={{ width: '100%' }}>
            <h4 className='ms-5'>Biểu đồ nhiệt độ, độ ẩm</h4>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart width={500} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" padding={{ left: 30, right: 30 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="nhiệt độ" stroke="#FF947A" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="độ ẩm" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ChartO;
