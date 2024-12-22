import React from 'react'
import Home from './components/Home';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HashDetail from './components/Hash/HashDetail';
import Ipdetail from './components/ip/Ipdetail';
import IpDetails from './components/ip/IpDetails';
import AboutPage from './components/About/AboutPage';
import Disclaimer from './components/Disclaimer/Disclaimer';
import ContactUs from './components/Contact/ContactUs';
import SocialTool from './components/SocialTool';
const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<HashDetail />} path="/corresponding-file-hash-checker" />
          <Route element={<Ipdetail />} path="/ip-reputation-checker-on-multiple-TI" />
          <Route element={<IpDetails />} path="/ipdetails" />
          <Route element={<AboutPage />} path="/about-us" />
          <Route element={<Disclaimer />} path="/disclaimer" />
          <Route element={<ContactUs />} path="/contact-us" />
          <Route element={<SocialTool />} path="/social-tool" />
        </Routes>
      </BrowserRouter>
    </>


  )
}

export default App
