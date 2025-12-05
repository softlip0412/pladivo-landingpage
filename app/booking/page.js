"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useBookingDialog } from "@/context/BookingDialogContext";

export default function BookingDialog() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isOpen, setIsOpen } = useBookingDialog();

  const [userId, setUserId] = useState("");
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [partners, setPartners] = useState([]);

  const [eventType, setEventType] = useState("");
  const [otherEventType, setOtherEventType] = useState("");
  const [ticketSales, setTicketSales] = useState(false);
  const [tickets, setTickets] = useState({});

  const [allowAuditing, setAllowAuditing] = useState(false);
  const [auditingAreas, setAuditingAreas] = useState({});

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [scale, setScale] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [notes, setNotes] = useState("");

  const ticketTypes = [
    "Vé Standard (Phổ thông)",
    "Vé VIP (Ưu tiên)",
    "Vé VVIP / Platinum",
    "Vé Early Bird (Mua sớm)",
    "Vé Group / Doanh nghiệp",
    "Vé Workshop / Hội thảo chuyên đề",
    "Vé Festival / Lễ hội âm nhạc",
    "Vé Premium Booth Access (Triển lãm)",
    "Vé Online / Livestream",
    "Vé Press / Media / Sponsor",
  ];

  const auditingAreaTypes = [
    {
      name: "Khu Media / Báo chí",
      description: "Dành riêng cho phóng viên, truyền thông. Gần khu quay phim – camera",
    },
    {
      name: "Khu Diễn giả / Speaker Area",
      description: "Chỗ ngồi riêng cho các diễn giả. Thuận tiện lên sân khấu",
    },
    {
      name: "Khu Khách mời danh dự",
      description: "Khác VIP: thường dành riêng cho đại biểu cơ quan, tổ chức. Có bảng tên ghế",
    },
    {
      name: "Khu Nhà tài trợ (Sponsors)",
      description: "Dành cho đại diện các doanh nghiệp tài trợ. Thường nằm gần VIP",
    },
  ];

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const [serviceRes, meRes, partnersRes] = await Promise.all([
          fetch("/api/services").then((r) => r.json()),
          fetch("/api/auth/me").then((r) => r.json()),
          fetch("/api/partners").then((r) => r.json()),
        ]);

        if (serviceRes.success) setServices(serviceRes.data);
        
        // Filter partners to only show Nhà hàng and Khách sạn
        if (partnersRes.success) {
          const filteredPartners = partnersRes.data.filter(
            (p) => p.partner_type.includes("Nhà hàng") || p.partner_type.includes("Khách sạn")
          );
          setPartners(filteredPartners);
        }
        
        if (meRes.user) {
          const user = meRes.user;
          setUserId(user.user_id);
          
          // Auto-populate form fields from user data
          if (user.profile) {
            setCustomerName(user.profile.full_name || "");
            setAddress(user.profile.address || "");
          }
          setEmail(user.email || "");
          setPhone(user.phone || "");
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  const handleAddService = (serviceId) => {
    const service = services.find((s) => s._id === serviceId);
    if (!service) return;
    const exists = selectedServices.find((s) => s.service_id === serviceId);
    if (exists) {
      setSelectedServices(
        selectedServices.map((s) =>
          s.service_id === serviceId
            ? { ...s, quantity: s.quantity + 1, subtotal: (s.quantity + 1) * s.minPrice }
            : s
        )
      );
    } else {
      setSelectedServices([
        ...selectedServices,
        {
          service_id: service._id,
          name: service.name,
          price: service.minPrice,
          minPrice: service.minPrice,
          maxPrice: service.maxPrice,
          unit: service.unit,
          quantity: 1,
        },
      ]);
    }
  };

  const handleRemoveService = (serviceId) => {
    setSelectedServices(selectedServices.filter((s) => s.service_id !== serviceId));
  };

  const handleTicketChange = (type, value) => {
    setTickets((prev) => ({ ...prev, [type]: Number(value) }));
  };

  const handleAuditingAreaChange = (type, value) => {
    setAuditingAreas((prev) => ({ ...prev, [type]: Number(value) }));
  };

  const resetForm = () => {
    setEventType("");
    setOtherEventType("");
    setTicketSales(false);
    setTickets({});
    setAllowAuditing(false);
    setAuditingAreas({});
    setScale("");
    setEventDate("");
    setStartTime("");
    setEndTime("");
    setPartnerId("");
    setNotes("");
    setSelectedServices([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          event_type: eventType === "Khác" ? otherEventType : eventType,
          customer_name: customerName,
          address,
          phone,
          email,
          scale: Number(scale),
          services: selectedServices.map((s) => ({
            service_id: s.service_id,
          })),
          booking_status: "pending",
          payment_status: "pending",
          notes,
          event_date: eventDate,
          event_time: startTime,
          event_end_time: endTime,
          partner_id: partnerId || null,
          ticket_sale: (eventType === "Sự kiện đại chúng" && ticketSales),
          tickets: (eventType === "Sự kiện đại chúng" && ticketSales)
            ? Object.entries(tickets)
                .filter(([_, quantity]) => quantity > 0)
                .map(([type, quantity]) => ({ type, quantity }))
            : [],
          allow_auditing: (eventType === "Hội nghị" && allowAuditing),
          auditing_areas: (eventType === "Hội nghị" && allowAuditing)
            ? Object.entries(auditingAreas)
                .filter(([_, quantity]) => quantity > 0)
                .map(([area_type, quantity]) => ({ area_type, quantity }))
            : [],
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Đặt booking thành công!", {
          description: "Booking của bạn đã được tạo và đang chờ xác nhận.",
        });
        setIsOpen(false);
        resetForm();
      } else {
        toast.error("Lỗi khi đặt booking", {
          description: data.error || "Vui lòng thử lại sau.",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra", {
        description: "Không thể kết nối đến server. Vui lòng thử lại.",
      });
    }
  };

  if (!mounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Tạo Booking</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-3xl font-bold text-blue-600">Tạo Booking Sự Kiện</DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            Điền thông tin chi tiết về sự kiện và dịch vụ bạn cần
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
          {/* Event Type Section */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border-2 border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">1</div>
              Loại Sự Kiện
            </h3>
            <div>
              <Label className="text-gray-700 font-medium">Chọn loại sự kiện *</Label>
              <Select onValueChange={(val) => setEventType(val)} value={eventType}>
                <SelectTrigger className="mt-2 border-2 border-gray-200 focus:border-blue-500">
                  <SelectValue placeholder="Chọn loại sự kiện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hội nghị">Hội nghị</SelectItem>
                  <SelectItem value="Sự kiện công ty">Sự kiện công ty</SelectItem>
                  <SelectItem value="Sự kiện đại chúng">Sự kiện đại chúng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {eventType === "Hội nghị" && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <Checkbox
                    checked={allowAuditing}
                    onCheckedChange={(checked) => setAllowAuditing(checked)}
                  />
                  <span>Có Cho phép đặt chỗ dự thính không?</span>
                </Label>
                {allowAuditing && (
                  <div className="mt-3 max-h-60 overflow-y-auto border rounded-lg p-3 space-y-3 bg-gray-50">
                    {auditingAreaTypes.map((area) => (
                      <div key={area.name} className="flex flex-col gap-2 border-b pb-3 last:border-0">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={auditingAreas[area.name] > 0}
                            onCheckedChange={(checked) => {
                              if (!checked) handleAuditingAreaChange(area.name, 0);
                              else handleAuditingAreaChange(area.name, 1);
                            }}
                          />
                          <span className="font-medium text-gray-800">{area.name}</span>
                        </div>
                        <p className="text-xs text-gray-500 ml-6">{area.description}</p>
                        {auditingAreas[area.name] > 0 && (
                          <div className="ml-6 flex items-center gap-2">
                            <Label className="text-xs text-gray-600">Số lượng:</Label>
                            <Input
                              type="number"
                              min={1}
                              value={auditingAreas[area.name]}
                              onChange={(e) => handleAuditingAreaChange(area.name, e.target.value)}
                              className="w-24 h-9 text-sm"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {eventType === "Sự kiện đại chúng" && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                <Label className="flex items-center gap-2 text-gray-700 font-medium">
                  <Checkbox
                    checked={ticketSales}
                    onCheckedChange={(checked) => setTicketSales(checked)}
                  />
                  <span>Có bán vé không?</span>
                </Label>
                {ticketSales && (
                  <div className="mt-3 max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2 bg-gray-50">
                    {ticketTypes.map((type) => (
                      <div key={type} className="flex items-center gap-2 py-1">
                        <Checkbox
                          checked={tickets[type] > 0}
                          onCheckedChange={(checked) => {
                            if (!checked) handleTicketChange(type, 0);
                            else handleTicketChange(type, 1);
                          }}
                        />
                        <span className="flex-1 text-sm text-gray-700">{type}</span>
                        {tickets[type] > 0 && (
                          <Input
                            type="number"
                            min={1}
                            value={tickets[type]}
                            onChange={(e) => handleTicketChange(type, e.target.value)}
                            className="w-24 h-9"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Customer Info Section */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border-2 border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">2</div>
              Thông Tin Khách Hàng
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 font-medium">Tên khách hàng</Label>
                <Input 
                  placeholder="Tên khách hàng" 
                  value={customerName} 
                  readOnly 
                  className="mt-2 bg-gray-100 cursor-not-allowed border-gray-300"
                  title="Tự động điền từ hồ sơ người dùng"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Địa chỉ</Label>
                <Input 
                  placeholder="Địa chỉ" 
                  value={address} 
                  readOnly 
                  className="mt-2 bg-gray-100 cursor-not-allowed border-gray-300"
                  title="Tự động điền từ hồ sơ người dùng"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Số điện thoại</Label>
                <Input 
                  placeholder="Phone" 
                  value={phone} 
                  readOnly 
                  className="mt-2 bg-gray-100 cursor-not-allowed border-gray-300"
                  title="Tự động điền từ hồ sơ người dùng"
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Email</Label>
                <Input 
                  placeholder="Email" 
                  value={email} 
                  readOnly 
                  className="mt-2 bg-gray-100 cursor-not-allowed border-gray-300"
                  title="Tự động điền từ hồ sơ người dùng"
                />
              </div>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border-2 border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">3</div>
              Chi Tiết Sự Kiện
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 font-medium">Số lượng khách *</Label>
                <Input 
                  type="number" 
                  placeholder="Số lượng khách" 
                  value={scale} 
                  onChange={(e) => setScale(e.target.value)}
                  className="mt-2 border-2 border-gray-200 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Ngày sự kiện *</Label>
                <Input 
                  type="date" 
                  placeholder="Ngày sự kiện" 
                  value={eventDate} 
                  onChange={(e) => setEventDate(e.target.value)}
                  className="mt-2 border-2 border-gray-200 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Giờ bắt đầu *</Label>
                <Input 
                  type="time" 
                  placeholder="Giờ bắt đầu" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.target.value)}
                  className="mt-2 border-2 border-gray-200 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <Label className="text-gray-700 font-medium">Giờ kết thúc *</Label>
                <Input 
                  type="time" 
                  placeholder="Giờ kết thúc" 
                  value={endTime} 
                  onChange={(e) => setEndTime(e.target.value)}
                  className="mt-2 border-2 border-gray-200 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Partner & Services Section */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border-2 border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">4</div>
              Nhà Hàng / Khách Sạn & Dịch Vụ
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-gray-700 font-medium">Chọn Nhà hàng / Khách sạn</Label>
                <Select onValueChange={(val) => setPartnerId(val)} value={partnerId}>
                  <SelectTrigger className="mt-2 border-2 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Chọn nhà hàng hoặc khách sạn" />
                  </SelectTrigger>
                  <SelectContent>
                    {partners.map((partner) => (
                      <SelectItem key={partner._id} value={partner._id}>
                        {partner.company_name} - {partner.partner_type} ({partner.region})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-700 font-medium">Chọn dịch vụ</Label>
                <Select onValueChange={(val) => handleAddService(val)}>
                  <SelectTrigger className="mt-2 border-2 border-gray-200 focus:border-blue-500">
                    <SelectValue placeholder="Chọn dịch vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((sv) => (
                      <SelectItem key={sv._id} value={sv._id}>
                        {sv.name} - {sv.minPrice} ~ {sv.maxPrice} / {sv.unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Services */}
              {selectedServices.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  <Label className="text-gray-700 font-medium">Dịch vụ đã chọn:</Label>
                  {selectedServices.map((s) => (
                    <div key={s.service_id} className="p-3 flex justify-between items-center bg-white border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
                      <span className="text-gray-800 font-medium">
                        {s.name} x {s.quantity} ({s.minPrice} ~ {s.maxPrice} / {s.unit})
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveService(s.service_id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        ✖ Xóa
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border-2 border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">5</div>
              Ghi Chú
            </h3>
            <Textarea 
              placeholder="Nhập ghi chú hoặc yêu cầu đặc biệt..." 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              className="border-2 border-gray-200 focus:border-blue-500 min-h-[100px]"
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg py-6 font-semibold shadow-lg"
            >
              Đặt Booking Ngay
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="px-8 py-6 border-2 border-gray-300 hover:bg-gray-100"
            >
              Hủy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
