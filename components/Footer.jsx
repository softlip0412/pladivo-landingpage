import React from "react";

const Footer = () => {
  return (
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
  );
};

export default Footer;
