'use client'

import { useState } from 'react'
import KlarnaWidget from '../components/KlarnaWidget'

const CheckoutPage = () => {
    const [htmlSnippet, setHtmlSnippet] = useState('')

    const createOrder = async () => {
        const response = await fetch('/api/klarna-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                purchase_country: 'US',
                purchase_currency: 'USD',
                locale: 'sv-SE',
                order_amount: 10000,
                order_tax_amount: 2000,
                order_lines: [
                    {
                        type: 'physical',
                        reference: '123456789',
                        name: 'Test Product',
                        quantity: 1,
                        quantity_unit: 'pcs',
                        unit_price: 10000,
                        tax_rate: 2500,
                        total_amount: 10000,
                        total_tax_amount: 2000
                    }
                ],
                merchant_urls: {
                    terms: 'https://klarnatest.netlify.app/terms',
                    checkout: 'https://klarnatest.netlify.app/checkout',
                    confirmation: 'https://klarnatest.netlify.app/confirmation',
                    push: 'https://klarnatest.netlify.app/api/push'
                }
            })
        })

        const data = await response.json()
        setHtmlSnippet(data.html_snippet) // Set the Klarna widget HTML snippet
    }

    return (
        <div>
            <button onClick={createOrder}>Create Klarna Order</button>
            {htmlSnippet && <KlarnaWidget htmlSnippet={htmlSnippet} />}
        </div>
    )
}

export default CheckoutPage
