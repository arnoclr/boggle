import { useState } from 'react'
import LoginModal from '../components/LoginModal'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <LoginModal />
  )
}

export default App
