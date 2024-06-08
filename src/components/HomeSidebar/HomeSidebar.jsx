import React from 'react'
import 
{ BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
 from 'react-icons/bs'
 import 
 { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } 
 from 'recharts';
 import "./HomeSidebar.css"

function HomeSidebar() {

    
     

  return (
    <main className='main-container'>

        <div className='main-cards'>
        <div className='card'>
                <div className='card-inner'>
                <a href="/users">
                <h4>USUARIOS</h4>
                    <BsFillArchiveFill className='card_icon'/>
                </a>
                </div>
                <h1>33</h1>
            </div>

            <div className='card'>
                <div className='card-inner'>
                <a href="/admin/appointments">
                    <h4>CITAS</h4>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </a>
                </div>
                <h1>300</h1>
            </div>

            <div className='card'>
                <div className='card-inner'>
                <a href="/artists">
                    <h4>OCASIÓN</h4>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </a>
            
                </div>
                <h1>12</h1>
            </div>
            
            <div className='card'>
                <div className='card-inner'>
                <a href="/profile">
                    <h4>SETTING</h4>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </a>
                </div>
                <h1>42</h1>
            </div>
        </div>

        
    </main>
  )
}

export default HomeSidebar;