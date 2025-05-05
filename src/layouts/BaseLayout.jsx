import React, {useEffect} from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BaseLayout = () => {
  return (
    <div className='relative'>
        <Header />
       <div className=''>
        <Outlet />
       </div>
        <Footer />
    </div>
  )
}

export default BaseLayout