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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, MapPin, Clock, Building2, AlertTriangle, FileText, Bell } from "lucide-react";
import Header from "@/components/Header";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Report State
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [reportReason, setReportReason] = useState("");

  // Event Plan Dialog State
  const [eventPlanOpen, setEventPlanOpen] = useState(false);
  const [selectedEventPlan, setSelectedEventPlan] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/my-bookings");
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      } else {
        toast.error("Không thể tải danh sách đơn đặt");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn này không?")) return;

    try {
      const res = await fetch("/api/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "cancelled" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Đã hủy đơn thành công");
        fetchBookings(); // Reload list
      } else {
        toast.error(data.message || "Hủy đơn thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi hủy đơn");
    }
  };

  const handleReportSubmit = () => {
    // In a real app, this would send to an API
    toast.success("Đã gửi báo cáo thành công", {
      description: `Đơn #${selectedBookingId.slice(-6)}: ${reportReason}`,
    });
    setReportOpen(false);
    setReportReason("");
    setSelectedBookingId(null);
  };

  const handleViewEventPlan = (eventPlan) => {
    setSelectedEventPlan(eventPlan);
    setEventPlanOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending": return "Chờ xử lý";
      case "confirmed": return "Đã xác nhận";
      case "cancelled": return "Đã hủy";
      case "completed": return "Hoàn thành";
      default: return status;
    }
  };

  const getEventPlanStatusLabel = (status) => {
    const statusMap = {
      draft: "Bản nháp",
      pending_manager: "Chờ quản lý duyệt",
      pending_manager_demo: "Chờ quản lý duyệt (Demo)",
      manager_approved: "Quản lý đã duyệt",
      manager_approved_demo: "Quản lý đã duyệt (Demo)",
      pending_customer: "Chờ khách hàng duyệt",
      pending_customer_demo: "Chờ khách hàng duyệt (Demo)",
      customer_approved: "Khách hàng đã duyệt",
      customer_approved_demo: "Khách hàng đã duyệt (Demo)",
      in_progress: "Đang thực hiện",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return <div className="p-8 text-center">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Lịch sử đơn đặt</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          Bạn chưa có đơn đặt nào.
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <Card key={booking._id} className="overflow-hidden relative">
              {/* Event Plan Notification Dot */}
              {booking.eventPlan && (
                <div 
                  className="absolute top-3 right-3 z-10 cursor-pointer group"
                  onClick={() => handleViewEventPlan(booking.eventPlan)}
                  title="Xem kế hoạch sự kiện"
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute top-6 right-0 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    Có kế hoạch sự kiện
                  </div>
                </div>
              )}

              <CardHeader className="bg-gray-50 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={getStatusColor(booking.booking_status)}>
                        {getStatusLabel(booking.booking_status)}
                      </Badge>
                      <span className="text-sm text-gray-500">#{booking._id.slice(-6)}</span>
                    </div>
                    <CardTitle className="text-xl">{booking.event_type}</CardTitle>
                    <CardDescription>
                      Đặt lúc: {new Date(booking.createdAt).toLocaleString('vi-VN')}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-sky-600">
                      {booking.scale} khách
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Ngày diễn ra:</span>
                      <span className="ml-2">
                        {new Date(booking.event_date).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Thời gian:</span>
                      <span className="ml-2">
                        {booking.event_time} - {booking.event_end_time}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="font-medium">Địa điểm:</span>
                      <span className="ml-2">{booking.address}</span>
                    </div>
                    {booking.partner_id && (
                      <div className="flex items-center text-gray-700">
                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">Đối tác:</span>
                        <span className="ml-2">
                          {booking.partner_id.company_name} ({booking.partner_id.partner_type})
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Dịch vụ đã chọn:</span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {booking.services && booking.services.length > 0 ? (
                          booking.services.map((s, idx) => (
                            <Badge key={idx} variant="secondary">
                              {s.service_id?.name || "Dịch vụ"} (x{s.quantity})
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">Không có dịch vụ</span>
                        )}
                      </div>
                    </div>

                    {booking.allow_auditing && (
                      <div>
                        <span className="font-medium text-gray-700">Khu vực dự thính:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {booking.auditing_areas.map((area, idx) => (
                            <Badge key={idx} variant="outline" className="border-sky-200 bg-sky-50">
                              {area.area_type}: {area.quantity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {booking.tickets && booking.tickets.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Vé bán ra:</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {booking.tickets.map((ticket, idx) => (
                            <Badge key={idx} variant="outline" className="border-green-200 bg-green-50 text-green-800">
                              {ticket.type}: {ticket.quantity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 flex justify-end gap-2 py-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedBookingId(booking._id);
                    setReportOpen(true);
                  }}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Báo cáo
                </Button>
                
                {booking.booking_status === 'pending' || booking.booking_status === 'confirmed' ? (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Hủy đơn
                  </Button>
                ) : null}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Báo cáo vấn đề</DialogTitle>
            <DialogDescription>
              Hãy cho chúng tôi biết vấn đề bạn gặp phải với đơn đặt này.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason" className="mb-2 block">Nội dung báo cáo</Label>
            <Textarea
              id="reason"
              placeholder="Nhập nội dung..."
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>Hủy</Button>
            <Button onClick={handleReportSubmit} disabled={!reportReason.trim()}>Gửi báo cáo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Plan Details Dialog */}
      <Dialog open={eventPlanOpen} onOpenChange={setEventPlanOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Chi tiết kế hoạch sự kiện</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về kế hoạch tổ chức sự kiện
            </DialogDescription>
          </DialogHeader>
          
          {selectedEventPlan && (
            <div className="space-y-6 py-4">
              {/* Status */}
              <div className="flex items-center gap-3">
                <span className="font-semibold">Trạng thái:</span>
                <Badge className="bg-sky-100 text-sky-800">
                  {getEventPlanStatusLabel(selectedEventPlan.status)}
                </Badge>
              </div>

              {/* Step 1: Mục tiêu */}
              {selectedEventPlan.step1 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">Bước 1: Mục tiêu sự kiện</h3>
                  <div className="space-y-2">
                    {selectedEventPlan.step1.goal && (
                      <div>
                        <span className="font-medium">Mục tiêu: </span>
                        <span>{selectedEventPlan.step1.goal}</span>
                      </div>
                    )}
                    {selectedEventPlan.step1.audience && (
                      <div>
                        <span className="font-medium">Đối tượng: </span>
                        <span>{selectedEventPlan.step1.audience}</span>
                      </div>
                    )}
                    {selectedEventPlan.step1.eventCategory && (
                      <div>
                        <span className="font-medium">Loại sự kiện: </span>
                        <span>{selectedEventPlan.step1.eventCategory}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Lập kế hoạch */}
              {selectedEventPlan.step2 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">Bước 2: Lập kế hoạch</h3>
                  <div className="space-y-3">
                    {selectedEventPlan.step2.startDate && (
                      <div>
                        <span className="font-medium">Ngày bắt đầu: </span>
                        <span>{new Date(selectedEventPlan.step2.startDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                    {selectedEventPlan.step2.endDate && (
                      <div>
                        <span className="font-medium">Ngày kết thúc: </span>
                        <span>{new Date(selectedEventPlan.step2.endDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                    
                    {selectedEventPlan.step2.budget && selectedEventPlan.step2.budget.length > 0 && (
                      <div>
                        <span className="font-medium block mb-2">Ngân sách:</span>
                        <div className="space-y-1 ml-4">
                          {selectedEventPlan.step2.budget.map((item, idx) => (
                            <div key={idx} className="text-sm">
                              • {item.category}: {item.description} - {item.quantity} {item.unit} × {item.cost?.toLocaleString('vi-VN')} VNĐ
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedEventPlan.step2.staffAssign && selectedEventPlan.step2.staffAssign.length > 0 && (
                      <div>
                        <span className="font-medium block mb-2">Phân công nhân sự:</span>
                        <div className="space-y-1 ml-4">
                          {selectedEventPlan.step2.staffAssign.map((item, idx) => (
                            <div key={idx} className="text-sm">
                              • {item.department}: {item.duty} - {item.manager?.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Thiết kế chủ đề */}
              {selectedEventPlan.step3 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">Bước 3: Thiết kế chủ đề</h3>
                  <div className="space-y-2">
                    {selectedEventPlan.step3.theme && (
                      <div>
                        <span className="font-medium">Chủ đề: </span>
                        <span>{selectedEventPlan.step3.theme}</span>
                      </div>
                    )}
                    {selectedEventPlan.step3.mainColor && (
                      <div>
                        <span className="font-medium">Màu chủ đạo: </span>
                        <span>{selectedEventPlan.step3.mainColor}</span>
                      </div>
                    )}
                    {selectedEventPlan.step3.style && (
                      <div>
                        <span className="font-medium">Phong cách: </span>
                        <span>{selectedEventPlan.step3.style}</span>
                      </div>
                    )}
                    {selectedEventPlan.step3.message && (
                      <div>
                        <span className="font-medium">Thông điệp: </span>
                        <span>{selectedEventPlan.step3.message}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3.5: Kế hoạch chi phí */}
              {selectedEventPlan.step3_5 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">Bước 3.5: Kế hoạch chi phí</h3>
                  <div className="space-y-2">
                    {selectedEventPlan.step3_5.totalEstimatedCost && (
                      <div>
                        <span className="font-medium">Tổng chi phí dự kiến: </span>
                        <span className="text-lg font-bold text-sky-600">
                          {selectedEventPlan.step3_5.totalEstimatedCost.toLocaleString('vi-VN')} VNĐ
                        </span>
                      </div>
                    )}
                    {selectedEventPlan.step3_5.totalDeposit && (
                      <div>
                        <span className="font-medium">Tổng đặt cọc: </span>
                        <span>{selectedEventPlan.step3_5.totalDeposit.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                    )}
                    {selectedEventPlan.step3_5.totalRemaining && (
                      <div>
                        <span className="font-medium">Còn lại: </span>
                        <span>{selectedEventPlan.step3_5.totalRemaining.toLocaleString('vi-VN')} VNĐ</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Chuẩn bị chi tiết */}
              {selectedEventPlan.step4 && selectedEventPlan.step4.checklist && selectedEventPlan.step4.checklist.length > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">Bước 4: Chuẩn bị chi tiết</h3>
                  <div className="space-y-1">
                    {selectedEventPlan.step4.checklist.map((item, idx) => (
                      <div key={idx} className="text-sm flex items-start gap-2">
                        <span className={item.status === 'completed' ? 'text-green-600' : 'text-gray-600'}>
                          {item.status === 'completed' ? '✓' : '○'}
                        </span>
                        <span>{item.category}: {item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Marketing */}
              {selectedEventPlan.step5 && selectedEventPlan.step5.marketingChecklist && selectedEventPlan.step5.marketingChecklist.length > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">Bước 5: Truyền thông & Marketing</h3>
                  <div className="space-y-1">
                    {selectedEventPlan.step5.marketingChecklist.map((item, idx) => (
                      <div key={idx} className="text-sm flex items-start gap-2">
                        <span className={item.status === 'completed' ? 'text-green-600' : 'text-gray-600'}>
                          {item.status === 'completed' ? '✓' : '○'}
                        </span>
                        <span>{item.category}: {item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Ngày sự kiện */}
              {selectedEventPlan.step6 && selectedEventPlan.step6.eventDayChecklist && selectedEventPlan.step6.eventDayChecklist.length > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">Bước 6: Triển khai ngày sự kiện</h3>
                  <div className="space-y-1">
                    {selectedEventPlan.step6.eventDayChecklist.map((item, idx) => (
                      <div key={idx} className="text-sm flex items-start gap-2">
                        <span className={item.status === 'completed' ? 'text-green-600' : 'text-gray-600'}>
                          {item.status === 'completed' ? '✓' : '○'}
                        </span>
                        <span>{item.category}: {item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 7: Hậu sự kiện */}
              {selectedEventPlan.step7 && selectedEventPlan.step7.postEvent && selectedEventPlan.step7.postEvent.length > 0 && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">Bước 7: Hậu sự kiện</h3>
                  <div className="space-y-1">
                    {selectedEventPlan.step7.postEvent.map((item, idx) => (
                      <div key={idx} className="text-sm flex items-start gap-2">
                        <span className={item.status === 'completed' ? 'text-green-600' : 'text-gray-600'}>
                          {item.status === 'completed' ? '✓' : '○'}
                        </span>
                        <span>{item.category}: {item.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval Info */}
              {selectedEventPlan.approvals && (
                <div className="border rounded-lg p-4 bg-sky-50">
                  <h3 className="font-bold text-lg mb-3 text-sky-700">Thông tin phê duyệt</h3>
                  <div className="space-y-2">
                    {selectedEventPlan.approvals.manager && (
                      <div>
                        <span className="font-medium">Quản lý: </span>
                        <Badge variant={selectedEventPlan.approvals.manager.approved ? "default" : "secondary"}>
                          {selectedEventPlan.approvals.manager.approved ? "Đã duyệt" : "Chưa duyệt"}
                        </Badge>
                        {selectedEventPlan.approvals.manager.comment && (
                          <div className="text-sm text-gray-600 mt-1">
                            Nhận xét: {selectedEventPlan.approvals.manager.comment}
                          </div>
                        )}
                      </div>
                    )}
                    {selectedEventPlan.approvals.customer && (
                      <div>
                        <span className="font-medium">Khách hàng: </span>
                        <Badge variant={selectedEventPlan.approvals.customer.approved ? "default" : "secondary"}>
                          {selectedEventPlan.approvals.customer.approved ? "Đã duyệt" : "Chưa duyệt"}
                        </Badge>
                        {selectedEventPlan.approvals.customer.comment && (
                          <div className="text-sm text-gray-600 mt-1">
                            Nhận xét: {selectedEventPlan.approvals.customer.comment}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setEventPlanOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
