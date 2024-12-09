'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const ConfirmationPage = () => {
    const [orderStatus, setOrderStatus] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const orderId = urlParams.get('order_id')
        console.log('Order ID:', orderId) // Första loggen: Ser vi rätt orderId?

        if (orderId) {
            // Fetch order details
            fetch(`/api/get-order/${orderId}`)
                .then((response) => {
                    console.log('Fetch response:', response) // Loggar hela responsobjektet
                    if (!response.ok)
                        throw new Error(`API error: ${response.statusText}`)
                    return response.json()
                })
                .then((data) => {
                    console.log('Order details response:', data) // Loggar hämtade orderdetaljer
                    setOrderStatus(data)
                })
                .catch((err) => {
                    console.error('Error fetching order details:', err) // Loggar felet
                    setError('Failed to retrieve order details.')
                })

            // Klarna Confirmation Widget
            window.Klarna?.Payments?.load(
                {
                    container: '#klarna-confirmation-container',
                    instance_id: 'klarna-confirmation',
                    options: {
                        order_id: orderId
                    }
                },
                (result) => {
                    console.log(
                        'Klarna Confirmation Widget Load Result:',
                        result
                    )
                    if (!result || result.error) {
                        console.error(
                            'Error loading Klarna Confirmation Widget:',
                            result?.error
                        )
                    } else {
                        console.log(
                            'Klarna widget loaded successfully:',
                            result
                        )
                    }
                }
            )
        } else {
            console.error('Order ID is missing in the URL.')
            setError('Order ID is missing in the URL.')
        }
    }, [])

    return (
        <div>
            <Script
                src="https://x.klarnacdn.net/kp/lib/v1/api.js"
                strategy="lazyOnload"
            />

            <h1>Order Confirmation</h1>
            {error ? (
                <p>Error: {error}</p>
            ) : orderStatus ? (
                <div>
                    <h2>Thank you for your purchase!</h2>
                    <p>Order ID: {orderStatus.order_id}</p>
                    <p>Status: {orderStatus.status}</p>
                </div>
            ) : (
                <p>Loading your order status...</p>
            )}

            <div
                id="klarna-confirmation-container"
                style={{ marginTop: '20px' }}
            ></div>
        </div>
    )
}

export default ConfirmationPage
