import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import image_graph from '../../assets/graph_bars_24.png'

const Dashboard = () => {
    const [userCount, setUserCount] = useState(0)
    const [totalSales30Days, setTotalSales30Days] = useState(0)
    const [totalSales7Days, setTotalSales7Days] = useState(0)

    const fetchUserCount = async () => {
        try {
            const response = await fetch('http://localhost:4000/users-added-last-30-days')
            const data = await response.json()
            setUserCount(data.count)
        } catch (error) {
            console.error('Error fetching user count:', error)
        }
    }

    const fetchTotalSales30Days = async () => {
        try {
            const response = await fetch('http://localhost:4000/total-sales-last-30-days')
            const data = await response.json()
            setTotalSales30Days(data.totalSales)
        } catch (error) {
            console.error('Error fetching total sales for last 30 days:', error)
        }
    }

    const fetchTotalSales7Days = async () => {
        try {
            const response = await fetch('http://localhost:4000/total-sales-last-7-days')
            const data = await response.json()
            setTotalSales7Days(data.totalSales)
        } catch (error) {
            console.error('Error fetching total sales for last 7 days:', error)
        }
    }

    useEffect(() => {
        fetchUserCount()
        fetchTotalSales30Days()
        fetchTotalSales7Days()
    }, [])

  return (
    <div className='dashboard-container'>
        <div className="item item1">
            <div className='wrapper-graph'>
                <h6>Gráfico ventas totales últimos 30 días</h6>
                <div className='graph1'>
                    <img src={image_graph} alt="imagen gráfico" />
                </div>
            </div>
        </div>
        <div className="item item2">
            <div className='wrapper-info'>
                <h3>Información de 30 días</h3>
                <div className='info'>
                    <h6>Monto total ventas: <span>{totalSales30Days}</span></h6>
                </div>
                <div className='info'>
                    <h6>Cantidad usuarios agregados: <span>{userCount}</span></h6>
                    <h6>Cantidad usuarios eliminados: <span>{userCount}</span></h6>
                </div>
                <div className='info'>
                    <h6>Cantidad publicaciones agregadas: <span>{userCount}</span></h6>
                    <h6>Cantidad publicaciones eliminadas: <span>{userCount}</span></h6>
                </div>
            </div>
        </div>
        <div className="item item3">
        <div className='wrapper-graph'>
                <h6>Gráfico ventas totales últimos 7 días</h6>
                <div className='graph1'>
                    <img src={image_graph} alt="imagen gráfico" />
                </div>
            </div>
        </div>
        <div className="item item4">
            <div className='wrapper-info'>
                <h3>Información de 7 días</h3>
                <div className='info'>
                    <h6>Monto total ventas: <span>{totalSales7Days}</span></h6>
                </div>
                <div className='info'>
                    <h6>Cantidad usuarios agregados: <span>{userCount}</span></h6>
                    <h6>Cantidad usuarios eliminados: <span>{userCount}</span></h6>
                </div>
                <div className='info'>
                    <h6>Cantidad publicaciones agregadas: <span>{userCount}</span></h6>
                    <h6>Cantidad publicaciones eliminadas: <span>{userCount}</span></h6>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard
