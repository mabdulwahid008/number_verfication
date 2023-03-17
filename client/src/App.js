import SingleNumber from 'components/SingleNumber'
import React from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom' 
import ListNumber from 'components/ListNumber'
import Login from 'components/Login'

function App() {
    
    if(!localStorage.getItem('token'))
        return <Login />

    else
        return (
                <Routes>
                    <Route path='/' element={<SingleNumber />}/>
                    <Route path='/verify-list' element={<ListNumber />}/>
                </Routes>
            )
}

export default App