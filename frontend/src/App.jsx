import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Tienda from './Pages/Tienda'
import Category from './Pages/Category'
import Cart from './Pages/Cart'
import LoginSignup from './Pages/LoginSignup'
import Product from './Pages/Product'
import Footer from './Components/Footer/Footer'
import banner_roll from'./assets/banner_roll.png'
import banner_handroll from'./assets/banner_handroll.png'
import banner_sashimi from'./assets/banner_sashimi.png'
import banner_tablas from'./assets/banner_tablas.png'
import MiCompra from './Components/MiCompra/MiCompra'
import PublicationsList from './Components/PublicationList/PublicationList'

function App() {

  return (
    <div>
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path='/' element={<Tienda />} /> 
                <Route path='/rolls' element={<Category banner={banner_roll} category='roll' />} /> 
                <Route path='/handrolls' element={<Category  banner={banner_handroll} category="handroll" />} /> 
                <Route path='/sashimi' element={<Category banner={banner_sashimi} category="sashimi" />} /> 
                <Route path='/tablas' element={<Category banner={banner_tablas} category="table" />} /> 
                <Route path='/product' element={<Product />}>
                    <Route path=':productId' element={<Product />} />
                </Route>
                <Route path='/cart' element={<Cart />} /> 
                <Route path='/login' element={<LoginSignup />} /> 
                <Route path='/micompra' element={<MiCompra />} />
                <Route path='/publications' element={<PublicationsList/>} />
            </Routes>
            <Footer />
        </BrowserRouter>
    </div>
  );
}

export default App


