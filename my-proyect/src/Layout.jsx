import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './views/Home.jsx'
import Contact from './views/Contact.jsx'
import NotFound from './views/NotFound.jsx'
import Navbar from './components/Navbar.jsx'
import injectContext from "./js/store/appContext";
import SignIn from './views/SignIn.jsx';
import LogIn from './views/LogIn.jsx';

const Layout = () => {

  const basename = process.env.BASENAME || "";

  return (
    <div>
        <BrowserRouter basename={basename}>
            <Navbar/>
            <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/contact" element={<Contact/>}/>
                <Route exact path="/SignIn" element={<SignIn/>}/>
                <Route exact path="/LogIn" element={<LogIn/>}/>
                <Route exact path="/*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default injectContext(Layout)
