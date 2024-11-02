import React from "react"
import { Route, Routes, } from "react-router-dom"
import HomePage from "./view/HomePage"
import LoginPage from "./view/LoginPage"

const MainRouter = (props) => {
  return <Routes>
    <Route path="/home" element={<HomePage />} />
    <Route path="/" element={<LoginPage />} />
  </Routes>
}

export default MainRouter
