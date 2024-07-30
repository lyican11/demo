import React from "react"
import { Route, Routes, } from "react-router-dom"
import HomePage from "./view/HomePage"

const MainRouter = (props) => {
  return <Routes>
    <Route path="/home" element={<HomePage />} />
  </Routes>
}

export default MainRouter
