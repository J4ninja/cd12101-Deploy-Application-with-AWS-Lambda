import { Auth0Provider } from '@auth0/auth0-react'
import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-css/semantic.min.css'
import App from './App'
import './index.css'

const domain = process.env.REACT_APP_AUTH0_DOMAIN
const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID
const audience = process.env.REACT_APP_AUTH0_AUDIENCE

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
    audience={audience}
    // 1. FIXED: Changed everything to plural 'todos' to match what your NewTodo component requests
    scope="openid profile email read:todos write:todos delete:todos"
    cacheLocation="localstorage"
    // 2. FIXED: Added this flat property to allow token fetching without third-party cookie blocks
    useRefreshTokens={true}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
)