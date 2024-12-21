import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, ChevronRight, Newspaper, Users } from "lucide-react";
import { api } from "@/api/api";
import { useAuth } from "@/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { borrowBook } from "@/utils/book.crud";
import useMessage from "@/hooks/useMessage";
import { AxiosError } from "axios";
import { IError } from "@/types/error";
import useLink from "@/hooks/useLink";

export interface Book {
  title: string;
  author: string;
  book_id?: number;
  genre: string;
  price: number;
  publisher: string;
  status: string;
  year: number;
}

export interface News {
  content: string;
  createdAt: Date;
  description: string;
  id: number;
  publishedAt: Date;
  title: string;
  updatedAt: Date;
}

export default function HomePage() {
  const { user, loading } = useAuth();
  const { navigate } = useLink();
  const { openNotification, contextHolder } = useMessage();
  const [disPrev, setDisPrev] = useState(false);
  const [disNext, setDisNext] = useState(false);
  const [dataBooks, setDataBooks] = useState<Book[]>();
  const [page, setPage] = useState(1);
  const currentPage = 1;
  const limit = 6;
  const [searchTerm, setSearchTerm] = useState("");
  const [newsItems, setNewsItems] = useState<News[]>();

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
  const getBooks = async () => {
    try {
      const res = await api.get(`/book/get?limit=${limit}&page=${currentPage}`);
      setDataBooks(res.data.books);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };
  const getNews = async () => {
    const page = 1;
    const limit = 3;
    await api
      .get(`/news/pagination?limit=${limit}&page=${page}`)
      .then((res) => {
        setNewsItems(res.data.news);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
      });
  };
  useEffect(() => {
    getBooks();
    getNews();
  }, []);
  const prevGetBooks = async () => {
    let pageNumber = page;
    if (pageNumber > 1) {
      pageNumber -= 1;
      setPage(pageNumber);
    }
    try {
      const res = await api.get(`/book/get?limit=${limit}&page=${pageNumber}`);
      setDataBooks(res.data.books);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };
  const nextGetBooks = async () => {
    let pageNumber = page;
    pageNumber += 1;
    setPage(pageNumber);
    try {
      const res = await api.get(`/book/get?limit=${limit}&page=${pageNumber}`);
      setDataBooks(res.data.books);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };
  useEffect(() => {
    if (page === 1) {
      setDisPrev(true);
    } else {
      setDisPrev(false);
    }
    if (!dataBooks) {
      return;
    }
    if (dataBooks.length < limit || dataBooks.length === 0) {
      setDisNext(true);
    } else {
      setDisNext(false);
    }
  }, [page, dataBooks]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!Array.isArray(dataBooks)) {
    return <div>Loading...</div>;
  }
  const filteredBooks = dataBooks.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      {contextHolder}
      <div className="min-h-screen w-full bg-background">
        <header className="bg-neutral-800 text-white text-primary-foreground">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">LIBRARY</h1>
            <nav>
              <ul className="flex items-center space-x-4 text-white">
                <li>
                  <Link href="/recommended" className="hover:underline">
                    Recommended
                  </Link>
                </li>
                <li>
                  <Link href="/genre" className="hover:underline">
                    Genre
                  </Link>
                </li>
                <li>
                  <Link href="/news/all" className="hover:underline">
                    News & Articles
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline">
                    Contact
                  </Link>
                </li>
                {!user && (
                  <>
                    <li>
                      <Link href="/auth/login" className="hover:underline">
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/signup" className="hover:underline">
                        Signup
                      </Link>
                    </li>
                  </>
                )}
                {user && (
                  <>
                    <li>
                      <Link
                        href={`/profile`}
                        className="hover:underline flex items-center"
                      >
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </header>

        <main>
          <section className="bg-gradient-to-r from-teal-400 to-blue-500 text-white py-20">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-4">Welcome to Library</h2>
              <p className="text-xl mb-8">
                Explore, borrow and read thousands of books from our online
                library.
              </p>
              <Button size="lg">
                Explore Now <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </section>

          <section className="mt-8 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center">
                List Books
              </h2>
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
              <div className="flex flex-wrap justify-center w-full">
                {filteredBooks &&
                  filteredBooks.map((book) => (
                    <Card
                      className="w-[320px] h-[300px] mx-4 my-4"
                      key={book.book_id}
                    >
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
                          onClick={() =>
                            book.book_id && handleBorrowBook(book.book_id)
                          }
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
              <div className="mt-8 flex justify-center space-x-2">
                <Button
                  size="sm"
                  onClick={prevGetBooks}
                  disabled={disPrev}
                  variant="outline"
                >
                  Previous Page
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    navigate({
                      to: "/books/all",
                    });
                  }}
                  className="bg-blue-600 hover:bg-white hover:text-black"
                >
                  View all
                </Button>
                <Button
                  size="sm"
                  onClick={nextGetBooks}
                  disabled={disNext}
                  variant="outline"
                >
                  Next Page
                </Button>
              </div>
            </div>
          </section>

          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-8">Why choose Library?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                  <BookOpen className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Book variety</h3>
                  <p>Thousands of books from many different genres.</p>
                </div>
                <div className="flex flex-col items-center">
                  <Newspaper className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Constantly updated
                  </h3>
                  <p>New books and news updated daily.</p>
                </div>
                <div className="flex flex-col items-center">
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Reading Community
                  </h3>
                  <p>Connect with other book lovers.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-neutral-200 py-16">
            <div className="container mx-auto px-4 flex flex-col items-center">
              <h2 className="text-3xl font-bold mb-8 text-center">
                News & Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!newsItems && <div>Loading...</div>}
                {newsItems &&
                  newsItems.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>
                          {new Date(item.publishedAt).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{item.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => {
                            navigate({
                              to: `/news/${item.id}`,
                            });
                          }}
                          variant="outline"
                        >
                          Read more
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
              <Button
                onClick={() => {
                  navigate({ to: "/news/all" });
                }}
                className="bg-blue-600 hover:bg-white hover:text-black mt-8"
              >
                View All
              </Button>
            </div>
          </section>

          <section className="py-16 bg-background">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-8">How to use Library</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-200 text-black font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Register</h3>
                  <p>Create a free account on Library</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-200 text-black font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Find books</h3>
                  <p>
                    Browse the library and select the books you want to read
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-200 text-black font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Borrow books</h3>
                  <p>Borrow books online or schedule a pick-up</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-neutral-200 text-black font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    4
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Read and return books
                  </h3>
                  <p>Enjoy reading and return on time</p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-gray-800 text-white text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p>Library - Vietnam's leading online book lending platform.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className=" flex items-center ml-[-8px] ">
                  <li className="mx-2">
                    <Link href="/about" className="hover:underline">
                      About
                    </Link>
                  </li>
                  <li className="mx-2">
                    <Link href="/faq" className="hover:underline">
                      Faq
                    </Link>
                  </li>
                  <li className="mx-2">
                    <Link href="/terms" className="hover:underline">
                      Terms
                    </Link>
                  </li>
                  <li className="mx-2">
                    <Link href="/privacy" className="hover:underline">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <p>Email: info@library.vn</p>
                <p>Phone: (84) 123-456-789</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p>&copy; 2024 Linrary. Copyright.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
