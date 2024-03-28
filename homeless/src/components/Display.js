import React from "react";
import Button from 'react-bootstrap/Button';
function SmallItems ({ type, color, value, medium, diff}) {
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
            str = value ;
            str_1 = "Người";
            break;
        default:
            str = "Invalid type";
    }
    return (
        <div className="m-3" style={{ backgroundColor: color, width: '200px', height: '30%', borderRadius: '20px' }}>
            <div className="m-3 d-flex flex-column align-items-center" style={{ backgroundColor: color_circle, borderRadius: '50%', width: '40px', height: '40px' }}></div>
            <h4 className="m-3 mb-1">{str}</h4> 
            <p className="m-3">{str_1}</p>
            <p className="m-3" style={{ color: "#4079ED", fontWeight: "bold"}}>{diff} so với hôm qua</p>
        </div>
    )
}

export default function Display({ temperature, humidity, numOfPeople }) {
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
                <SmallItems type={0} color="#FFF4DE" value="27" medium="10" diff="+10%"/>
                <SmallItems type={1} color="#DCFCE7" value="75" medium="10" diff="+10%"/>
                <SmallItems type={2} color="#F3E8FF" value="8" medium="10" diff="-2"/>
            </div>
        </div>
    )
}
