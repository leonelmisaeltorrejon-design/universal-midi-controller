import React from 'react'
import ReactDOM from 'react-dom/client'
import ControllerPage from '@/components/ControllerPage'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ServiceWorkerRegistration />
    <ControllerPage />
  </>,
)
