import { Auth0Provider } from '@auth0/auth0-react'
import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-css/semantic.min.css'
import App from './App'
import './index.css'

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID
// Ensure this matches your Auth0 dashboard API identifier EXACTLY
const audience = process.env.REACT_APP_AUTH0_AUDIENCE

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
    audience={audience}
    // 1. FIXED TYPO: Changed 'read:todo' to 'read:todos' to match Todos.jsx
    scope="openid profile email read:todos write:todo delete:todo"
    // 2. SECURITY FIX: Keeps you logged in on Chrome/Safari page reloads
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
)