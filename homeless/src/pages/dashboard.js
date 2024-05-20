import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import Display, { DeviceStatistics } from '../components/Display';
import Example from '../components/Chart';
import ChartOfTemp from '../components/ChartOfTemp';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from "../api";
// import ChartActive from '../components/ChartActive';

export default function Dashboard() {
    
    const [selectedRange, setSelectedRange] = useState('1');

    const handleSelectChange = (e) => {
        setSelectedRange(e.target.value);
    };
    function ChartActiveFan () {
        const [dataFan, setDataFan] = useState([]);
        const [activeIndex, setActiveIndex] = useState(0);

        useEffect(() => {
            const fetchData = async (selectedRange) => {
                try {
                    const latestTempResponse = await api.get(`/api/fan/${selectedRange}`);
                    console.log(latestTempResponse.data, `/api/fan/${selectedRange}`, "/api/light/1");
                    const transformedData = latestTempResponse.data.map(item => ({
                        ...item,
                        working_time_seconds: item.working_time_seconds / 60
                    }));
                    setDataFan(transformedData);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData(selectedRange);
            const intervalId = setInterval(() => {
                fetchData(selectedRange); // Fetch data periodically with the current selectedRange
            }, 1000);

            return () => clearInterval(intervalId);
        }, [selectedRange]); // Adding selectedRange to dependency array

        const handleClick = (dataFan, index) => {
            setActiveIndex(index);
        };

        const activeItem = dataFan[activeIndex];

        // Debugging
        console.log("Data:", dataFan);

        return (
            <div style={{ width: '100%' }}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        width={500}
                        height={300}
                        data={dataFan}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        onClick={handleClick}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" domain={[0, 2]} allowDataOverflow />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="working_time_seconds" name="phút" fill="#0095FF" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };
    function ChartActive () {
        const [data, setData] = useState([]);
        const [activeIndex, setActiveIndex] = useState(0);

        useEffect(() => {
            const fetchData = async (selectedRange) => {
                try {
                    const latestTempResponse = await api.get(`/api/light/${selectedRange}`);
                    console.log(latestTempResponse.data, `/api/light/${selectedRange}`, "/api/light/1");
                    const transformedData = latestTempResponse.data.map(item => ({
                        ...item,
                        working_time_seconds: item.working_time_seconds / 60
                    }));
                    setData(transformedData);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData(selectedRange);
            const intervalId = setInterval(() => {
                fetchData(selectedRange); // Fetch data periodically with the current selectedRange
            }, 1000);

            return () => clearInterval(intervalId);
        }, [selectedRange]); // Adding selectedRange to dependency array

        const handleClick = (data, index) => {
            setActiveIndex(index);
        };

        const activeItem = data[activeIndex];

        // Debugging
        console.log("Data:", data);

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
                        onClick={handleClick}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" domain={[0, 2]} allowDataOverflow/>
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="working_time_seconds" name="phút" fill="#FFA62F" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };
    useEffect(() => {
        const renderChartActive = async () => {

        };
        console.log("Change to: ", selectedRange)
        renderChartActive();
    }, [selectedRange]);
    return (
        <div className='mainpage'>
            <Header />
            <div className='mainbody'>
                <SideBar />
                <Container>
                    <div className="flex items-center justify-between">
                        <label className="flex-shrink-0 mx-3">
                            <h5>Hiển thị trong:</h5>
                        </label>
                        <select
                            name="selectedRange"
                            className="ml-2 border border-gray-500 float-right"
                            value={selectedRange}
                            onChange={handleSelectChange}
                        >
                            <option value="1">Hôm nay</option>
                            <option value="7">7 ngày</option>
                            <option value="30">30 ngày</option>
                            <option value="365">1 năm</option>
                            <option value="10000">Tất cả</option>
                        </select>
                    </div>
                    <Container className="d-flex">
                        <Display selectedRange={selectedRange} />
                        <DeviceStatistics />
                    </Container>
                    <Container className="d-flex mt-5">
                        <div style={{ width: '45%' }}>
                            <Example selectedRange={selectedRange} />
                        </div>
                        <div style={{ width: '45%' }}>
                            <ChartOfTemp />
                        </div>
                    </Container>
                    <Container className="d-flex mt-5">
                        <div style={{ width: '45%' }}>
                            <h4 className='ms-5'>Thời gian đèn hoạt động</h4>
                            <ChartActive/>
                        </div>
                        <div style={{ width: '45%' }}>
                            <h4 className='ms-5'>Thời gian quạt hoạt động</h4>
                            <ChartActiveFan />
                        </div>
                    </Container>
                </Container>
            </div>
        </div>
    )
}
