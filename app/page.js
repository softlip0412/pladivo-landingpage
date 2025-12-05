"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ArrowRight, 
  Calendar, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Target
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useBookingDialog } from "@/context/BookingDialogContext";

const eventShowcase = [
  {
    id: 1,
    title: "Hội nghị & Sự kiện doanh nghiệp",
    description: "Tổ chức sự kiện chuyên nghiệp cho doanh nghiệp",
    image: "/events/conference.jpg",
    stats: "500+ sự kiện"
  },
  {
    id: 2,
    title: "Sự kiện ca nhạc & Giải trí",
    description: "Trải nghiệm âm nhạc đỉnh cao",
    image: "/events/concert.jpg",
    stats: "300+ concert"
  },
  {
    id: 3,
    title: "Team Building & Gala Dinner",
    description: "Kết nối và gắn kết đội ngũ",
    image: "/events/corporate.jpg",
    stats: "400+ sự kiện"
  }
];

const features = [
  {
    icon: Calendar,
    title: "Quản lý dễ dàng",
    description: "Nền tảng trực quan giúp bạn quản lý mọi khía cạnh của sự kiện"
  },
  {
    icon: Users,
    title: "Đội ngũ chuyên nghiệp",
    description: "Đội ngũ có kinh nghiệm sẵn sàng hỗ trợ 24/7"
  },
  {
    icon: TrendingUp,
    title: "Tối ưu chi phí",
    description: "Tiết kiệm đến 30% chi phí với các gói dịch vụ của chúng tôi"
  },
  {
    icon: Award,
    title: "Đáng tin cậy",
    description: "Được hơn 10,000+ khách hàng tin tưởng và lựa chọn"
  }
];

const testimonials = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "CEO, Tech Corp",
    content: "Pladivo đã giúp chúng tôi tổ chức hội nghị thường niên một cách hoàn hảo. Chuyên nghiệp và tận tâm!",
    rating: 5,
    avatar: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=0ea5e9&color=fff"
  },
  {
    id: 2,
    name: "Trần Thị B",
    role: "Event Manager",
    content: "Nền tảng rất dễ sử dụng, tiết kiệm thời gian và chi phí cho công ty chúng tôi rất nhiều.",
    rating: 5,
    avatar: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=0ea5e9&color=fff"
  },
  {
    id: 3,
    name: "Lê Văn C",
    role: "Wedding Planner",
    content: "Đã tổ chức hơn 50 đám cưới qua Pladivo. Khách hàng luôn hài lòng với dịch vụ!",
    rating: 5,
    avatar: "https://ui-avatars.com/api/?name=Le+Van+C&background=0ea5e9&color=fff"
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { user } = useAuth();
  const { openBookingDialog } = useBookingDialog();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventShowcase.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % eventShowcase.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + eventShowcase.length) % eventShowcase.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Component */}
      <Header activePage="home" />

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Nền tảng quản lý sự kiện #1 Việt Nam</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Biến sự kiện của bạn thành
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> hiện thực</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Quản lý mọi khía cạnh của sự kiện từ lập kế hoạch đến thực hiện. 
                Tiết kiệm thời gian, tối ưu chi phí, tạo trải nghiệm đáng nhớ.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                {user ? (
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
                    onClick={openBookingDialog}
                  >
                    Tạo sự kiện ngay
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <Link href="/signup">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                      Tạo sự kiện ngay
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Link href="#events">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Khám phá thêm
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">1.5K+</div>
                  <div className="text-sm text-gray-600">Sự kiện</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">10K+</div>
                  <div className="text-sm text-gray-600">Khách hàng</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-gray-600">Hài lòng</div>
                </div>
              </div>
            </div>

            {/* Right Image Carousel */}
            <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
              {eventShowcase.map((event, index) => (
                <div
                  key={event.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent z-10" />
                  <div 
                    className="h-full w-full bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url(${event.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-blue-100 mb-3">{event.description}</p>
                      <div className="text-sm text-blue-200">{event.stats}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Navigation */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {eventShowcase.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn Pladivo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cung cấp mọi thứ bạn cần để tổ chức sự kiện thành công
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section id="events" className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Các loại sự kiện chúng tôi phục vụ
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Từ hội nghị doanh nghiệp đến tiệc cưới, chúng tôi có kinh nghiệm với mọi loại sự kiện
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventShowcase.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-xl transition-all group">
                <div className="relative h-64">
                  <div 
                    className="h-full w-full bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                    style={{ 
                      backgroundImage: `url(${event.image})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                    <p className="text-blue-100 text-sm mb-2">{event.description}</p>
                    <div className="text-xs text-blue-200">{event.stats}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hơn 10,000+ khách hàng hài lòng với dịch vụ của Pladivo
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`transition-opacity duration-500 ${
                    index === currentTestimonial ? 'opacity-100' : 'opacity-0 absolute inset-0'
                  }`}
                >
                  <Card className="border-2 border-blue-100">
                    <CardContent className="p-8">
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-xl text-gray-700 mb-6 italic">
                        "{testimonial.content}"
                      </p>
                      <div className="flex items-center gap-4">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-gray-600">{testimonial.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentTestimonial ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sẵn sàng tạo sự kiện đáng nhớ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng ngàn khách hàng đã tin tưởng Pladivo để tổ chức sự kiện của họ
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
              Bắt đầu miễn phí ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}
