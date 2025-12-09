'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Loader2, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Ticket, 
  User, 
  Mail, 
  Phone,
  CreditCard,
  Building2,
  Hash
} from 'lucide-react'
import { toast } from 'sonner'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/ticket-orders/${orderId}`)
      const data = await response.json()

      if (data.success) {
        setOrder(data.data)
        
        // Check if already paid
        if (data.data.payment_status === 'paid') {
          setPaymentSuccess(true)
        }
      } else {
        toast.error('Không tìm thấy đơn hàng')
        setTimeout(() => router.push('/events'), 2000)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      toast.error('Lỗi khi tải thông tin đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmPayment = async () => {
    try {
      setProcessing(true)

      const response = await fetch(`/api/ticket-orders/${orderId}/confirm-payment`, {
        method: 'POST',
      })

      const data = await response.json()

      if (data.success) {
        setPaymentSuccess(true)
        toast.success('Thanh toán thành công! Vui lòng kiểm tra email.')
      } else {
        toast.error(data.message || 'Lỗi khi xác nhận thanh toán')
      }
    } catch (error) {
      console.error('Error confirming payment:', error)
      toast.error('Lỗi khi xác nhận thanh toán')
    } finally {
      setProcessing(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Không tìm thấy đơn hàng</p>
        </div>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-2xl mx-auto border-2 border-green-200">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Thanh toán thành công!
                </h1>
                <p className="text-gray-600 text-lg">
                  Mã đơn hàng: <span className="font-semibold text-blue-600">{order.order_code}</span>
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-3 text-blue-900">📧 Kiểm tra email của bạn</h3>
                <p className="text-blue-800 mb-2">
                  Chúng tôi đã gửi vé điện tử kèm QR code đến:
                </p>
                <p className="font-semibold text-blue-600 text-lg">
                  {order.customer_email}
                </p>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <p>✅ Vé của bạn đã được xác nhận</p>
                <p>✅ Email xác nhận đã được gửi</p>
                <p>✅ QR code đã sẵn sàng để sử dụng</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => router.push('/events')}
                  variant="outline"
                  className="flex-1"
                >
                  Về trang sự kiện
                </Button>
                <Button
                  onClick={() => window.location.href = `mailto:${order.customer_email}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Mở email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thanh toán đơn hàng</h1>
            <p className="text-gray-600">
              Mã đơn hàng: <span className="font-semibold text-blue-600">{order.order_code}</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Event Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-blue-600" />
                    Thông tin sự kiện
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">
                      {order.event_name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.event_date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{order.event_location}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Chi tiết vé</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Loại vé:</span>
                        <span className="font-medium">{order.ticket_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Khu vực:</span>
                        <span className="font-medium">{order.ticket_area}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số lượng:</span>
                        <span className="font-medium">×{order.quantity}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Thông tin khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Họ tên:</span>
                    <span className="font-medium">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{order.customer_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">SĐT:</span>
                    <span className="font-medium">{order.customer_phone}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Instructions */}
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <CreditCard className="h-5 w-5" />
                    Hướng dẫn thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center bg-white rounded-lg p-4 mb-4">
                    <img
                      src={`https://img.vietqr.io/image/MB-0123456789-compact2.jpg?amount=${order.total_price}&addInfo=${order.order_code}&accountName=PLADIVO EVENTS`}
                      alt="Mã QR thanh toán"
                      className="w-full max-w-[250px] object-contain"
                    />
                  </div>
                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">Ngân hàng: MB Bank</p>
                        <p className="text-sm text-gray-600">Chi nhánh: Hà Nội</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Hash className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">Số tài khoản: 0123456789</p>
                        <p className="text-sm text-gray-600">Chủ TK: PLADIVO EVENTS</p>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="text-xs font-semibold text-yellow-900 mb-1">Nội dung chuyển khoản:</p>
                      <p className="text-sm font-mono font-bold text-yellow-800">
                        {order.order_code}
                      </p>
                    </div>
                  </div>


                </CardContent>
              </Card>
            </div>

            {/* Payment Summary */}
            <div className="md:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Tổng thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Đơn giá:</span>
                      <span>{order.unit_price.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Số lượng:</span>
                      <span>×{order.quantity}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">
                        {order.total_price.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleConfirmPayment}
                    disabled={processing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Xác nhận đã thanh toán
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Sau khi xác nhận, vé sẽ được gửi đến email của bạn
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
