'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BookingForm({ item, onClose }) {
  const [formData, setFormData] = useState({
    notes: "",
    payment_method: "card"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const bookingData = {
        user_id: "user123", // lấy từ auth thật sự
        service_id: item._id,
        total_amount: item.discountedPrice,
        payment_method: formData.payment_method,
        notes: formData.notes,
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      const data = await res.json()
      if (data.success) {
        alert("Booking confirmed!")
        onClose()
      } else {
        alert("Booking failed!")
      }
    } catch (err) {
      console.error(err)
      alert("Error booking!")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-bold text-lg">{item.title}</h2>
        <p className="text-gray-600">{item.description}</p>
        <p className="text-sky-600 font-bold">${item.discountedPrice}</p>
      </div>

      <div>
        <Label>Special Requests</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div>
        <Label>Payment Method</Label>
        <Select
          value={formData.payment_method}
          onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="card">Credit/Debit Card</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : `Confirm Booking - $${item.discountedPrice}`}
      </Button>
    </form>
  )
}
