"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  UserCircle,

  Calendar,
  FileText,
  LogOut,
  User,
  Mail,
  Phone,
  Shield,
  Building,
  MapPin,
  CreditCard,
} from "lucide-react";
import BookingDialog from "@/app/booking/page";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export default function Header({ activePage = "" }) {
  const { user, setUser, logout, loading } = useAuth();

  // Profile Dialog State
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileFormData, setProfileFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const navItems = [
    { href: "/", label: "Trang chủ", key: "home" },
    { href: "/about", label: "Giới thiệu", key: "about" },
    { href: "/guide", label: "Hướng dẫn", key: "guide" },
    { href: "/events", label: "Sự kiện", key: "events" },
    { href: "/blogs", label: "Blogs", key: "blogs" },
    { href: "/services", label: "Dịch vụ", key: "services" },
  ];

  // Profile Handlers
  const handleEditProfile = () => {
    setProfileFormData({
      full_name: user.profile?.full_name || "",
      date_of_birth: user.profile?.date_of_birth
        ? new Date(user.profile.date_of_birth).toISOString().split("T")[0]
        : "",
      gender: user.profile?.gender || "",
      bio: user.profile?.bio || "",
      company_name: user.profile?.company_name || "",
      address: user.profile?.address || "",
      tax_code: user.profile?.tax_code || "",
      payment_info: user.profile?.payment_info || "",
      image: user.profile?.image || "",
    });
    setAvatarPreview(user.profile?.image || null);
    setAvatarFile(null);
    setIsEditingProfile(true);
  };

  const handleFormChange = (field, value) => {
    setProfileFormData((prev) => ({ ...prev, [field]: value }));
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
        formData.append("file", avatarFile);

        const uploadRes = await apiFetch("/api/upload/avatar", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          toast.error(uploadData.error || "Upload avatar thất bại");
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

      console.log("Sending profile data:", dataToSend);

      const res = await apiFetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Cập nhật thất bại");
        return;
      }

      toast.success("Cập nhật thông tin thành công!");

      // Refresh user data
      const userRes = await apiFetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
      }

      setIsEditingProfile(false);
      setProfileFormData({});
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error("Save profile error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-sky-600">
            <a href="/">Pladivo</a>
          </div>

          {/* Navbar */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                className={
                  activePage === item.key
                    ? "text-sky-600 font-semibold"
                    : "text-gray-700 hover:text-sky-600 transition-colors"
                }
              >
                {item.label}
              </a>
            ))}
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
                        <p className="text-sm font-medium leading-none">
                          {user.username}
                        </p>
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
                      <a
                        href="/my-bookings"
                        className="flex items-center cursor-pointer"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Lịch sử đơn đặt</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href="/contracts"
                        className="flex items-center cursor-pointer"
                      >
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

      {/* Profile Dialog */}
      {user && (
        <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-sky-600">
                Thông tin cá nhân
              </DialogTitle>
              <DialogDescription>
                {isEditingProfile
                  ? "Cập nhật thông tin cá nhân của bạn"
                  : "Xem thông tin chi tiết về tài khoản của bạn"}
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
                          <p className="text-sm text-gray-500">
                            Tên người dùng
                          </p>
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
                            <p className="text-sm text-gray-500">
                              Số điện thoại
                            </p>
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
                              <p className="font-medium">
                                {user.profile.full_name}
                              </p>
                            </div>
                          </div>
                        )}
                        {user.profile.date_of_birth && (
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-sky-600" />
                            <div>
                              <p className="text-sm text-gray-500">Ngày sinh</p>
                              <p className="font-medium">
                                {new Date(
                                  user.profile.date_of_birth
                                ).toLocaleDateString("vi-VN")}
                              </p>
                            </div>
                          </div>
                        )}
                        {user.profile.gender && (
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-sky-600" />
                            <div>
                              <p className="text-sm text-gray-500">Giới tính</p>
                              <p className="font-medium capitalize">
                                {user.profile.gender === "male"
                                  ? "Nam"
                                  : user.profile.gender === "female"
                                  ? "Nữ"
                                  : "Khác"}
                              </p>
                            </div>
                          </div>
                        )}
                        {user.profile.bio && (
                          <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-sky-600 mt-1" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Giới thiệu
                              </p>
                              <p className="font-medium">{user.profile.bio}</p>
                            </div>
                          </div>
                        )}
                        {user.profile.company_name && (
                          <div className="flex items-center gap-3">
                            <Building className="h-5 w-5 text-sky-600" />
                            <div>
                              <p className="text-sm text-gray-500">Công ty</p>
                              <p className="font-medium">
                                {user.profile.company_name}
                              </p>
                            </div>
                          </div>
                        )}
                        {user.profile.address && (
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-sky-600" />
                            <div>
                              <p className="text-sm text-gray-500">Địa chỉ</p>
                              <p className="font-medium">
                                {user.profile.address}
                              </p>
                            </div>
                          </div>
                        )}
                        {user.profile.tax_code && (
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-sky-600" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Mã số thuế
                              </p>
                              <p className="font-medium">
                                {user.profile.tax_code}
                              </p>
                            </div>
                          </div>
                        )}
                        {user.profile.payment_info && (
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-sky-600" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Thông tin thanh toán
                              </p>
                              <p className="font-medium">
                                {user.profile.payment_info}
                              </p>
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
                        onChange={(e) =>
                          handleFormChange("full_name", e.target.value)
                        }
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date_of_birth">Ngày sinh</Label>
                      <Input
                        id="date_of_birth"
                        type="date"
                        value={profileFormData.date_of_birth}
                        onChange={(e) =>
                          handleFormChange("date_of_birth", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    <Select
                      value={profileFormData.gender}
                      onValueChange={(value) =>
                        handleFormChange("gender", value)
                      }
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
                      onChange={(e) => handleFormChange("bio", e.target.value)}
                      placeholder="Giới thiệu ngắn về bản thân"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name">Công ty</Label>
                    <Input
                      id="company_name"
                      value={profileFormData.company_name}
                      onChange={(e) =>
                        handleFormChange("company_name", e.target.value)
                      }
                      placeholder="Tên công ty"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      value={profileFormData.address}
                      onChange={(e) =>
                        handleFormChange("address", e.target.value)
                      }
                      placeholder="Địa chỉ"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tax_code">Mã số thuế</Label>
                      <Input
                        id="tax_code"
                        value={profileFormData.tax_code}
                        onChange={(e) =>
                          handleFormChange("tax_code", e.target.value)
                        }
                        placeholder="Mã số thuế"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment_info">Thông tin thanh toán</Label>
                      <Input
                        id="payment_info"
                        value={profileFormData.payment_info}
                        onChange={(e) =>
                          handleFormChange("payment_info", e.target.value)
                        }
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
                    {isSaving ? "Đang lưu..." : "Lưu"}
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
      )}
    </>
  );
}
