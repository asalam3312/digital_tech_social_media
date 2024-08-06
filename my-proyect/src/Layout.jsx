import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './views/Home.jsx'
import Contact from './views/Contact.jsx'
import NotFound from './views/NotFound.jsx'
import Navbar from './components/Navbar.jsx'
import injectContext from "./js/store/appContext";
import LogIn from './views/LogIn.jsx';
import LoginRegister from './views/LoginRegister.jsx';
import PostIt from './views/PostIt.jsx';

const Layout = () => {

  const basename = process.env.BASENAME || "";

  return (
    <div>
        <BrowserRouter basename={basename}>
            <Navbar/>
            <Routes>
                <Route exact path="/Home" element={<Home/>}/>
                <Route exact path="/contact" element={<Contact/>}/>
                <Route exact path="/" element={<LoginRegister/>}/>
                <Route exact path="/Login" element={<LogIn/>}/>
                <Route exact path="/token" element={<LogIn/>}/>
                <Route exact path="/PostIt" element={<PostIt/>}/>
                <Route exact path="/*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default injectContext(Layout)

