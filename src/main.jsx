import { createRoot } from 'react-dom/client'
import AppContextProvider from './AppContext.jsx'

import './css/light-blue.css'
import './css/dark-blue.css'
import './css/main.css'
import './css/slider.css'
import './css/latestBigWinsSkeleton.css'
import './css/topWidget.css'
import './css/footer.css'
import './css/casinoWidgetSliders.css'
import './css/betslipBooking.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <AppContextProvider>
      <App className="normal-mode app-mode"/>
    </AppContextProvider>
  // </StrictMode>
)