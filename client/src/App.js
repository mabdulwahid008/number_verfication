import SingleNumber from 'components/SingleNumber'
import React from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import ListNumber from 'components/ListNumber'

function App() {
    
  return (
      <>
      <BrowserRouter>
          <Routes>
              <Route path='/' element={<SingleNumber />}/>
              <Route path='/verify-list' element={<ListNumber />}/>
          </Routes>
      </BrowserRouter>
        
    </>    
    )
}

export default App