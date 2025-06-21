// import { useState } from 'react'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import './App.css'
import SignupPage from './pages/SignupPage'
import Signinpage from './pages/Signinpage'
import Dashboard from './pages/Dashboard'
import Send from './pages/Send'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/signin' element={<Signinpage/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/send' element={<Send/>}/>
        
      </Routes>
    </Router>
  )
}

export default App
