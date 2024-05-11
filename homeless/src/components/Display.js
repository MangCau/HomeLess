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
        <div className="m-3" style={{ backgroundColor: color, width: '33%', height: '30%', borderRadius: '20px' }}>
            <div className="m-3 d-flex flex-column align-items-center" style={{ backgroundColor: color_circle, borderRadius: '50%', width: '40px', height: '40px' }}></div>
            <h4 className="m-3 mb-1">{str}</h4>
        </div>
    )
}
function MyTable() {
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="table-responsive">
                        <table className="table">
                            <colgroup>
                                <col style={{ width: '5%' }} />
                                <col style={{ width: '35%' }} />
                                <col style={{ width: '35%' }} />
                                <col style={{ width: '25%' }} />
                            </colgroup>
                            <thead className="bg-secondary text-white">
                                <tr>
                                    <th style={{ textDecoration: 'none', color: 'gray' }}>#</th>
                                    <th style={{ textDecoration: 'none', color: 'gray' }}>Name</th>
                                    <th style={{ textDecoration: 'none', color: 'gray' }}>Config</th>
                                    <th style={{ textDecoration: 'none', color: 'gray' }}> Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Đèn</td>
                                    <td>Config 1</td>
                                    <td>
                                        {/* <button className="btn btn-outline-success">On</button> */}
                                        <button className="btn btn-outline-danger">Off</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Quạt</td>
                                    <td>Config 2</td>
                                    <td>
                                        <button className="btn btn-outline-success">On</button>
                                        {/* <button className="btn btn-outline-danger">Off</button> */}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export function DeviceStatistics() {
    return (
        <div className="mt-5 m-4 bg-white p-4 pb-0" style={{ minWidth: "45%" }}>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4>Thiết bị hiện tại</h4>
                </div>
            </div>
            <MyTable />
        </div>
    );
}

export default function Display() {
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [detectHuman, setDetectHuman] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await api.get("/api/record");
                const latestTemp = await api.get("/api/temperature-record/latest/"); 
                const latestHumidity = await api.get("/api/humidity-record/latest/");
                const detectHuman = await api.get("/api/human-detect-record/latest/");
                setTemperature(latestTemp.data);
                setHumidity(latestHumidity.data);
                setDetectHuman(detectHuman.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
        const intervalId = setInterval(fetchData, 1000);
        return () => clearInterval(intervalId);
    }, []); 

    return (
        <div className="mt-5  m-4 bg-white p-4 pb-0 mw-50 me-0" style={{ minWidth: "45%" }}>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4>Thông tin hôm nay</h4>
                </div>
            </div>
            <div className="d-flex justify-content-space-around align-items-center">
                <SmallItems type={0} color="#FFF4DE" value={temperature}/>
                <SmallItems type={1} color="#DCFCE7" value={humidity}/>
                <SmallItems type={2} color="#F3E8FF" value={detectHuman} medium="10" diff="2" />
            </div>
        </div>
    );
}
