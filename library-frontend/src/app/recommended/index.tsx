import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react";
import { getBookPagination } from "@/utils/book.crud";
import { Book } from "../home";
import { useAuth } from "@/providers/auth-provider";
import useMessage from "@/hooks/useMessage";
import { borrowBook } from "@/utils/book.crud";
import { AxiosError } from "axios";
import { IError } from "@/types/error";
import useLink from "@/hooks/useLink";
import { HomeIcon, ChevronLeft } from "lucide-react";

export default function RecommendedPage() {
  const { user } = useAuth();
  const { openNotification, contextHolder } = useMessage();
  const { navigate } = useLink();
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<Book[]>();

  const getBooks = async () => {
    const limit = 6;
    const page = Math.floor(Math.random() * 1) + 1;
    await getBookPagination(page, limit)
      .then((books) => {
        setBooks(books.books);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getBooks();
  }, []);
  if (!Array.isArray(books)) {
    return <div>Loading...</div>;
  }
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBorrowBook = async (book_id: number) => {
    if (!user) {
      openNotification("topRight", "Please login to borrow a book.");
      return;
    }
    await borrowBook(book_id)
      .then((result) => {
        openNotification("topRight", result.message);
      })
      .catch((error: AxiosError) => {
        if (error instanceof AxiosError && error.response) {
          const dataError = error.response.data as IError;
          if (dataError && dataError.message) {
            openNotification("topRight", dataError.message);
            console.log(dataError.message);
          }
        } else {
          openNotification("topRight", "An unexpected error occurred.");
        }
      });
  };

  return (
    <>
      {contextHolder}
      <div className="flex items-center mt-8 ml-3">
        <Button
          onClick={() => {
            navigate({ to: "/" });
          }}
          variant="outline"
        >
          <HomeIcon />
          Home
        </Button>
        <Button className="ml-4" onClick={() => window.history.back()}>
          <ChevronLeft />
          Back to List
        </Button>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">List Books</h1>

        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-xl">
            <Input
              type="text"
              placeholder="Search by book title, genre or author"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card className="w-[320px] h-[250px] mx-4 my-4" key={book.book_id}>
              <CardHeader>
                <CardTitle>{book.title}</CardTitle>
                <CardDescription>{book.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Publisher: {book.publisher}</p>
                <p>Genre: {book.genre}</p>
                <p>Year of publication: {book.year}</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleBorrowBook(book.book_id)}
                  variant="outline"
                  className="w-full mx-2"
                >
                  Borrow Book
                </Button>
                <Button
                  onClick={() => {
                    navigate({
                      to: `/books/${book.book_id}`,
                    });
                  }}
                  className="w-full mx-2 bg-blue-600 hover:bg-white hover:text-black"
                >
                  View more
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            Không tìm thấy sách phù hợp với tìm kiếm của bạn.
          </p>
        )}
      </div>
    </>
  );
}
