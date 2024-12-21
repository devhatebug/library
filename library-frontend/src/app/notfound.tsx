import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BookOpen, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mb-6">
          Trang không tìm thấy
        </p>
        <p className="text-gray-500 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <div className="flex flex-col space-y-4">
          <Link href="/">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" /> Quay về trang chủ
            </Button>
          </Link>
          <Link href="/books/all">
            <Button variant="outline" className="w-full">
              <BookOpen className="mr-2 h-4 w-4" /> Khám phá sách
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
