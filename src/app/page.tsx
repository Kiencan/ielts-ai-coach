import Link from "next/link";
import { BookOpen, Headphones, PenLine, Mic, Brain, TrendingUp, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white z-10">
        <span className="text-xl font-bold text-primary-700">IELTS AI Coach</span>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-primary-700 transition-colors">
            Đăng nhập
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-semibold bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors">
            Bắt đầu miễn phí
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          <Brain className="w-4 h-4" /> Được hỗ trợ bởi Anthropic Claude AI
        </div>
        <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
          Luyện thi IELTS thông minh<br />
          <span className="text-primary-700">cùng AI cá nhân hóa</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
          Phản hồi tức thì cho bài Writing & Speaking. Lộ trình học cá nhân hóa.
          Giao diện tiếng Việt thân thiện. Miễn phí để bắt đầu.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="px-8 py-3.5 bg-primary-700 text-white font-semibold rounded-lg hover:bg-primary-800 transition-colors text-base">
            Bắt đầu học ngay
          </Link>
          <Link href="/login" className="px-8 py-3.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-lg hover:border-primary-700 hover:text-primary-700 transition-colors text-base">
            Xem demo
          </Link>
        </div>
      </section>

      {/* Skills */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">Luyện tập đủ 4 kỹ năng IELTS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Headphones, label: "Listening", desc: "Nghe và trả lời câu hỏi chuẩn IELTS với transcript chi tiết", color: "text-blue-600 bg-blue-50" },
              { icon: BookOpen, label: "Reading", desc: "Bài đọc Academic & General với đồng hồ đếm ngược", color: "text-green-600 bg-green-50" },
              { icon: PenLine, label: "Writing", desc: "AI chấm bài theo 4 tiêu chí IELTS trong < 30 giây", color: "text-amber-600 bg-amber-50" },
              { icon: Mic, label: "Speaking", desc: "Ghi âm và nhận phân tích AI về phát âm, fluency", color: "text-purple-600 bg-purple-50" },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className="bg-white rounded-xl p-5 border border-slate-200">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{label}</h3>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">Tính năng nổi bật</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: "AI chấm bài Writing", desc: "Nhận phản hồi chi tiết theo 4 tiêu chí: Task Achievement, Coherence, Lexical Resource, Grammar." },
            { icon: TrendingUp, title: "Theo dõi tiến độ", desc: "Dashboard hiển thị band score ước tính, streak học tập và phân tích điểm yếu tự động." },
            { icon: Clock, title: "Spaced Repetition", desc: "Hệ thống từ vựng thông minh với thuật toán SM-2 nhắc ôn đúng lúc, không bao giờ quên từ." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-5">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary-700" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-700 py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-4">Bắt đầu luyện thi IELTS hôm nay</h2>
          <p className="text-primary-100 mb-8">Hoàn toàn miễn phí. Không cần thẻ tín dụng.</p>
          <Link href="/register" className="inline-block px-8 py-3.5 bg-white text-primary-700 font-bold rounded-lg hover:bg-primary-50 transition-colors">
            Tạo tài khoản miễn phí
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        © 2026 IELTS AI Coach. Được xây dựng với ❤️ tại Việt Nam.
      </footer>
    </div>
  );
}
