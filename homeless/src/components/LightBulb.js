import React from 'react'
import LightOn from '../asserts/light-on.png'
import LightOff from '../asserts/light-off.png'

export default function LightBulb() {
    return (
        <div className='container'>
            <img src={LightOn} alt='Light On' className='light-on'/>
            <img src={LightOff} alt='Light Off' className='light-off'/>
        </div>
    )
}