//hooks
import { Outlet } from 'react-router-dom'

//components
import Navbar from './components/Navbar'

//css
import './App.css'


function App() {


  return (
    <div
      className='h-screen w-screen flex flex-col overflow-x-hidden'
    >
      <Navbar />
      <main
        className='flex-auto w-full h-auto'
      >
        <Outlet />
      </main>
    </div>
  )
}

export default App
