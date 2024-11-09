import React from 'react'
import Home from './components/Home';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HashDetail from './components/Hash/HashDetail';
import Ipdetail from './components/ip/Ipdetail';
import IpDetails from './components/ip/IpDetails';
const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<HashDetail />} path="/corresponding-file-hash-checker" />
          <Route element={<Ipdetail />} path="/ip-reputation-checker-on-multiple-TI" />
          <Route element={<IpDetails />} path="/ipdetails" />
        </Routes>
      </BrowserRouter>
    </>


  )
}

export default App