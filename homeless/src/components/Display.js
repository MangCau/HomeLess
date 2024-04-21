import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import api from "../api";

function SmallItems({ type, color, value }) {
    const colors = ["#FF947A", "#3CD856", "#BF83FF"];
    const color_circle = colors[type];
    let str = "";

    switch (type) {
        case 0:
            str = value + "°C";
            break;
        case 1:
            str = value + "%";
            break;
        case 2:
            str = value === 1 ? "Có người" : "Không có người";
            break;
        default:
            str = "Invalid type";
    }
    return (
        <div className="m-3" style={{ backgroundColor: color, width: '200px', height: '30%', borderRadius: '20px' }}>
            <div className="m-3 d-flex flex-column align-items-center" style={{ backgroundColor: color_circle, borderRadius: '50%', width: '40px', height: '40px' }}></div>
            <h4 className="m-3 mb-1">{str}</h4>
        </div>
    )
}

export default function Display() {
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [detect_human, setDetect_human] = useState(null);
    // const [averageTemperature, setAverageTemperature] = useState(null);
    // const [averageHumidity, setAverageHumidity] = useState(null);
    // const [yesterdayAverageTemperature, setYesterdayAverageTemperature] = useState(null);
    // const [yesterdayAverageHumidity, setYesterdayAverageHumidity] = useState(null);
    // const [yesterdayNumOfPeople, setYesterdayNumOfPeople] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const latestTemp = await api.get("/api/temperature-record/"); 
                const latestHumidity = await api.get("/api/humidity-record/");
                const detect_human = await api.get("/api/human-detect-record/");
                setTemperature(latestTemp.data);
                setHumidity(latestHumidity.data);
                setDetect_human(detect_human.data);
                console.log(detect_human.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

        return () => clearInterval(intervalId);
    }, []); 

    return (
        <div className="mt-5 m-4 bg-white p-4 pb-0">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4>Thông tin hôm nay</h4>
                </div>
                <Button className="bg-white text-secondary" style={{ borderRadius: '10px', border: '1px solid gray', height: '40px' }}>
                    Export
                </Button>
            </div>
            <div className="d-flex justify-content-space-around align-items-center">
                <SmallItems type={0} color="#FFF4DE" value={temperature}/>
                <SmallItems type={1} color="#DCFCE7" value={humidity}/>
                <SmallItems type={2} color="#F3E8FF" value={detect_human} medium="10" diff="2" />
            </div>
        </div>
    );
}
