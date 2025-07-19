import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'
import ConfigRoutes from './routes'
import { DateProvider } from './contexts/DateContext'

function App() {
  return (
    <DateProvider>
      <Router future={{ v7_startTransition: true }}>
        <ConfigRoutes />
      </Router>
    </DateProvider>
  )
}

export default App