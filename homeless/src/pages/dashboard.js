import React from 'react';
import ReactDOM from 'react-dom';
import SideBar from '../components/SideBar';
import Header from '../components/Header';

export default function Dashboard () {
    return (
        <div>
            <Header />
            <SideBar />
        </div>
    );
}