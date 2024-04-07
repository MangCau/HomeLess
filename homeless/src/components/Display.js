import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';

function SmallItems({ type, color, value, medium, diff }) {
    const colors = ["#FF947A", "#3CD856", "#BF83FF"];
    const color_circle = colors[type];
    let str = "";
    let str_1 = "Trung bình: ";
    switch (type) {
        case 0:
            str = value + " độ C";
            str_1 += medium + " độ C";
            break;
        case 1:
            str = value + " %";
            str_1 += medium + " %";
            break;
        case 2:
            str = value;
            str_1 = "Lượt xuất hiện người";
            break;
        default:
            str = "Invalid type";
    }
    return (
        <div className="m-3" style={{ backgroundColor: color, width: '200px', height: '30%', borderRadius: '20px' }}>
            <div className="m-3 d-flex flex-column align-items-center" style={{ backgroundColor: color_circle, borderRadius: '50%', width: '40px', height: '40px' }}></div>
            <h4 className="m-3 mb-1">{str}</h4>
            <p className="m-3">{str_1}</p>
            <p className="m-3" style={{ color: "#4079ED", fontWeight: "bold" }}>{diff} so với hôm qua</p>
        </div>
    )
}

export default function Display() {
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [numOfPeople, setNumOfPeople] = useState(null);
    const [averageTemperature, setAverageTemperature] = useState(null);
    const [averageHumidity, setAverageHumidity] = useState(null);
    const [yesterdayAverageTemperature, setYesterdayAverageTemperature] = useState(null);
    const [yesterdayAverageHumidity, setYesterdayAverageHumidity] = useState(null);
    const [yesterdayNumOfPeople, setYesterdayNumOfPeople] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseTemp = await fetch('https://io.adafruit.com/api/v2/homeless_da01/feeds/cam-bien-nhiet-do/data??start_time=today');
                const dataTemp = await responseTemp.json();
                const latestTemp = dataTemp[0]?.value; 

                const responseHumidity = await fetch('https://io.adafruit.com/api/v2/homeless_da01/feeds/cam-bien-do-am/data?start_time=today');
                const dataHumidity = await responseHumidity.json();
                const latestHumidity = dataHumidity[0]?.value; 

                const responseNumOfPeople = await fetch('https://io.adafruit.com/api/v2/homeless_da01/feeds/canh-bao/data?start_time=today');
                const dataNumOfPeople = await responseNumOfPeople.json();
                
                
                const countCoNguoi = dataNumOfPeople.reduce((count, dataPoint) => {
                    if (dataPoint.value === "CO NGUOI") {
                        return count + 1;
                    }
                    return count;
                }, 0);

                setTemperature(latestTemp);
                setHumidity(latestHumidity);
                setNumOfPeople(countCoNguoi);


                const totalTemperature = dataTemp.reduce((acc, dataPoint) => {
                    return acc + parseFloat(dataPoint.value);
                }, 0);
                const avgTemperature = totalTemperature / dataTemp.length;
                setAverageTemperature(avgTemperature.toFixed(2)); // Rounded to 2 decimal places

                const totalHumidity = dataHumidity.reduce((acc, dataPoint) => {
                    return acc + parseFloat(dataPoint.value);
                }, 0);
                const avgHumidity = totalHumidity / dataHumidity.length;
                setAverageHumidity(avgHumidity.toFixed(2)); // Rounded to 2 decimal places

                const responseTempYesterday = await fetch('https://io.adafruit.com/api/v2/homeless_da01/feeds/cam-bien-nhiet-do/data?start_time=yesterday&end_time=today');
                const dataTempYesterday = await responseTempYesterday.json();

                const totalTemperatureYesterday = dataTempYesterday.reduce((acc, dataPoint) => {
                    return acc + parseFloat(dataPoint.value);
                }, 0);
                const avgTemperatureYesterday = totalTemperatureYesterday / dataTempYesterday.length;
                setYesterdayAverageTemperature(avgTemperatureYesterday.toFixed(2));

                const responseHumidityYesterday = await fetch('https://io.adafruit.com/api/v2/homeless_da01/feeds/cam-bien-do-am/data?start_time=yesterday&end_time=today');
                const dataHumidityYesterday = await responseHumidityYesterday.json();

                const totalHumidityYesterday = dataHumidityYesterday.reduce((acc, dataPoint) => {
                    return acc + parseFloat(dataPoint.value);
                }, 0);
                const avgHumidityYesterday = totalHumidityYesterday / dataHumidityYesterday.length;
                setYesterdayAverageHumidity(avgHumidityYesterday.toFixed(2));

                const responseNumOfPeopleYesterday = await fetch('https://io.adafruit.com/api/v2/homeless_da01/feeds/canh-bao/data?start_time=yesterday&end_time=today');
                const dataNumOfPeopleYesterday = await responseNumOfPeopleYesterday.json();

                const countCoNguoiYesterday = dataNumOfPeopleYesterday.reduce((count, dataPoint) => {
                    if (dataPoint.value === "CO NGUOI") {
                        return count + 1;
                    }
                    return count;
                }, 0);

                setYesterdayNumOfPeople(countCoNguoiYesterday);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    let temperatureDiffPercent = ((averageTemperature - yesterdayAverageTemperature) / yesterdayAverageTemperature * 100).toFixed(2);
    if (yesterdayAverageTemperature === null) {
        temperatureDiffPercent = "100.00";
    }

    let humidityDiffPercent = ((averageHumidity - yesterdayAverageHumidity) / yesterdayAverageHumidity * 100).toFixed(2);
    if (yesterdayAverageHumidity === null) {
        humidityDiffPercent = "100.00";
    }

    return (
        <div className="mt-5 m-4 bg-white p-4 pb-0">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <h4>Thông tin hôm nay</h4>
                    <p>Thông tin trong ngày</p>
                </div>
                <Button className="bg-white text-secondary" style={{ borderRadius: '10px', border: '1px solid gray', height: '40px' }}>
                    Export
                </Button>
            </div>
            <div className="d-flex justify-content-space-around align-items-center">
                <SmallItems type={0} color="#FFF4DE" value={temperature} medium={averageTemperature} diff={`${temperatureDiffPercent}%`} />
                <SmallItems type={1} color="#DCFCE7" value={humidity} medium={averageHumidity} diff={`${humidityDiffPercent}%`} />
                <SmallItems type={2} color="#F3E8FF" value={numOfPeople} medium="10" diff={numOfPeople-yesterdayNumOfPeople} />
            </div>
        </div>
    );
}
