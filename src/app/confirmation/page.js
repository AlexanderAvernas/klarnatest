'use client'

import { useEffect, useState } from 'react'
import KlarnaWidget from '../components/KlarnaWidget' // Reusing KlarnaWidget component

const ConfirmationPage = () => {
  const [htmlSnippet, setHtmlSnippet] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const orderId = urlParams.get('order_id')
      console.log('Order ID:', orderId)

      if (orderId) {
        try {
          const response = await fetch(`/api/get-order/${orderId}`)
          if (!response.ok) throw new Error('Failed to fetch order details')

          const orderDetails = await response.json()
          console.log('Order Details:', orderDetails)

          setHtmlSnippet(orderDetails.html_snippet) // Set Klarna widget snippet
        } catch (err) {
          console.error('Error fetching order:', err)
          setError('Unable to load order confirmation.')
        }
      } else {
        setError('Order ID is missing in the URL.')
      }
    }

    fetchOrderDetails()
  }, [])

  return (
    <div>
      <h1>Order Confirmation</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        htmlSnippet && <KlarnaWidget htmlSnippet={htmlSnippet} /> // Render Klarna widget
      )}
    </div>
  )
}

export default ConfirmationPage
