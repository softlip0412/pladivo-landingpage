"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BookingDialog from "@/app/booking/page";
import { apiFetch } from "@/lib/api";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Star,
  Search,
  Users,
  Clock,
  Tag,
  User,
  UserCircle,
  Heart,
  FileText,
  LogOut,
  Mail,
  Phone,
  Building,
  CreditCard,
  Shield,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [discountedItems, setDiscountedItems] = useState([]);
  const [activeEventSlide, setActiveEventSlide] = useState(0);
  const [activePromoSlide, setActivePromoSlide] = useState(0);
  const [activeServiceSlide, setActiveServiceSlide] = useState(0);
  const [eventCards, setEventCards] = useState([]);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileFormData, setProfileFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { user, setUser, logout, loading } = useAuth();
  const router = useRouter();

  const [openBooking, setOpenBooking] = useState(false);

  // Profile form handlers
  const handleEditProfile = () => {
    setProfileFormData({
      full_name: user.profile?.full_name || '',
      date_of_birth: user.profile?.date_of_birth ? new Date(user.profile.date_of_birth).toISOString().split('T')[0] : '',
      gender: user.profile?.gender || '',
      bio: user.profile?.bio || '',
      company_name: user.profile?.company_name || '',
      address: user.profile?.address || '',
      tax_code: user.profile?.tax_code || '',
      payment_info: user.profile?.payment_info || '',
      image: user.profile?.image || '',
    });
    setAvatarPreview(user.profile?.image || null);
    setAvatarFile(null);
    setIsEditingProfile(true);
  };

  const handleFormChange = (field, value) => {
    setProfileFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileFormData({});
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      let avatarUrl = profileFormData.image;

      // Upload avatar if a new file is selected
      if (avatarFile) {
        setIsUploadingAvatar(true);
        const formData = new FormData();
        formData.append('file', avatarFile);

        const uploadRes = await apiFetch('/api/upload/avatar', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          toast.error(uploadData.error || 'Upload avatar thất bại');
          setIsUploadingAvatar(false);
          setIsSaving(false);
          return;
        }

        avatarUrl = uploadData.url;
        setIsUploadingAvatar(false);
      }

      // Update profile with avatar URL
      const dataToSend = {
        ...profileFormData,
        image: avatarUrl,
      };
      
      console.log('Sending profile data:', dataToSend);
      
      const res = await apiFetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Cập nhật thất bại');
        return;
      }

      toast.success('Cập nhật thông tin thành công!');
      
      // Refresh user data
      const userRes = await apiFetch('/api/auth/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      setIsEditingProfile(false);
      setProfileFormData({});
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    async function fetchDiscounts() {
      try {
        const res = await fetch("/api/discounts");
        if (!res.ok) throw new Error("Failed to fetch discounts");
        const data = await res.json();
        setDiscountedItems(data);
      } catch (err) {
        console.error("Error loading discounts:", err);
      }
    }
    fetchDiscounts();

    async function fetchEventServices() {
      try {
        const res = await fetch("/api/event-services");
        const data = await res.json();

        const mapped = data.map((es) => {
          const event = es.event_id;
          const type = es.event_id?.type_id;

          return {
            id: es._id,
            title: event?.title || type?.name,
            date: new Date(event?.start_datetime).toLocaleDateString("vi-VN"),
            location: event?.location,
            price: es.total_price + "₫",
            rating: 4.5,
            image: type?.image || "/default.jpg",
          };
        });

        setEventCards(mapped);
      } catch (error) {
        console.error("Error fetching event services:", error);
      }
    }
    fetchEventServices();
  }, []);
  // Hàm next/prev slide
  const handlePrevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? discountedItems.length - 1 : prev - 1
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) =>
      prev === discountedItems.length - 1 ? 0 : prev + 1
    );
  };

  const promoServices = [
    {
      id: 1,
      title: "Dịch Vụ Ăn Uống Cao Cấp",
      originalPrice: "50$/người",
      discountedPrice: "35$/người",
      discount: "Giảm 30%",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=200&fit=crop",
    },
    {
      id: 2,
      title: "Chụp Ảnh Sự Kiện",
      originalPrice: "800$",
      discountedPrice: "600$",
      discount: "Giảm 25%",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1452827073306-6e6e661baf57?w=300&h=200&fit=crop",
    },
    {
      id: 3,
      title: "Thuê Hệ Thống Âm Thanh",
      originalPrice: "300$/ngày",
      discountedPrice: "200$/ngày",
      discount: "Giảm 33%",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=200&fit=crop",
    },
    {
      id: 4,
      title: "Trang Trí Địa Điểm",
      originalPrice: "1200$",
      discountedPrice: "900$",
      discount: "Giảm 25%",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=300&h=200&fit=crop",
    },
    {
      id: 5,
      title: "Dịch Vụ DJ",
      originalPrice: "500$",
      discountedPrice: "350$",
      discount: "Giảm 30%",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1571266028243-d220c9d3b323?w=300&h=200&fit=crop",
    },
  ];

  const featuredServices = [
    {
      id: 1,
      title: "Tổ Chức Đám Cưới",
      description: "Dịch vụ tổ chức đám cưới trọn gói",
      price: "Bắt đầu từ 2000$",
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=300&h=200&fit=crop",
    },
    {
      id: 2,
      title: "Sự Kiện Doanh Nghiệp",
      description: "Quản lý sự kiện doanh nghiệp chuyên nghiệp",
      price: "Bắt đầu từ 3000$",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=300&h=200&fit=crop",
    },
    {
      id: 3,
      title: "Tiệc Riêng Tư",
      description: "Lên kế hoạch tiệc riêng theo yêu cầu",
      price: "Bắt đầu từ 800$",
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&h=200&fit=crop",
    },
    {
      id: 4,
      title: "Thuê Thiết Bị",
      description: "Thiết bị âm thanh/hình ảnh chuyên nghiệp",
      price: "Bắt đầu từ 150$/ngày",
      rating: 4.6,
      image:
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=200&fit=crop",
    },
    {
      id: 5,
      title: "Đặt Địa Điểm",
      description: "Dịch vụ đặt địa điểm cao cấp",
      price: "Bắt đầu từ 500$",
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&h=200&fit=crop",
    },
  ];

  const partners = [
    {
      id: 1,
      name: "Sự Kiện Pro",
      logo: "https://via.placeholder.com/150x80/e0f2fe/0369a1?text=EventPro",
    },
    {
      id: 2,
      name: "Địa Điểm Max",
      logo: "https://via.placeholder.com/150x80/e0f2fe/0369a1?text=VenueMax",
    },
    {
      id: 3,
      name: "Catering Plus",
      logo: "https://via.placeholder.com/150x80/e0f2fe/0369a1?text=CaterPlus",
    },
    {
      id: 4,
      name: "Studio Ảnh",
      logo: "https://via.placeholder.com/150x80/e0f2fe/0369a1?text=PhotoStudio",
    },
    {
      id: 5,
      name: "Công Nghệ Âm Thanh",
      logo: "https://via.placeholder.com/150x80/e0f2fe/0369a1?text=SoundTech",
    },
    {
      id: 6,
      name: "Trang Trí Decor",
      logo: "https://via.placeholder.com/150x80/e0f2fe/0369a1?text=DecorArt",
    },
  ];

  const eventCategories = ["Buổi hòa nhạc", "Hội nghị", "Hội thảo", "Thể thao"];
  const serviceCategories = [
    "Ăn uống",
    "Chụp ảnh",
    "Địa điểm",
    "Thuê thiết bị",
  ];

  const nextSlide = (current, max, setter) => {
    setter(current === max - 1 ? 0 : current + 1);
  };

  const prevSlide = (current, max, setter) => {
    setter(current === 0 ? max - 1 : current - 1);
  };

  const CardSlider = ({ items, activeSlide, setActiveSlide, renderCard }) => (
    <div className="relative">
      <div className="flex gap-4 overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activeSlide * 320}px)` }}
        >
          {items.map(renderCard)}
        </div>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50"
        onClick={() => prevSlide(activeSlide, items.length, setActiveSlide)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50"
        onClick={() => nextSlide(activeSlide, items.length, setActiveSlide)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-sky-600">Pladivo</div>

          {/* Navbar */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-gray-700 hover:text-sky-600 transition-colors"
            >
              Trang chủ
            </a>
            <a
              href="/about"
              className="text-gray-700 hover:text-sky-600 transition-colors"
            >
              Giới thiệu
            </a>
            <a
              href="/guide"
              className="text-gray-700 hover:text-sky-600 transition-colors"
            >
              Hướng dẫn
            </a>
            <a
              href="/events"
              className="text-gray-700 hover:text-sky-600 transition-colors"
            >
              Sự kiện
            </a>
            <a
              href="/services"
              className="text-gray-700 hover:text-sky-600 transition-colors"
            >
              dịch vụ
            </a>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading...</p>
            ) : user ? (
              <>
                {/* Nút mở Booking Dialog */}
                <BookingDialog />
                
                {/* User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-sky-600 border-sky-600 hover:bg-sky-50"
                    >
                      <UserCircle className="h-4 w-4" />
                      {user.username}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.username}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowProfileDialog(true)}
                      className="flex items-center cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Thông tin cá nhân</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/wishlist" className="flex items-center cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        <span>Wishlist</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/bookings" className="flex items-center cursor-pointer">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Lịch sử đơn đặt</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/contracts" className="flex items-center cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Hợp đồng</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Dialog */}
                <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-sky-600">
                        Thông tin cá nhân
                      </DialogTitle>
                      <DialogDescription>
                        {isEditingProfile ? 'Cập nhật thông tin cá nhân của bạn' : 'Xem thông tin chi tiết về tài khoản của bạn'}
                      </DialogDescription>
                    </DialogHeader>

                    {!isEditingProfile ? (
                      // View Mode
                      <>
                        <div className="space-y-6 py-4">
                          {/* Avatar Display */}
                          <div className="flex justify-center mb-4">
                            {user.profile?.image ? (
                              <img
                                src={user.profile.image}
                                alt="User avatar"
                                className="w-32 h-32 rounded-full object-cover border-4 border-sky-600 shadow-lg"
                              />
                            ) : (
                              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg">
                                <UserCircle className="w-24 h-24 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Basic Information */}
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                              Thông tin cơ bản
                            </h3>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <UserCircle className="h-5 w-5 text-sky-600" />
                                <div>
                                  <p className="text-sm text-gray-500">Tên người dùng</p>
                                  <p className="font-medium">{user.username}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-sky-600" />
                                <div>
                                  <p className="text-sm text-gray-500">Email</p>
                                  <p className="font-medium">{user.email}</p>
                                </div>
                              </div>
                              {user.phone && (
                                <div className="flex items-center gap-3">
                                  <Phone className="h-5 w-5 text-sky-600" />
                                  <div>
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    <p className="font-medium">{user.phone}</p>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-sky-600" />
                                <div>
                                  <p className="text-sm text-gray-500">Vai trò</p>
                                  <p className="font-medium capitalize">{user.role}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Profile Information */}
                          {user.profile ? (
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                Thông tin hồ sơ
                              </h3>
                              <div className="space-y-3">
                                {user.profile.full_name && (
                                  <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-sky-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Họ và tên</p>
                                      <p className="font-medium">{user.profile.full_name}</p>
                                    </div>
                                  </div>
                                )}
                                {user.profile.date_of_birth && (
                                  <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-sky-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Ngày sinh</p>
                                      <p className="font-medium">{new Date(user.profile.date_of_birth).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                  </div>
                                )}
                                {user.profile.gender && (
                                  <div className="flex items-center gap-3">
                                    <User className="h-5 w-5 text-sky-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Giới tính</p>
                                      <p className="font-medium capitalize">
                                        {user.profile.gender === 'male' ? 'Nam' : user.profile.gender === 'female' ? 'Nữ' : 'Khác'}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                {user.profile.bio && (
                                  <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-sky-600 mt-1" />
                                    <div>
                                      <p className="text-sm text-gray-500">Giới thiệu</p>
                                      <p className="font-medium">{user.profile.bio}</p>
                                    </div>
                                  </div>
                                )}
                                {user.profile.company_name && (
                                  <div className="flex items-center gap-3">
                                    <Building className="h-5 w-5 text-sky-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Công ty</p>
                                      <p className="font-medium">{user.profile.company_name}</p>
                                    </div>
                                  </div>
                                )}
                                {user.profile.address && (
                                  <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-sky-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Địa chỉ</p>
                                      <p className="font-medium">{user.profile.address}</p>
                                    </div>
                                  </div>
                                )}
                                {user.profile.tax_code && (
                                  <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-sky-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Mã số thuế</p>
                                      <p className="font-medium">{user.profile.tax_code}</p>
                                    </div>
                                  </div>
                                )}
                                {user.profile.payment_info && (
                                  <div className="flex items-center gap-3">
                                    <CreditCard className="h-5 w-5 text-sky-600" />
                                    <div>
                                      <p className="text-sm text-gray-500">Thông tin thanh toán</p>
                                      <p className="font-medium">{user.profile.payment_info}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <p className="text-gray-500">Chưa có thông tin hồ sơ</p>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={handleEditProfile}
                            className="bg-sky-600 hover:bg-sky-700"
                          >
                            Cập nhật thông tin
                          </Button>
                          <Button
                            onClick={() => setShowProfileDialog(false)}
                            variant="outline"
                          >
                            Đóng
                          </Button>
                        </div>
                      </>
                    ) : (
                      // Edit Mode
                      <>
                        <div className="space-y-4 py-4">
                          {/* Avatar Upload Section */}
                          <div className="space-y-2">
                            <Label>Avatar</Label>
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                {avatarPreview ? (
                                  <img
                                    src={avatarPreview}
                                    alt="Avatar preview"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-sky-600"
                                  />
                                ) : (
                                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                                    <UserCircle className="w-16 h-16 text-gray-400" />
                                  </div>
                                )}
                                {isUploadingAvatar && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <Input
                                  id="avatar"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleAvatarChange}
                                  className="cursor-pointer"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Chọn ảnh JPG, PNG hoặc GIF (tối đa 5MB)
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="full_name">Họ và tên</Label>
                              <Input
                                id="full_name"
                                value={profileFormData.full_name}
                                onChange={(e) => handleFormChange('full_name', e.target.value)}
                                placeholder="Nhập họ và tên"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="date_of_birth">Ngày sinh</Label>
                              <Input
                                id="date_of_birth"
                                type="date"
                                value={profileFormData.date_of_birth}
                                onChange={(e) => handleFormChange('date_of_birth', e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="gender">Giới tính</Label>
                            <Select
                              value={profileFormData.gender}
                              onValueChange={(value) => handleFormChange('gender', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn giới tính" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Nam</SelectItem>
                                <SelectItem value="female">Nữ</SelectItem>
                                <SelectItem value="other">Khác</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bio">Giới thiệu</Label>
                            <Textarea
                              id="bio"
                              value={profileFormData.bio}
                              onChange={(e) => handleFormChange('bio', e.target.value)}
                              placeholder="Giới thiệu ngắn về bản thân"
                              rows={3}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="company_name">Công ty</Label>
                            <Input
                              id="company_name"
                              value={profileFormData.company_name}
                              onChange={(e) => handleFormChange('company_name', e.target.value)}
                              placeholder="Tên công ty"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address">Địa chỉ</Label>
                            <Input
                              id="address"
                              value={profileFormData.address}
                              onChange={(e) => handleFormChange('address', e.target.value)}
                              placeholder="Địa chỉ"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="tax_code">Mã số thuế</Label>
                              <Input
                                id="tax_code"
                                value={profileFormData.tax_code}
                                onChange={(e) => handleFormChange('tax_code', e.target.value)}
                                placeholder="Mã số thuế"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="payment_info">Thông tin thanh toán</Label>
                              <Input
                                id="payment_info"
                                value={profileFormData.payment_info}
                                onChange={(e) => handleFormChange('payment_info', e.target.value)}
                                placeholder="Số tài khoản, v.v."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                            className="bg-sky-600 hover:bg-sky-700"
                          >
                            {isSaving ? 'Đang lưu...' : 'Lưu'}
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            variant="outline"
                            disabled={isSaving}
                          >
                            Hủy
                          </Button>
                        </div>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="text-sky-600 border-sky-600 hover:bg-sky-50"
                >
                  <a href="/login">Đăng nhập</a>
                </Button>
                <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                  <a href="/signup">Tạo tài khoản</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Section 1: Split Layout */}
        <section className="py-16 relative overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-cover rounded-b-3xl overflow-hidden"
            style={{
              backgroundImage: `url('/background.jpg')`,
            }}
          />

          {/* Overlay for better readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-50/50 to-blue-50/50" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Left: Search Card */}
              <Card className="p-6 shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800 mb-4">
                    Tìm kiếm sự kiện & dịch vụ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="events" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger
                        value="events"
                        className="data-[state=active]:bg-sky-600 data-[state=active]:text-white"
                      >
                        Sự kiện
                      </TabsTrigger>
                      <TabsTrigger
                        value="services"
                        className="data-[state=active]:bg-sky-600 data-[state=active]:text-white"
                      >
                        Dịch vụ
                      </TabsTrigger>
                    </TabsList>

                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search events or services..."
                        className="pl-10"
                      />
                    </div>

                    <TabsContent value="events">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 mb-3">
                          Phân loại sự kiện
                        </h3>
                        {eventCategories.map((category, index) => (
                          <button
                            key={index}
                            className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-sky-100 hover:text-sky-700 transition-colors"
                            onClick={() =>
                              console.log(
                                `API Call: GET /api/events?category=${category}`
                              )
                            }
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="services">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-700 mb-3">
                          Phân loại dịch
                        </h3>
                        {serviceCategories.map((category, index) => (
                          <button
                            key={index}
                            className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-sky-100 hover:text-sky-700 transition-colors"
                            onClick={() =>
                              console.log(
                                `API Call: GET /api/services?category=${category}`
                              )
                            }
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Right: Special Offers Card */}
              <Card className="shadow-lg h-full overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800 mb-4">
                    Khuyến Mại
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${activeSlide * 100}%)`,
                      }}
                    >
                      {discountedItems.map((item) => (
                        <div key={item._id} className="min-w-full">
                          <div className="relative">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-64 object-cover"
                            />
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              {item.discount}
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">
                              {item.title}
                            </h3>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-gray-500 line-through text-sm">
                                  {item.originalPrice}
                                </span>
                                <span className="text-2xl font-bold text-sky-600 ml-2">
                                  {item.discountedPrice}
                                </span>
                              </div>
                              <Button
                                className="bg-sky-600 hover:bg-sky-700"
                                onClick={() =>
                                  router.push(`/booking?eventId=${item._id}`)
                                }
                              >
                                Đặt ngay
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {discountedItems.length > 0 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                          onClick={handlePrevSlide}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                          onClick={handleNextSlide}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 2: Book Now */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Đặt ngay
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Khám phá những sự kiện tuyệt vời diễn ra gần bạn và đặt vé ngay
                lập tức
              </p>
            </div>

            <CardSlider
              items={eventCards}
              activeSlide={activeEventSlide}
              setActiveSlide={setActiveEventSlide}
              renderCard={(event) => (
                <Card
                  key={event.id}
                  className="w-72 flex-shrink-0 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-sky-600 text-white px-2 py-1 rounded text-sm">
                      {event.price}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{event.rating}</span>
                      </div>
                      <Button
                        className="bg-sky-600 hover:bg-sky-700"
                        onClick={() =>
                          router.push(`/booking?eventId=${item._id}`)
                        }
                      >
                        Đặt ngay
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            />
          </div>
        </section>

        {/* Section 3: Promotions */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Khuyến mãi hiện tại
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ưu đãi có thời hạn cho các dịch vụ phổ biến nhất của chúng tôi
              </p>
            </div>

            <CardSlider
              items={promoServices}
              activeSlide={activePromoSlide}
              setActiveSlide={setActivePromoSlide}
              renderCard={(service) => (
                <Card
                  key={service.id}
                  className="w-72 flex-shrink-0 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      {service.discount}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                    <div className="mb-3">
                      <span className="text-gray-500 line-through text-sm">
                        {service.originalPrice}
                      </span>
                      <span className="text-xl font-bold text-sky-600 ml-2">
                        {service.discountedPrice}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{service.rating}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-sky-600 hover:bg-sky-700"
                        onClick={() =>
                          console.log(
                            `API Call: POST /api/services/book - Service ID: ${service.id}`
                          )
                        }
                      >
                        Đặt dịch vụ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            />
          </div>
        </section>

        {/* Section 4: Service List */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Dịch vụ nổi bật
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Dịch vụ chuyên nghiệp để khiến sự kiện của bạn trở nên đáng nhớ
              </p>
            </div>

            <CardSlider
              items={featuredServices}
              activeSlide={activeServiceSlide}
              setActiveSlide={setActiveServiceSlide}
              renderCard={(service) => (
                <Card
                  key={service.id}
                  className="w-72 flex-shrink-0 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {service.description}
                    </p>
                    <div className="mb-3">
                      <span className="text-lg font-bold text-sky-600">
                        {service.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm">{service.rating}</span>
                      </div>
                      <Button
                        size="sm"
                        className="bg-sky-600 hover:bg-sky-700"
                        onClick={() =>
                          console.log(
                            `API Call: GET /api/services/${service.id} - View service details`
                          )
                        }
                      >
                        Đọc thêm
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            />
          </div>
        </section>

        {/* Section 5: Partners */}
        <section className="py-16 bg-sky-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Đối tác của chúng tôi
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Được các doanh nghiệp hàng đầu trong ngành sự kiện tin tưởng
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex justify-center items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full h-12 object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold text-sky-400 mb-4">Pladivo</h3>
              <p className="text-gray-300 mb-4">
                Điểm đến hàng đầu của bạn cho việc đặt sự kiện và dịch vụ chuyên
                nghiệp. Giúp những khoảnh khắc đáng nhớ trở nên dễ dàng.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Help</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Hỗ trợ Khách hàng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Kết nối
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Cơ hội Nghề nghiệp
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Báo chí / Truyền thông
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Liên kết nhanh</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Sự kiện
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Dịch vụ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-sky-400 transition-colors">
                    Đối tác
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Pladivo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
