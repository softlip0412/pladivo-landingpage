'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users, Target, Award, Heart } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnimatedHero from '@/components/AnimatedHero'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header activePage="about" />

      <main>
        {/* Hero Section */}
        {/* Hero Section */}
        {/* Hero Section */}
        <AnimatedHero 
          variant="teal"
          title="Về Pladivo"
          description={
             <>
               Chúng tôi không chỉ là một nền tảng đặt chỗ. <br/>
               Chúng tôi là <span className="font-semibold text-gray-900">cầu nối</span> đưa mọi người đến gần nhau hơn thông qua những trải nghiệm vô giá.
             </>
          }
          subtitle="Kết nối & Chia sẻ"
        />

        {/* Mission & Vision */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Sứ mệnh của chúng tôi</h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Cách mạng hóa ngành tổ chức sự kiện bằng cách cung cấp một nền tảng liền mạch, kết nối 
                  nhà tổ chức, nhà cung cấp dịch vụ và người tham dự. Chúng tôi tin rằng mọi sự kiện đều nên 
                  đặc biệt và không căng thẳng.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Nền tảng của chúng tôi đơn giản hóa quá trình lập kế hoạch sự kiện phức tạp, giúp mọi người đều có thể tiếp cận, 
                  từ cá nhân tổ chức tiệc đến các nhà quản lý sự kiện doanh nghiệp.
                </p>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&h=400&fit=crop" 
                  alt="Sứ mệnh"
                  className="rounded-2xl shadow-2xl w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Giá trị cốt lõi</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Cộng đồng</h3>
                  <p className="text-gray-600">
                    Kết nối mọi người và tạo ra những mối quan hệ bền vững thông qua các trải nghiệm chung.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Xuất sắc</h3>
                  <p className="text-gray-600">
                    Cam kết mang đến dịch vụ chất lượng cao nhất và vượt qua kỳ vọng trong mọi trải nghiệm.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Đổi mới</h3>
                  <p className="text-gray-600">
                    Không ngừng cải tiến nền tảng với công nghệ tiên tiến và các giải pháp sáng tạo.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Đam mê</h3>
                  <p className="text-gray-600">
                    Chúng tôi yêu công việc mình làm và điều đó thể hiện trong mọi sự kiện mà chúng tôi góp phần tạo nên.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Đội ngũ của chúng tôi</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-xl transition-all">
                <CardContent className="pt-8 pb-6">
                  <img 
                    src="https://ui-avatars.com/api/?name=John+Smith&background=0ea5e9&color=fff&size=128" 
                    alt="John Smith"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">John Smith</h3>
                  <p className="text-blue-600 font-medium mb-3">CEO & Nhà sáng lập</p>
                  <p className="text-gray-600 text-sm">
                    Hơn 10 năm trong ngành tổ chức sự kiện với niềm đam mê công nghệ và đổi mới.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-xl transition-all">
                <CardContent className="pt-8 pb-6">
                  <img 
                    src="https://ui-avatars.com/api/?name=Sarah+Johnson&background=0ea5e9&color=fff&size=128" 
                    alt="Sarah Johnson"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
                  <p className="text-blue-600 font-medium mb-3">Trưởng phòng Vận hành</p>
                  <p className="text-gray-600 text-sm">
                    Chuyên gia tối ưu quy trình và đảm bảo trải nghiệm khách hàng xuất sắc.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-xl transition-all">
                <CardContent className="pt-8 pb-6">
                  <img 
                    src="https://ui-avatars.com/api/?name=Mike+Chen&background=0ea5e9&color=fff&size=128" 
                    alt="Mike Chen"
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mike Chen</h3>
                  <p className="text-blue-600 font-medium mb-3">Giám đốc Công nghệ (CTO)</p>
                  <p className="text-gray-600 text-sm">
                    Lãnh đạo công nghệ với chuyên môn về nền tảng quy mô lớn và thiết kế trải nghiệm người dùng.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-5xl font-bold mb-3">10,000+</h3>
                <p className="text-blue-100 text-lg">Sự kiện đã tổ chức</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold mb-3">50,000+</h3>
                <p className="text-blue-100 text-lg">Khách hàng hài lòng</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold mb-3">500+</h3>
                <p className="text-blue-100 text-lg">Nhà cung cấp dịch vụ</p>
              </div>
              <div>
                <h3 className="text-5xl font-bold mb-3">25+</h3>
                <p className="text-blue-100 text-lg">Thành phố hoạt động</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  )
}
