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
import { Calendar, MapPin, Clock, Building2, AlertTriangle, FileText, Bell, Star, MessageSquare, ListTodo, CheckCircle2, Circle, Timer } from "lucide-react";
import Header from "@/components/Header";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Report State
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [feedbackType, setFeedbackType] = useState("question");
  const [rating, setRating] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Feedback History State
  const [feedbackHistoryOpen, setFeedbackHistoryOpen] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loadingFeedbackHistory, setLoadingFeedbackHistory] = useState(false);

  // Task Timeline State
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Event Plan Dialog State
  const [eventPlanOpen, setEventPlanOpen] = useState(false);
  const [selectedEventPlan, setSelectedEventPlan] = useState(null);
  
  // Plan Confirmation State
  const [confirmPlanOpen, setConfirmPlanOpen] = useState(false);
  const [isConfirmingPlan, setIsConfirmingPlan] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/my-bookings");
      const data = await res.json();
      if (data.success) {
        // Sort bookings: ones with event plans first
        const sortedBookings = data.data.sort((a, b) => {
          if (a.eventPlan && !b.eventPlan) return -1;
          if (!a.eventPlan && b.eventPlan) return 1;
          return 0;
        });
        setBookings(sortedBookings);
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

  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      toast.error("Vui lòng nhập nội dung báo cáo");
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      const res = await fetch("/api/booking-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: selectedBookingId,
          feedback_type: feedbackType,
          rating: rating > 0 ? rating : null,
          message: reportReason,
          priority: "medium",
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Đã gửi báo cáo thành công", {
          description: "Chúng tôi sẽ xem xét và phản hồi sớm nhất có thể",
        });
        setReportOpen(false);
        // Reset form
        setReportReason("");
        setFeedbackType("question");
        setRating(0);
        setSelectedBookingId(null);
        setSelectedBooking(null);
      } else {
        toast.error(data.message || "Gửi báo cáo thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối khi gửi báo cáo");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const fetchFeedbackHistory = async (bookingId) => {
    setLoadingFeedbackHistory(true);
    try {
      const res = await fetch(`/api/booking-feedback?booking_id=${bookingId}`);
      const data = await res.json();
      
      if (data.success) {
        setFeedbackHistory(data.data);
      } else {
        toast.error(data.message || "Không thể tải lịch sử phản hồi");
        setFeedbackHistory([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối khi tải lịch sử phản hồi");
      setFeedbackHistory([]);
    } finally {
      setLoadingFeedbackHistory(false);
    }
  };

  const fetchTasks = async (bookingId) => {
    setLoadingTasks(true);
    try {
      const res = await fetch(`/api/tasks?booking_id=${bookingId}`);
      const data = await res.json();
      
      if (data.success) {
        setTasks(data.data);
      } else {
        toast.error(data.message || "Không thể tải tiến độ công việc");
        setTasks([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối khi tải tiến độ");
      setTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleViewEventPlan = (eventPlan) => {
    setSelectedEventPlan(eventPlan);
    setEventPlanOpen(true);
  };

  const handleConfirmPlan = async () => {
    if (!selectedEventPlan) return;
    
    setIsConfirmingPlan(true);

    let newStatus = "";
    let comment = "";
    const currentStatus = selectedEventPlan.status;

    if (currentStatus === 'manager_approved_demo' || currentStatus === 'pending_customer_demo') {
        newStatus = 'customer_approved_demo';
        comment = 'đã duyệt kế hoạch Thử nghiệm';
    } else if (currentStatus === 'manager_approved' || currentStatus === 'pending_customer') {
        newStatus = 'customer_approved';
        comment = 'đã duyệt kế hoạch chi tiết';
    }

    if (!newStatus) {
        toast.error("Trạng thái không hợp lệ để xác nhận");
        setIsConfirmingPlan(false);
        return;
    }

    try {
      const res = await fetch(`/api/event-plans/${selectedEventPlan._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, comment }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Đã xác nhận kế hoạch thành công");
        setConfirmPlanOpen(false);
        setEventPlanOpen(false);
        fetchBookings(); // Reload list
      } else {
        toast.error(data.message || "Xác nhận thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối");
    } finally {
      setIsConfirmingPlan(false);
    }
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
            <Card 
              key={booking._id} 
              className={`overflow-hidden relative ${booking.eventPlan ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
              onClick={() => booking.eventPlan && handleViewEventPlan(booking.eventPlan)}
            >
              {/* Event Plan Notification Dot */}
              {/* Event Plan Notification Dot */}
              {booking.eventPlan && (
                booking.eventPlan.status === 'manager_approved' || 
                booking.eventPlan.status === 'manager_approved_demo' ||
                booking.eventPlan.status === 'pending_customer' ||
                booking.eventPlan.status === 'pending_customer_demo'
              ) && (
                <div 
                  className="absolute top-3 right-3 z-10 pointer-events-none"
                  title="Có kế hoạch sự kiện cần duyệt"
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75"></div>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBookingId(booking._id);
                    setSelectedBooking(booking);
                    fetchTasks(booking._id);
                    setTimelineOpen(true);
                  }}
                >
                  <ListTodo className="w-4 h-4 mr-2" />
                  Tiến độ
                </Button>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBookingId(booking._id);
                    setSelectedBooking(booking);
                    fetchFeedbackHistory(booking._id);
                    setFeedbackHistoryOpen(true);
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Xem phản hồi
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBookingId(booking._id);
                    setSelectedBooking(booking);
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelBooking(booking._id);
                    }}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Gửi phản hồi về đơn đặt</DialogTitle>
            <DialogDescription>
              {selectedBooking && (
                <span className="text-sm">
                  Đơn #{selectedBooking._id.slice(-6)} - {selectedBooking.event_type}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Feedback Type */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Loại phản hồi</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFeedbackType("complaint")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    feedbackType === "complaint"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <div className="font-medium">❗ Khiếu nại</div>
                  <div className="text-xs text-gray-500">Vấn đề cần giải quyết</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType("suggestion")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    feedbackType === "suggestion"
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="font-medium">💡 Góp ý</div>
                  <div className="text-xs text-gray-500">Đề xuất cải thiện</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType("praise")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    feedbackType === "praise"
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="font-medium">👏 Khen ngợi</div>
                  <div className="text-xs text-gray-500">Dịch vụ tốt</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackType("question")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    feedbackType === "question"
                      ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <div className="font-medium">❓ Câu hỏi</div>
                  <div className="text-xs text-gray-500">Cần hỗ trợ</div>
                </button>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Đánh giá (tùy chọn)</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <button
                    type="button"
                    onClick={() => setRating(0)}
                    className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Xóa đánh giá
                  </button>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-base font-semibold">
                Nội dung chi tiết <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Hãy mô tả chi tiết vấn đề, góp ý hoặc câu hỏi của bạn..."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <div className="text-xs text-gray-500">
                {reportReason.length}/1000 ký tự
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setReportOpen(false);
                setReportReason("");
                setFeedbackType("question");
                setRating(0);
              }}
              disabled={isSubmittingFeedback}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleReportSubmit} 
              disabled={!reportReason.trim() || isSubmittingFeedback}
              className="bg-sky-600 hover:bg-sky-700"
            >
              {isSubmittingFeedback ? "Đang gửi..." : "Gửi phản hồi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback History Dialog */}
      <Dialog open={feedbackHistoryOpen} onOpenChange={setFeedbackHistoryOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Lịch sử phản hồi</DialogTitle>
            <DialogDescription>
              {selectedBooking && (
                <span className="text-sm">
                  Đơn #{selectedBooking._id.slice(-6)} - {selectedBooking.event_type}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {loadingFeedbackHistory ? (
              <div className="text-center py-8 text-gray-500">Đang tải lịch sử...</div>
            ) : feedbackHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mb-2" />
                <p>Chưa có phản hồi nào cho đơn đặt này</p>
              </div>
            ) : (
              feedbackHistory.map((item) => (
                <div key={item._id} className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2 items-center">
                      <Badge 
                        variant="outline" 
                        className={`
                          ${item.feedback_type === 'complaint' ? 'border-red-200 bg-red-50 text-red-700' : ''}
                          ${item.feedback_type === 'suggestion' ? 'border-blue-200 bg-blue-50 text-blue-700' : ''}
                          ${item.feedback_type === 'praise' ? 'border-green-200 bg-green-50 text-green-700' : ''}
                          ${item.feedback_type === 'question' ? 'border-yellow-200 bg-yellow-50 text-yellow-700' : ''}
                        `}
                      >
                        {item.feedback_type === 'complaint' && '❗ Khiếu nại'}
                        {item.feedback_type === 'suggestion' && '💡 Góp ý'}
                        {item.feedback_type === 'praise' && '👏 Khen ngợi'}
                        {item.feedback_type === 'question' && '❓ Câu hỏi'}
                      </Badge>
                      
                      <Badge variant="secondary" className="text-xs">
                        {item.status === 'new' && 'Mới'}
                        {item.status === 'in_progress' && 'Đang xử lý'}
                        {item.status === 'resolved' && 'Đã giải quyết'}
                        {item.status === 'closed' && 'Đã đóng'}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  {item.rating && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                  )}

                  <div className="text-gray-700 bg-gray-50 p-3 rounded-md text-sm">
                    {item.message}
                  </div>

                  {/* Staff Response */}
                  {item.staff_response && (
                    <div className="bg-sky-50 border border-sky-100 rounded-md p-3 mt-3 ml-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-sky-200 flex items-center justify-center text-xs text-sky-700 font-bold">
                          QTV
                        </div>
                        <span className="font-bold text-sm text-sky-800">
                          Phản hồi từ {item.responded_by?.full_name || "Quản trị viên"}
                        </span>
                        <span className="text-xs text-sky-400 ml-auto">
                          {new Date(item.responded_at || item.updatedAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <div className="text-sm text-sky-900 pl-8">
                        {item.staff_response}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackHistoryOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Timeline Dialog */}
      <Dialog open={timelineOpen} onOpenChange={setTimelineOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tiến độ thực hiện đơn hàng</DialogTitle>
            <DialogDescription>
              {selectedBooking && (
                <span className="text-sm">
                  Đơn #{selectedBooking._id.slice(-6)} - {selectedBooking.event_type}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4 px-2">
            {loadingTasks ? (
              <div className="text-center py-8 text-gray-500">Đang tải tiến độ...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                <ListTodo className="w-12 h-12 text-gray-300 mb-2" />
                <p>Chưa có công việc nào được tạo cho đơn hàng này</p>
                <p className="text-sm mt-1">Vui lòng chờ nhân viên sắp xếp kế hoạch.</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pb-4">
                {tasks.map((task, index) => {
                  let statusColor = "bg-gray-200 text-gray-500";
                  let icon = <Circle className="w-5 h-5" />;
                  let statusText = "Đang chờ";

                  if (task.status === "completed") {
                    statusColor = "bg-green-100 text-green-600 border-green-200";
                    icon = <CheckCircle2 className="w-5 h-5" />;
                    statusText = "Hoàn thành";
                  } else if (task.status === "in_progress") {
                    statusColor = "bg-blue-100 text-blue-600 border-blue-200";
                    icon = <Timer className="w-5 h-5 animate-pulse" />;
                    statusText = "Đang thực hiện";
                  } else if (task.status === "cancelled") {
                     statusColor = "bg-red-100 text-red-600 border-red-200";
                     icon = <AlertTriangle className="w-5 h-5" />;
                     statusText = "Đã hủy";
                  }

                  return (
                    <div key={task._id} className="relative pl-8">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[9px] top-0 w-5 h-5 rounded-full border bg-white flex items-center justify-center ${
                          task.status === "completed" ? "border-green-500 text-green-500" :
                          task.status === "in_progress" ? "border-blue-500 text-blue-500" :
                          "border-gray-300 text-gray-300"
                        }`}>
                         {task.status === "completed" && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                         {task.status === "in_progress" && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />}
                         {task.status === "pending" && <div className="w-2.5 h-2.5 bg-gray-300 rounded-full" />}
                      </div>

                      <div className={`border rounded-lg p-4 transition-all hover:shadow-md ${task.status === 'in_progress' ? 'ring-2 ring-blue-100 border-blue-200' : ''}`}>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                          <h4 className={`font-bold text-lg ${task.status === 'completed' ? 'text-gray-800 line-through decoration-gray-400' : 'text-gray-900'}`}>
                            {task.category}
                          </h4>
                          <Badge variant="outline" className={`w-fit flex items-center gap-1 ${statusColor}`}>
                            {icon}
                            {statusText}
                          </Badge>
                        </div>
                        
                        {task.description && (
                           <p className="text-gray-600 mb-3 text-sm whitespace-pre-line">
                             {task.description}
                           </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2 border-t pt-2">
                           {task.deadline && (
                             <div className={`flex items-center gap-1 ${
                               new Date(task.deadline) < new Date() && task.status !== 'completed' ? 'text-red-500 font-medium' : ''
                             }`}>
                               <Clock className="w-3.5 h-3.5" />
                               <span>Hạn chót: {new Date(task.deadline).toLocaleDateString('vi-VN')}</span>
                             </div>
                           )}
                           
                           {task.priority && (
                             <div className="flex items-center gap-1">
                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                 task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' :
                                 task.priority === 'medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                 'bg-slate-50 text-slate-600 border-slate-100'
                               }`}>
                                 {task.priority === 'high' ? 'Ưu tiên cao' : task.priority === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                               </span>
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTimelineOpen(false)}>Đóng</Button>
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
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 font-medium">
                              <tr>
                                <th className="p-2 border-b">Hạng mục</th>
                                <th className="p-2 border-b">Mô tả</th>
                                <th className="p-2 border-b text-right">Số lượng</th>
                                <th className="p-2 border-b text-right">Đơn giá</th>
                                <th className="p-2 border-b text-right">Thành tiền</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {selectedEventPlan.step2.budget.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="p-2">{item.category}</td>
                                  <td className="p-2">{item.description}</td>
                                  <td className="p-2 text-right">{item.quantity} {item.unit}</td>
                                  <td className="p-2 text-right">{item.cost?.toLocaleString('vi-VN')}</td>
                                  <td className="p-2 text-right font-medium">
                                    {(item.quantity * item.cost)?.toLocaleString('vi-VN')}
                                  </td>
                                </tr>
                              ))}
                              <tr className="bg-sky-50 font-bold">
                                <td colSpan={4} className="p-2 text-right text-sky-700">Tổng cộng:</td>
                                <td className="p-2 text-right text-sky-700">
                                  {selectedEventPlan.step2.budget.reduce((sum, item) => sum + (item.quantity * item.cost), 0).toLocaleString('vi-VN')} VNĐ
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedEventPlan.step2.staffAssign && selectedEventPlan.step2.staffAssign.length > 0 && (
                      <div>
                        <span className="font-medium block mb-2">Phân công nhân sự:</span>
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 font-medium">
                              <tr>
                                <th className="p-2 border-b">Nhân sự</th>
                                <th className="p-2 border-b">Bộ phận</th>
                                <th className="p-2 border-b">Nhiệm vụ</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {selectedEventPlan.step2.staffAssign.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="p-2 flex items-center gap-2">
                                    {item.manager?.id?.avatar_url ? (
                                      <img 
                                        src={item.manager.id.avatar_url} 
                                        alt={item.manager.id.full_name} 
                                        className="w-8 h-8 rounded-full object-cover border"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                        {item.manager?.id?.full_name?.charAt(0) || "NV"}
                                      </div>
                                    )}
                                    <span className="font-medium">{item.manager?.id?.full_name || item.manager?.name || "Chưa phân công"}</span>
                                  </td>
                                  <td className="p-2">{item.department}</td>
                                  <td className="p-2">{item.duty}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
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
                  <div className="space-y-4">
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
                      {selectedEventPlan.step3.decoration && (
                        <div>
                          <span className="font-medium">Trang trí: </span>
                          <span>{selectedEventPlan.step3.decoration}</span>
                        </div>
                      )}
                    </div>

                    {selectedEventPlan.step3.programScript && selectedEventPlan.step3.programScript.length > 0 && (
                      <div>
                        <span className="font-medium block mb-2">Kịch bản chương trình:</span>
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 font-medium">
                              <tr>
                                <th className="p-2 border-b w-1/4">Thời gian</th>
                                <th className="p-2 border-b">Nội dung</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {selectedEventPlan.step3.programScript.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="p-2">
                                    {item.time ? new Date(item.time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                                  </td>
                                  <td className="p-2">{item.content}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {selectedEventPlan.step3.keyActivities && selectedEventPlan.step3.keyActivities.length > 0 && (
                      <div>
                        <span className="font-medium block mb-2">Hoạt động chính:</span>
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-700 font-medium">
                              <tr>
                                <th className="p-2 border-b">Hoạt động</th>
                                <th className="p-2 border-b w-1/4">Tầm quan trọng</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {selectedEventPlan.step3.keyActivities.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="p-2">{item.activity}</td>
                                  <td className="p-2">
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      {item.importance}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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
                    {/* Manager approval hidden as requested */}
                    {/* {selectedEventPlan.approvals.manager && (
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
                    )} */}
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
            {(selectedEventPlan?.status === 'pending_customer' || 
              selectedEventPlan?.status === 'pending_customer_demo' ||
              selectedEventPlan?.status === 'manager_approved' || 
              selectedEventPlan?.status === 'manager_approved_demo') && (
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setConfirmPlanOpen(true)}
              >
                Xác nhận kế hoạch
              </Button>
            )}
            <Button variant="outline" onClick={() => setEventPlanOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmPlanOpen} onOpenChange={setConfirmPlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận kế hoạch</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xác nhận kế hoạch này không? 
              Sau khi xác nhận, chúng tôi sẽ tiến hành các bước tiếp theo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmPlanOpen(false)}>Hủy</Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleConfirmPlan} 
              disabled={isConfirmingPlan}
            >
              {isConfirmingPlan ? "Đang xử lý..." : "Đồng ý xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}
