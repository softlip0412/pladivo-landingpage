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

export default function BookingDialog() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

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
        setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tạo Booking</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo Booking</DialogTitle>
          <DialogDescription>
            Điền thông tin sự kiện và dịch vụ tại đây
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          {/* Event Type */}
          <div>
            <Label>Chọn loại sự kiện</Label>
            <Select onValueChange={(val) => setEventType(val)}>
              <SelectTrigger>
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
            <div>
              <Label className="flex items-center gap-2">
                <Checkbox
                  checked={allowAuditing}
                  onCheckedChange={(checked) => setAllowAuditing(checked)}
                />
                <span>Có Cho phép đặt chỗ dự thính không?</span>
              </Label>
              {allowAuditing && (
                <div className="mt-2 max-h-60 overflow-y-auto border rounded p-2 space-y-3">
                  {auditingAreaTypes.map((area) => (
                    <div key={area.name} className="flex flex-col gap-1 border-b pb-2 last:border-0">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={auditingAreas[area.name] > 0}
                          onCheckedChange={(checked) => {
                            if (!checked) handleAuditingAreaChange(area.name, 0);
                            else handleAuditingAreaChange(area.name, 1);
                          }}
                        />
                        <span className="font-medium">{area.name}</span>
                      </div>
                      <p className="text-xs text-gray-500 ml-6">{area.description}</p>
                      {auditingAreas[area.name] > 0 && (
                        <div className="ml-6 flex items-center gap-2">
                          <Label className="text-xs">Số lượng:</Label>
                          <Input
                            type="number"
                            min={1}
                            value={auditingAreas[area.name]}
                            onChange={(e) => handleAuditingAreaChange(area.name, e.target.value)}
                            className="w-20 h-8 text-sm"
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
            <div>
              <Label className="flex items-center gap-2">
                <Checkbox
                  checked={ticketSales}
                  onCheckedChange={(checked) => setTicketSales(checked)}
                />
                <span>Có bán vé không?</span>
              </Label>
              {ticketSales && (
                <div className="mt-2 max-h-40 overflow-y-auto border rounded p-2 space-y-1">
                  {ticketTypes.map((type) => (
                    <div key={type} className="flex items-center gap-2">
                      <Checkbox
                        checked={tickets[type] > 0}
                        onCheckedChange={(checked) => {
                          if (!checked) handleTicketChange(type, 0);
                          else handleTicketChange(type, 1);
                        }}
                      />
                      <span className="flex-1">{type}</span>
                      {tickets[type] > 0 && (
                        <Input
                          type="number"
                          min={1}
                          value={tickets[type]}
                          onChange={(e) => handleTicketChange(type, e.target.value)}
                          className="w-20"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Customer Info - Auto-filled and Read-only */}
          <div className="grid grid-cols-2 gap-2">
            <Input 
              placeholder="Tên khách hàng" 
              value={customerName} 
              readOnly 
              className="bg-gray-50 cursor-not-allowed"
              title="Tự động điền từ hồ sơ người dùng"
            />
            <Input 
              placeholder="Địa chỉ" 
              value={address} 
              readOnly 
              className="bg-gray-50 cursor-not-allowed"
              title="Tự động điền từ hồ sơ người dùng"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input 
              placeholder="Phone" 
              value={phone} 
              readOnly 
              className="bg-gray-50 cursor-not-allowed"
              title="Tự động điền từ hồ sơ người dùng"
            />
            <Input 
              placeholder="Email" 
              value={email} 
              readOnly 
              className="bg-gray-50 cursor-not-allowed"
              title="Tự động điền từ hồ sơ người dùng"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Input type="number" placeholder="Số lượng khách" value={scale} onChange={(e) => setScale(e.target.value)} />
            <Input type="date" placeholder="Ngày sự kiện" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-sm text-gray-600">Giờ bắt đầu</Label>
              <Input type="time" placeholder="Giờ bắt đầu" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Giờ kết thúc</Label>
              <Input type="time" placeholder="Giờ kết thúc" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          {/* Partner Selection - Nhà hàng / Khách sạn */}
          <div>
            <Label>Chọn Nhà hàng / Khách sạn</Label>
            <Select onValueChange={(val) => setPartnerId(val)} value={partnerId}>
              <SelectTrigger>
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

          {/* Select Services */}
          <div>
            <Label>Chọn dịch vụ</Label>
            <Select onValueChange={(val) => handleAddService(val)}>
              <SelectTrigger>
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
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {selectedServices.map((s) => (
                <div key={s.service_id} className="p-2 flex justify-between items-center bg-gray-50 border rounded">
                  <span>
                    {s.name} x {s.quantity} ({s.minPrice} ~ {s.maxPrice} / {s.unit})
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveService(s.service_id)}>
                    ✖
                  </Button>
                </div>
              ))}
            </div>
          )}

          <Textarea placeholder="Ghi chú" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white">
            Đặt Booking
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
