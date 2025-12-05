"use client";

import { useState, useEffect } from "react";
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

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Catering", label: "Catering" },
    { value: "Photography", label: "Photography" },
    { value: "Venues", label: "Venues" },
    { value: "Equipment Rental", label: "Equipment Rental" },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, selectedCategory]);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
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
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          service.features?.some((feature) =>
            feature.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredServices(filtered);
  };

  const handleBooking = (serviceId) => {
    // This would typically navigate to a booking page or open a booking modal
    window.location.href = `/booking?serviceId=${serviceId}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="services" />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Dịch vụ Sự kiện Chuyên nghiệp
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Tìm các nhà cung cấp dịch vụ uy tín cho tiệc, nhiếp ảnh, địa điểm,
              cho thuê thiết bị và nhiều dịch vụ khác.
            </p>
          </div>
        </section>

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
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {filteredServices.length} Dịch vụ Tìm thấy
              </h2>
              <Select defaultValue="rating">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Được Đánh Giá Cao Nhất</SelectItem>
                  <SelectItem value="price-low">Giá: Thấp đến Cao</SelectItem>
                  <SelectItem value="price-high">Giá: Cao đến Thấp</SelectItem>
                  <SelectItem value="name">Theo thứ tự chữ cái</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Đang tải dịch vụ ...</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Không tìm thấy dịch vụ nào phù hợp với tiêu chí của bạn.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                >
                  Xóa bộ lọc
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service) => (
                  <Card
                    key={service.id}
                    className="overflow-hidden border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all hover:scale-105"
                  >
                    <div className="relative">
                      <img
                        src={`https://images.unsplash.com/photo-${
                          service.id === 1
                            ? "1414235077428-338989a2e8c0"
                            : service.id === 2
                            ? "1452827073306-6e6e661baf57"
                            : service.id === 3
                            ? "1511285560929-80b456fea0bc"
                            : "1598300042247-d088f8ab3a91"
                        }?w=400&h=250&fit=crop`}
                        alt={service.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        {service.category}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-2">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Features:
                        </h4>
                        <ul className="space-y-1">
                          {service.features
                            ?.slice(0, 3)
                            .map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center text-gray-600 text-sm"
                              >
                                <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                                {feature}
                              </li>
                            ))}
                        </ul>
                      </div>

                      <div className="flex items-center mb-4">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-semibold">
                          {service.rating}
                        </span>
                        <span className="text-gray-600 text-sm ml-2">
                          (50+ đánh giá)
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-blue-600">
                          {service.price}
                        </div>
                        <Button
                          onClick={() => handleBooking(service.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Đặt dịch vụ
                        </Button>
                      </div>
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
              Các loại dịch vụ
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card
                className="text-center border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedCategory("Catering")}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🍽️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Catering</h3>
                  <p className="text-gray-600 text-sm">
                    Dịch vụ ẩm thực chuyên nghiệp cho mọi loại sự kiện
                  </p>
                </CardContent>
              </Card>

              <Card
                className="text-center border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedCategory("Photography")}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📸</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nhiếp ảnh</h3>
                  <p className="text-gray-600 text-sm">
                    Ghi lại những khoảnh khắc đặc biệt của bạn một cách chuyên
                    nghiệp
                  </p>
                </CardContent>
              </Card>

              <Card
                className="text-center border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedCategory("Venues")}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏛️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Venues</h3>
                  <p className="text-gray-600 text-sm">
                    Những địa điểm tuyệt đẹp cho những sự kiện đáng nhớ
                  </p>
                </CardContent>
              </Card>

              <Card
                className="text-center border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedCategory("Equipment Rental")}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Thiết bị</h3>
                  <p className="text-gray-600 text-sm">
                    Thuê thiết bị âm thanh, hình ảnh và kỹ thuật
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
