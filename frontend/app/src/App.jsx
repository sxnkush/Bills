import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BillForm from './page/BillForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BillForm/>
    </>
  )
}

export default App
