import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import SideBar from '../components/SideBar';
import Header from '../components/Header';
import Display, { DeviceStatistics } from '../components/Display';
import { LineChart,
    Line,BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from "../api";
import axios from 'axios';
// import ChartActive from '../components/ChartActive';

export default function Dashboard() {
    
    const [selectedRange, setSelectedRange] = useState('1');

    const handleSelectChange = (e) => {
        setSelectedRange(e.target.value);
    };
    function Example () {
        const [data, setData] = useState([]);
        useEffect(() => {
            const fetchData = async (selectedRange) => {
                try {
                    const num = selectedRange - 1
                    const latestTempResponse = await api.get(`/api/chart1/${num}`);
                    const tmp = latestTempResponse.data
                    setData(tmp);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData(selectedRange);
            const intervalId = setInterval(() => {
                fetchData(selectedRange); // Fetch data periodically with the current selectedRange
            }, 1000);

            return () => clearInterval(intervalId);
        }, [selectedRange]); 
        
      
        const [activeIndex, setActiveIndex] = useState(0)
      
        const handleClick = (data, index) => {
          setActiveIndex(index)
        }
      
        const activeItem = data[activeIndex]
      
        return (
          <div style={{ width: '100%' }}>
            <h4 className='ms-5'>Biểu đồ có người</h4>
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
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="detection_count" fill="#BF83FF" name="lượng phát hiện" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )
      }
    function ChartO () {
        const [dataTemp, setDataTemp] = useState([]);
        useEffect(() => {
            const fetchData = async (selectedRange) => {
                try {
                    const num = selectedRange - 1
                    const latestTempResponse = await api.get(`/api/chart2/${num}`);
                    const tmp = latestTempResponse.data
                    setDataTemp(tmp);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            console.log('Fetching data:', dataTemp)
            fetchData(selectedRange);
            const intervalId = setInterval(() => {
                fetchData(selectedRange); // Fetch data periodically with the current selectedRange
            }, 1000);

            return () => clearInterval(intervalId);
        }, [selectedRange]); 
    
        return (
            <div style={{ width: '100%' }}>
                <h4 className='ms-5'>Biểu đồ nhiệt độ, độ ẩm</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart width={500} height={300} data={dataTemp}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" padding={{ left: 30, right: 30 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="mean_temp" stroke="#FF947A" activeDot={{ r: 8 }} name="nhiệt độ"/>
                        <Line type="monotone" dataKey="mean_humidity" stroke="#82ca9d" name="độ ẩm"/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        )
    }
    function ChartActiveFan () {
        const [dataFan, setDataFan] = useState([]);
        const [activeIndex, setActiveIndex] = useState(0);

        useEffect(() => {
            const fetchData = async (selectedRange) => {
                try {
                    const latestTempResponse = await api.get(`/api/fan/${selectedRange}`);
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
                            <ChartO />
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
