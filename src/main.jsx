import React from 'react'
import { flushSync } from 'react-dom'
import ReactDOM from 'react-dom/client'
import App from './App'

// Render synchronously, so the page is drawn by its first paint (and the crossfade in from the
// blog has something to land on; see index.html)
const root = ReactDOM.createRoot(document.getElementById('root'))
flushSync(() =>
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  ),
)
