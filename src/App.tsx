import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router/AppRouter'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
