"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, MapPin, FileText, Building2, User, Mail, Phone, CreditCard } from "lucide-react";
import Header from "@/components/Header";

export default function ContractsPage() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Contract Detail Dialog State
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  
  // Payment Dialog State
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentScheduleIndex, setPaymentScheduleIndex] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await fetch("/api/event-contracts");
      const data = await res.json();
      if (data.success) {
        setContracts(data.data);
      } else {
        toast.error("Không thể tải danh sách hợp đồng");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (contract) => {
    setSelectedContract(contract);
    setDetailOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "sent": return "bg-blue-100 text-blue-800";
      case "signed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "draft": return "Bản nháp";
      case "sent": return "Đã gửi";
      case "signed": return "Đã ký";
      case "cancelled": return "Đã hủy";
      default: return status;
    }
  };

  const handlePayment = (payment, index) => {
    setSelectedPayment(payment);
    setPaymentScheduleIndex(index);
    setPaymentOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };


  if (loading) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Hợp đồng</h1>
        
        {contracts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Bạn chưa có hợp đồng nào.
          </div>
        ) : (
          <div className="grid gap-6">
            {contracts.map((contract) => (
              <Card key={contract._id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={getStatusColor(contract.status)}>
                          {getStatusLabel(contract.status)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Số HĐ: {contract.contract_number}
                        </span>
                      </div>
                      <CardTitle className="text-xl">
                        {contract.booking_id?.event_type || "Sự kiện"}
                      </CardTitle>
                      <CardDescription>
                        Ngày ký: {new Date(contract.signing_date).toLocaleDateString('vi-VN')}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-sky-600">
                        {contract.total_cost?.toLocaleString('vi-VN')} VNĐ
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Ngày sự kiện:</span>
                        <span className="ml-2">
                          {contract.booking_id?.event_date 
                            ? new Date(contract.booking_id.event_date).toLocaleDateString('vi-VN')
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Địa điểm:</span>
                        <span className="ml-2">{contract.event_content?.location || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Quy mô:</span>
                        <span className="ml-2">{contract.event_content?.scale || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Bên A (Khách hàng):</span>
                        <div className="mt-1 text-sm text-gray-600">
                          <div>{contract.party_a?.name || 'N/A'}</div>
                          <div>{contract.party_a?.phone || 'N/A'}</div>
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Địa điểm ký:</span>
                        <div className="mt-1 text-sm text-gray-600">
                          {contract.signing_location}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 flex justify-end gap-2 py-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetail(contract)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Xem chi tiết
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Contract Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Chi tiết hợp đồng</DialogTitle>
              <DialogDescription>
                Thông tin chi tiết về hợp đồng dịch vụ tổ chức sự kiện
              </DialogDescription>
            </DialogHeader>
            
            {selectedContract && (
              <div className="space-y-6 py-4">
                {/* Contract Info */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">Thông tin hợp đồng</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Số hợp đồng: </span>
                      <span>{selectedContract.contract_number}</span>
                    </div>
                    <div>
                      <span className="font-medium">Ngày ký: </span>
                      <span>{new Date(selectedContract.signing_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Địa điểm ký: </span>
                      <span>{selectedContract.signing_location}</span>
                    </div>
                    <div>
                      <span className="font-medium">Trạng thái: </span>
                      <Badge className={getStatusColor(selectedContract.status)}>
                        {getStatusLabel(selectedContract.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Party A - Customer */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">BÊN A - KHÁCH HÀNG</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Tên: </span>
                      <span>{selectedContract.party_a?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Địa chỉ: </span>
                      <span>{selectedContract.party_a?.address || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Điện thoại: </span>
                      <span>{selectedContract.party_a?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Email: </span>
                      <span>{selectedContract.party_a?.email || 'N/A'}</span>
                    </div>
                    {selectedContract.party_a?.representative && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">Người đại diện: </span>
                        <span>{selectedContract.party_a.representative}</span>
                        {selectedContract.party_a?.position && (
                          <span className="text-gray-500">({selectedContract.party_a.position})</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Party B - Organizer */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">BÊN B - ĐơN VỊ TỔ CHỨC</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Tên công ty: </span>
                      <span>{selectedContract.party_b?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Địa chỉ: </span>
                      <span>{selectedContract.party_b?.address || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Điện thoại: </span>
                      <span>{selectedContract.party_b?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Email: </span>
                      <span>{selectedContract.party_b?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">Người đại diện: </span>
                      <span>{selectedContract.party_b?.representative || 'N/A'}</span>
                      {selectedContract.party_b?.position && (
                        <span className="text-gray-500">({selectedContract.party_b.position})</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Content */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">Nội dung sự kiện</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Thời gian: </span>
                      <span>{selectedContract.event_content?.time || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Địa điểm: </span>
                      <span>{selectedContract.event_content?.location || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-medium">Quy mô: </span>
                      <span>{selectedContract.event_content?.scale || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Work Items */}
                {selectedContract.work_items && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-bold text-lg mb-3 text-sky-700">Hạng mục công việc</h3>
                    <div className="text-sm whitespace-pre-wrap">
                      {selectedContract.work_items}
                    </div>
                  </div>
                )}

                {/* Total Cost */}
                <div className="border rounded-lg p-4 bg-sky-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">Tổng chi phí</h3>
                  <div className="text-2xl font-bold text-sky-700">
                    {selectedContract.total_cost?.toLocaleString('vi-VN')} VNĐ
                  </div>
                </div>

                {/* Payment Schedule */}
                {selectedContract.payment_schedule && selectedContract.payment_schedule.length > 0 && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-bold text-lg mb-3 text-sky-700">Tiến độ thanh toán</h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700 font-medium">
                          <tr>
                            <th className="p-2 border-b">Mô tả</th>
                            <th className="p-2 border-b text-right">Số tiền</th>
                            <th className="p-2 border-b">Hạn thanh toán</th>
                            <th className="p-2 border-b">Trạng thái</th>
                            <th className="p-2 border-b text-center">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {selectedContract.payment_schedule.map((payment, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-2">{payment.description}</td>
                              <td className="p-2 text-right font-medium">
                                {payment.amount?.toLocaleString('vi-VN')} VNĐ
                              </td>
                              <td className="p-2">
                                {payment.deadline 
                                  ? new Date(payment.deadline).toLocaleDateString('vi-VN')
                                  : 'N/A'}
                              </td>
                              <td className="p-2">
                                <Badge variant="outline" className={
                                  payment.status === 'paid' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }>
                                  {payment.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                                </Badge>
                              </td>
                              <td className="p-2 text-center">
                                {payment.status !== 'paid' && (
                                  <Button 
                                    size="sm" 
                                    variant="default"
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                                    onClick={() => handlePayment(payment, idx)}
                                  >
                                    <CreditCard className="w-4 h-4 mr-1" />
                                    Thanh toán
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Responsibilities */}
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedContract.party_a_responsibilities && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-bold text-lg mb-3 text-sky-700">Trách nhiệm Bên A</h3>
                      <div className="text-sm whitespace-pre-wrap">
                        {selectedContract.party_a_responsibilities}
                      </div>
                    </div>
                  )}
                  {selectedContract.party_b_responsibilities && (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h3 className="font-bold text-lg mb-3 text-sky-700">Trách nhiệm Bên B</h3>
                      <div className="text-sm whitespace-pre-wrap">
                        {selectedContract.party_b_responsibilities}
                      </div>
                    </div>
                  )}
                </div>

                {/* General Terms */}
                {selectedContract.general_terms && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <h3 className="font-bold text-lg mb-3 text-sky-700">Điều khoản chung</h3>
                    <div className="text-sm whitespace-pre-wrap">
                      {selectedContract.general_terms}
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailOpen(false)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Info Dialog */}
        <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                💳 Thông tin thanh toán
              </DialogTitle>
              <DialogDescription>
                Vui lòng thực hiện thanh toán theo thông tin bên dưới
              </DialogDescription>
            </DialogHeader>
            
            {selectedPayment && selectedContract && (
              <div className="space-y-6 py-4">
                {/* Contract Number */}
                <div className="text-center pb-4 border-b">
                  <p className="text-sm text-gray-600">Hợp đồng số</p>
                  <p className="text-lg font-bold text-gray-900">{selectedContract.contract_number}</p>
                </div>

                {/* Payment Status Check */}
                {selectedPayment.status === 'paid' ? (
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-green-700 mb-2">Đã thanh toán</h2>
                    <p className="text-green-600">
                      Thanh toán đã được xác nhận vào {formatDate(selectedPayment.paid_at)}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Payment Info Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                        <p className="text-sm text-purple-600 font-semibold mb-1">Nội dung thanh toán</p>
                        <p className="text-base font-bold text-purple-900">{selectedPayment.description}</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                        <p className="text-sm text-blue-600 font-semibold mb-1">Số tiền</p>
                        <p className="text-xl font-bold text-blue-900">{formatCurrency(selectedPayment.amount)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg">
                        <p className="text-sm text-pink-600 font-semibold mb-1">Hạn thanh toán</p>
                        <p className="text-base font-bold text-pink-900">{formatDate(selectedPayment.deadline)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg">
                        <p className="text-sm text-yellow-700 font-semibold mb-1">Trạng thái</p>
                        <p className="text-base font-bold text-yellow-900">⏳ Chờ thanh toán</p>
                      </div>
                    </div>

                    {/* QR Code & Bank Transfer */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* QR Code */}
                      {selectedPayment.qr_code && (
                        <div className="bg-gradient-to-br from-purple-100 to-blue-100 p-6 rounded-lg">
                          <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                            📱 Quét mã QR
                          </h3>
                          <div className="bg-white p-4 rounded-lg inline-block">
                            <img 
                              src={selectedPayment.qr_code} 
                              alt="QR Code thanh toán"
                              className="w-48 h-48 object-contain mx-auto"
                            />
                          </div>
                          <p className="text-sm text-purple-700 mt-4">
                            Sử dụng app ngân hàng để quét mã QR và thanh toán
                          </p>
                        </div>
                      )}

                      {/* Bank Transfer Info */}
                      <div className="bg-white border-2 border-purple-200 p-6 rounded-lg">
                        <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                          🏦 Thông tin chuyển khoản
                        </h3>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-600">Ngân hàng</p>
                            <p className="font-bold text-gray-900">{process.env.NEXT_PUBLIC_SEPAY_BANK_CODE || 'VCB'} - Vietcombank</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Số tài khoản</p>
                            <p className="font-bold text-gray-900">{process.env.NEXT_PUBLIC_SEPAY_ACCOUNT_NUMBER || '0123456789'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Chủ tài khoản</p>
                            <p className="font-bold text-gray-900">{process.env.NEXT_PUBLIC_SEPAY_ACCOUNT_NAME || 'CONG TY PLADIVO'}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Số tiền</p>
                            <p className="font-bold text-2xl text-red-600">{formatCurrency(selectedPayment.amount)}</p>
                          </div>
                          <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg">
                            <p className="text-sm text-yellow-800 font-bold mb-2">⚠️ Nội dung chuyển khoản (BẮT BUỘC)</p>
                            <code className="bg-white px-3 py-2 rounded text-pink-600 font-mono font-bold text-base block">
                              {selectedPayment.payment_code}
                            </code>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <h4 className="font-bold text-blue-900 mb-2">💡 Lưu ý quan trọng:</h4>
                      <ul className="list-disc list-inside text-blue-800 space-y-1 text-sm">
                        <li>Vui lòng nhập <strong>CHÍNH XÁC</strong> nội dung chuyển khoản như trên</li>
                        <li>Hệ thống sẽ tự động xác nhận thanh toán trong vòng 1-2 phút</li>
                        <li>Sau khi thanh toán đợt đầu tiên, hợp đồng sẽ được kích hoạt</li>
                        <li>Nếu có vấn đề, vui lòng liên hệ: {selectedContract.party_b?.phone || '0987654321'}</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setPaymentOpen(false)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
