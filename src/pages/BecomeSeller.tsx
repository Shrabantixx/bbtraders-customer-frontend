import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

function BecomeSeller() {
  const [businessName, setBusinessName] = useState('')
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!businessName || !contactName || !phone) {
      setError('Please fill in the required fields.')
      return
    }

    setSubmitting(true)

    const { error: insertError } = await supabase
      .from('seller_inquiries')
      .insert({
        business_name: businessName,
        contact_name: contactName,
        phone,
        message,
      })

    if (insertError) {
      console.error('Seller inquiry failed:', insertError.message)
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }

    setSent(true)
    setSubmitting(false)
    setBusinessName('')
    setContactName('')
    setPhone('')
    setMessage('')
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Become a Seller</h1>
      <p className="text-gray-600 mb-6">
        Interested in selling on BB Traders Clone? Tell us about your business and we'll reach out.
      </p>

      {sent && (
        <p className="bg-green-100 text-green-700 rounded-lg p-3 mb-4 text-sm">
          Thanks! We'll contact you soon about next steps.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contact Name</label>
          <input
            type="text"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tell us about your business (optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </form>
    </div>
  )
}

export default BecomeSeller