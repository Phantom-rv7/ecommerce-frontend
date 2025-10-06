import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./styles/App.scss"
import {Provider} from "react-redux"
import React  from "react"
import { store } from './redux/store.ts'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
