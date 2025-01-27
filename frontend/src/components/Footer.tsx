// frontend/src/components/Footer.tsx
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">درباره ما</h3>
            <p className="text-sm leading-relaxed">
              فروشگاه ما با هدف ارائه بهترین محصولات با مناسب‌ترین قیمت‌ها به مشتریان عزیز راه‌اندازی شده است.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="hover:text-white transition">محصولات</a>
              </li>
              <li>
                <a href="/about" className="hover:text-white transition">درباره ما</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition">تماس با ما</a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition">سوالات متداول</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">اطلاعات تماس</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <FiMapPin className="text-blue-500" />
                <span>تهران، خیابان ولیعصر</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="text-blue-500" />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="text-blue-500" />
                <span>info@example.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">خبرنامه</h3>
            <p className="text-sm mb-4">
              برای اطلاع از آخرین تخفیف‌ها در خبرنامه ما عضو شوید
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                عضویت
              </button>
            </form>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              © {new Date().getFullYear()} تمامی حقوق محفوظ است.
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition">
                <FiInstagram className="text-xl" />
              </a>
              <a href="#" className="hover:text-white transition">
                <FiTwitter className="text-xl" />
              </a>
              <a href="#" className="hover:text-white transition">
                <FiLinkedin className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}