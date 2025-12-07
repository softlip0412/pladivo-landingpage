"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Search, Filter, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import { useBookingDialog } from "@/context/BookingDialogContext";
import BookingDialog from "@/components/BookingDialog";
import AnimatedHero from "@/components/AnimatedHero";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const servicesGridRef = useRef(null);
  
  const { openBookingWithService } = useBookingDialog();

  // Initial categories just in case, but we will populate from data
  // const categories = [
  //   { value: "all", label: "All Categories" },
  //   { value: "Catering", label: "Catering" },
  //   { value: "Photography", label: "Photography" },
  //   { value: "Venues", label: "Venues" },
  //   { value: "Equipment Rental", label: "Equipment Rental" },
  // ];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedCategory, selectedType]);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
        
        // Extract unique categories
        const uniqueCategories = new Map();
        data.data.forEach(service => {
          if (service.category_id) {
             uniqueCategories.set(service.category_id._id, service.category_id.name);
          } else if (service.category) {
             // Fallback for old data if any
             uniqueCategories.set(service.category, service.category);
          }
        });
        
        const categoryOptions = [
            { value: "all", label: "Tất cả danh mục" },
            ...Array.from(uniqueCategories.entries()).map(([id, name]) => ({
                value: id, // We use ID for filtering if available, or name if that's what we have
                label: name,
                originalName: name // Keep name for matching if needed
            }))
        ];
        setCategories(categoryOptions);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    // Filter by category
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (service) => 
          (service.category_id?._id === selectedCategory) || 
          (service.category_id?.name === selectedCategory) ||
          (service.category === selectedCategory)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== "all") {
        filtered = filtered.filter((service) => service.type === selectedType);
    }

    setFilteredServices(filtered);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    // Add small delay to ensure state update triggers render before scrolling, though usually not strictly necessary with refs if static
    setTimeout(() => {
        servicesGridRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBooking = (serviceId) => {
    openBookingWithService(serviceId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="services" />

      <main>
        {/* Hero Section */}
        {/* Hero Section */}
        {/* Hero Section */}
        <AnimatedHero 
          variant="indigo"
          subtitle="✨ Dịch vụ Đẳng cấp 5 Sao"
          title="Nâng Tầm Sự Kiện Cùng Pladivo"
          description="Khám phá hệ sinh thái dịch vụ toàn diện, từ ẩm thực tinh hoa đến không gian sang trọng, được tuyển chọn kỹ lưỡng để biến mọi ý tưởng thành hiện thực."
          actions={
            <>
               <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                  <span className="text-2xl">🏆</span>
                  <span className="text-white font-medium">Chất lượng hàng đầu</span>
               </div>
               <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                  <span className="text-2xl">⚡</span>
                  <span className="text-white font-medium">Đặt chỗ nhanh chóng</span>
               </div>
               <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                  <span className="text-2xl">🛡️</span>
                  <span className="text-white font-medium">Bảo đảm uy tín</span>
               </div>
            </>
          }
        />

        {/* Search and Filter Section */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm Dịch vụ
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by service name, description, or features..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phân loại
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={filterServices}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Filter className="h-4 w-4 mr-2" />
                Áp dụng Bộ lọc
              </Button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 bg-gray-50" ref={servicesGridRef}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredServices.length} Dịch vụ Tìm thấy
              </h2>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48 bg-white border-gray-200">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
                  <SelectItem value="price-low">Giá: Thấp đến Cao</SelectItem>
                  <SelectItem value="price-high">Giá: Cao đến Thấp</SelectItem>
                  <SelectItem value="name">Tên A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Đang tải danh sách dịch vụ...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                  Rất tiếc, chúng tôi không tìm thấy dịch vụ nào phù hợp với tìm kiếm của bạn. Hãy thử thay đổi bộ lọc hoặc từ khóa.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5"
                >
                  Xóa bộ lọc tìm kiếm
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service) => (
                  <Card
                    key={service._id}
                    className="group flex flex-col h-full bg-white border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden"
                  >
                    {/* Image Section */}
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                      <img
                        src={
                          service.images && service.images.length > 0
                            ? service.images[0]
                            : `https://images.unsplash.com/photo-1511795409835-a9f21b8718db?w=800&fit=crop`
                        }
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1511795409835-a9f21b8718db?w=800&fit=crop";
                        }}
                      />
                      
                      {/* Price Badge */}
                      <div className="absolute bottom-4 left-4 z-20">
                         <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg flex flex-col gap-0.5">
                            <div className="flex items-baseline gap-1">
                                <span className="text-lg font-bold text-primary">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.minPrice)}
                                </span>
                                <span className="text-sm text-gray-500">-</span>
                                <span className="text-lg font-bold text-primary">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.maxPrice)}
                                </span>
                            </div>
                            {service.unit && (
                              <span className="text-xs text-gray-500 font-medium self-end">/ {service.unit}</span>
                            )}
                         </div>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
                        <span className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                          {service.category_id?.name || service.category || 'Dịch vụ'}
                        </span>
                        {service.type && (
                             <span className="bg-blue-600/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 shadow-sm">
                             {service.type}
                           </span>
                        )}
                         <span className={`backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 shadow-sm ${service.status ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                           {service.status ? 'Đang hoạt động' : 'Tạm ngưng'}
                         </span>
                      </div>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 z-10" />
                    </div>

                    {/* Content Section */}
                    <CardContent className="flex flex-col flex-1 p-6 relative">
                      
                      <div className="mb-4">
                        <h3 className="font-bold text-xl text-gray-900 group-hover:text-primary transition-colors line-clamp-1 mb-2" title={service.name}>
                          {service.name}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px]">
                          {service.description || "Chưa có mô tả cho dịch vụ này. Vui lòng liên hệ để biết thêm chi tiết."}
                        </p>
                      </div>

                      {/* Features / Details Placeholder - Can be replaced with real data if added to schema */}
                      <div className="space-y-2 mb-6 flex-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="truncate">Chất lượng tiêu chuẩn 5 sao</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="truncate">Hỗ trợ tư vấn 24/7</span>
                        </div>
                         {/* Mock rating if not in DB */}
                        <div className="flex items-center pt-2 mt-2 border-t border-gray-100">
                           <div className="flex text-yellow-400">
                              {[1,2,3,4,5].map(i => (
                                <Star key={i} className="h-3.5 w-3.5 fill-current" />
                              ))}
                           </div>
                           <span className="text-xs text-gray-400 ml-2">(4.9/5 từ khách hàng)</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleBooking(service._id)}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-6 rounded-xl shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5"
                      >
                        Đặt dịch vụ ngay
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Service Categories Overview */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">
              Các Sự kiện
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card
                className={`text-center border-2 transition-all cursor-pointer ${selectedType === "Hội nghị" ? 'border-primary shadow-xl bg-blue-50' : 'border-gray-100 hover:border-blue-200 hover:shadow-xl'}`}
                onClick={() => handleTypeSelect("Hội nghị")}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Hội nghị</h3>
                  <p className="text-gray-600 text-sm">
                    Tổ chức hội nghị chuyên nghiệp với đầy đủ trang thiết bị và dịch vụ.
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`text-center border-2 transition-all cursor-pointer ${selectedType === "Sự kiện công ty" ? 'border-primary shadow-xl bg-blue-50' : 'border-gray-100 hover:border-blue-200 hover:shadow-xl'}`}
                onClick={() => handleTypeSelect("Sự kiện công ty")}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sự kiện công ty</h3>
                  <p className="text-gray-600 text-sm">
                     Tiệc tất niên, kỷ niệm thành lập, team building và các sự kiện nội bộ.
                  </p>
                </CardContent>
              </Card>

              <Card
                className={`text-center border-2 transition-all cursor-pointer ${selectedType === "Sự kiện đại chúng" ? 'border-primary shadow-xl bg-blue-50' : 'border-gray-100 hover:border-blue-200 hover:shadow-xl'}`}
                onClick={() => handleTypeSelect("Sự kiện đại chúng")}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sự kiện đại chúng</h3>
                  <p className="text-gray-600 text-sm">
                     Lễ hội, concerts, sự kiện cộng đồng quy mô lớn và chuyên nghiệp.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <Footer />
      
      {/* Global Booking Dialog */}
      <BookingDialog />
    </div>
  );
}
