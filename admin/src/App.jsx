import React, { useEffect, useState } from 'react'
import { useCtx_Ctrl_Panel } from './Context_CtrlPanel/Context_CtrlPanel'
import AdminLogin from './Pages/AdminLogin/AdminLogin'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Superuser from './Pages/Superuser/Superuser'
import Admin from './Pages/Admin/Admin'

const App = () => {
    const { authToken, userRole, redirectPath, adminId } = useCtx_Ctrl_Panel()

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={authToken ? <Navigate to={redirectPath} /> : <AdminLogin />} />
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/superuser/*" element={authToken && userRole === 'superuser' ? <Superuser /> : <Navigate to="/login" />} />
                <Route path="/admin/*" element={authToken && userRole === 'admin' ? <Admin /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App


