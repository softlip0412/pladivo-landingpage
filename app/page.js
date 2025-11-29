"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
} from "lucide-react";

export default function App() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [discountedItems, setDiscountedItems] = useState([]);
  const [activeEventSlide, setActiveEventSlide] = useState(0);
  const [activePromoSlide, setActivePromoSlide] = useState(0);
  const [activeServiceSlide, setActiveServiceSlide] = useState(0);
  const [eventCards, setEventCards] = useState([]);
  
  const router = useRouter();

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
      <Header activePage="home" />

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
                  <CardSlider
                    items={promoServices}
                    activeSlide={activePromoSlide}
                    setActiveSlide={setActivePromoSlide}
                    renderCard={(service) => (
                      <div
                        key={service.id}
                        className="w-full flex-shrink-0 px-6 pb-6"
                      >
                        <div className="relative mb-4">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {service.discount}
                          </div>
                        </div>
                        <h3 className="font-bold text-xl mb-2">
                          {service.title}
                        </h3>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-500 line-through">
                            {service.originalPrice}
                          </span>
                          <span className="text-xl font-bold text-red-600">
                            {service.discountedPrice}
                          </span>
                        </div>
                        <div className="flex items-center mb-4">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm">{service.rating}</span>
                        </div>
                        <Button className="w-full bg-sky-600 hover:bg-sky-700">
                          Đặt Ngay
                        </Button>
                      </div>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section 2: Discounted Items (Carousel) */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ưu đãi đặc biệt
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Khám phá các ưu đãi tốt nhất cho sự kiện của bạn
              </p>
            </div>

            {discountedItems.length > 0 ? (
              <CardSlider
                items={discountedItems}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
                renderCard={(item) => (
                  <Card
                    key={item._id}
                    className="w-72 flex-shrink-0 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={item.image || "/default-discount.jpg"}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        -{item.percentage}%
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          Hết hạn:{" "}
                          {new Date(item.valid_until).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        <Button
                          size="sm"
                          className="bg-sky-600 hover:bg-sky-700"
                        >
                          Chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              />
            ) : (
              <p className="text-center text-gray-500">
                Không có ưu đãi nào hiện tại.
              </p>
            )}
          </div>
        </section>

        {/* Section 3: Event Cards from API */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Sự kiện sắp diễn ra
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Đừng bỏ lỡ những sự kiện hấp dẫn nhất
              </p>
            </div>

            {eventCards.length > 0 ? (
              <CardSlider
                items={eventCards}
                activeSlide={activeEventSlide}
                setActiveSlide={setActiveEventSlide}
                renderCard={(card) => (
                  <Card
                    key={card.id}
                    className="w-72 flex-shrink-0 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📅</span>
                          {card.date}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">📍</span>
                          {card.location}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sky-600">
                          {card.price}
                        </span>
                        <Button
                          size="sm"
                          className="bg-sky-600 hover:bg-sky-700"
                        >
                          Đặt vé
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              />
            ) : (
              <p className="text-center text-gray-500">Đang tải sự kiện...</p>
            )}
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
