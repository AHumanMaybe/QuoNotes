import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home.jsx'
import Chat from './pages/Chat.jsx'
import Study from './pages/Study.jsx'
import More from './pages/More.jsx'
import Navbar from "./components/Navbar.jsx"
import Land from "./pages/Land.jsx"
import React from "react"
import { useEffect, useState } from "react"
import "./styles/index.css"
import "./styles/chatstyle.css"
import "./styles/studystyle.css"
import "./styles/uploadstyle.css"
import "./styles/morestyle.css"
import "./styles/profilestyle.css"
import "./styles/landstyle.css"
import Login from "./pages/Login.jsx"
import Manual from "./pages/Manual.jsx"
import FlashcardView from "./pages/FlashcardView.jsx"

function App() {

  useEffect(() => {

    localStorage.setItem("theme", "dark")

    // Check if a theme is already set in localStorage
    const savedTheme = localStorage.getItem("theme");

    // If no theme is saved, default to "light"
    const theme = savedTheme ? savedTheme : "light";
    document.body.classList.add(theme);

    // Clean up any previous theme class on component unmount
    return () => {
      document.body.classList.remove("light", "dark");
    };
  }, [])

    const [isAuthenticated, setIsAuthenticated] = useState(false)
    
    function updateAuthStatus(authStatus) {
        setIsAuthenticated(authStatus)
    }

 //BrowserRouter handles multiple pages
  return(<>
  <BrowserRouter>
    <Navbar isAuthenticated={isAuthenticated}/>
    <Routes>
      <Route path="/" element={<Land/>} />
      <Route path="/land" element={<Land/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/chat" element={<Chat/>}/>
      <Route path="/create" element={<Study/>}/>
      <Route path="/flashcards/:userId/:setId" element={<FlashcardView/>}/>
      <Route path="/more" element={<More/>}/>
      <Route path="/manual" element={<Manual/>}/>
      <Route path="/login" element={<Login isAuthenticated={isAuthenticated}/>}/>
    </Routes>
  </BrowserRouter>
  </>
    )
}

export default App
