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
                <h3>USUARIOS</h3>
                    <BsFillArchiveFill className='card_icon'/>
                </a>
                </div>
                <h1>33</h1>
            </div>

            <div className='card'>
                <div className='card-inner'>
                <a href="/admin/appointments">
                    <h3>CITAS</h3>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </a>
                </div>
                <h1>300</h1>
            </div>

            <div className='card'>
                <div className='card-inner'>
                <a href="/artists">
                    <h3>ARTISTAS</h3>
                    <BsFillGrid3X3GapFill className='card_icon'/>
                </a>
            
                </div>
                <h1>12</h1>
            </div>
            
            <div className='card'>
                <div className='card-inner'>
                <a href="/profile">
                    <h3>SETTING</h3>
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