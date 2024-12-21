import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PaginationProps } from "antd";
import { Pagination } from "antd";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book } from "@/app/home";
import {
  getAllBooks,
  getBookPagination,
  createBook,
  updateBook,
  deleteBook,
} from "@/utils/book.crud";
import { AxiosError } from "axios";
import { IError } from "@/types/error";
import useMessage from "@/hooks/useMessage";

export function BookManagement() {
  const { openNotification, contextHolder } = useMessage();
  const [books, setBooks] = useState<Book[]>();
  const [newBook, setNewBook] = useState<Book>({
    title: "",
    author: "",
    genre: "",
    price: 99,
    year: 2024,
    publisher: "",
    status: "available",
  });
  const [totalBooks, setTotalBooks] = useState(0);
  const [editingBook, setEditingBook] = useState<Book>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [idSelected, setIdSelected] = useState<number>();

  const getBooks = async () => {
    await getAllBooks()
      .then((res) => {
        const dataBooks = res.books;
        setTotalBooks(dataBooks.length);
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

  const getBooksPagination = async (page: number, limit: number) => {
    await getBookPagination(page, limit)
      .then((res) => {
        const dataBooks = res.books;
        setBooks(dataBooks);
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

  const handleGetBooksPagination: PaginationProps["onChange"] = async (
    page
  ) => {
    setFilterGenre("all");
    setCurrentPage(page);
    await getBooksPagination(page, 10);
  };

  useEffect(() => {
    getBooks();
    getBooksPagination(1, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.status) {
      openNotification("topRight", "Title, author, and status are required.");
      return;
    }
    await createBook(newBook)
      .then((res) => {
        openNotification("topRight", res.message);
        setBooks([...(books || []), newBook]);
        setNewBook({
          title: "",
          author: "",
          genre: "",
          price: 99,
          year: 2024,
          publisher: "",
          status: "available",
        });
        getBooks();
        getBooksPagination(currentPage, 10);
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

  const handleUpdateBook = async () => {
    if (!editingBook) return;
    await updateBook(editingBook, idSelected || 0)
      .then((res) => {
        openNotification("topRight", res.message);
        setNewBook({
          title: "",
          author: "",
          genre: "",
          price: 99,
          year: 2024,
          publisher: "",
          status: "available",
        });
        getBooksPagination(currentPage, 10);
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

  const handleDeleteUser = async (id: number) => {
    await deleteBook(id)
      .then((res) => {
        openNotification("topRight", res.message);
        getBooks();
        getBooksPagination(currentPage, 10);
        setEditingBook(undefined);
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

  useEffect(() => {
    if (!Array.isArray(books)) {
      setLoading(true);
    }
    if (totalBooks === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [books, totalBooks]);

  const filteredBooks =
    books &&
    books.filter(
      (book) =>
        (book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.publisher.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.genre.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterGenre === "all" || book.genre === filterGenre)
    );

  const genres = Array.from(new Set(books && books.map((book) => book.genre)));

  return (
    <>
      {contextHolder}
      <div className="space-y-8">
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">
            {editingBook ? "Edit Book" : "Add New Book"}
          </h3>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editingBook ? editingBook.title : newBook.title}
              onChange={(e) =>
                editingBook
                  ? setEditingBook({ ...editingBook, title: e.target.value })
                  : setNewBook({ ...newBook, title: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              value={editingBook ? editingBook.author : newBook.author}
              onChange={(e) =>
                editingBook
                  ? setEditingBook({ ...editingBook, author: e.target.value })
                  : setNewBook({ ...newBook, author: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={editingBook ? editingBook.genre : newBook.genre}
              onChange={(e) =>
                editingBook
                  ? setEditingBook({ ...editingBook, genre: e.target.value })
                  : setNewBook({ ...newBook, genre: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={editingBook ? editingBook.status : newBook.status}
              onValueChange={(value) =>
                editingBook
                  ? setEditingBook({ ...editingBook, status: value })
                  : setNewBook({ ...newBook, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="not_available">Not Available</SelectItem>
                <SelectItem value="borrowed">Borrowed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="publisher">Puhlisher</Label>
            <Input
              id="publisher"
              value={editingBook ? editingBook.publisher : newBook.publisher}
              onChange={(e) =>
                editingBook
                  ? setEditingBook({
                      ...editingBook,
                      publisher: e.target.value,
                    })
                  : setNewBook({ ...newBook, publisher: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              value={editingBook ? editingBook.year : newBook.year}
              onChange={(e) =>
                editingBook
                  ? setEditingBook({
                      ...editingBook,
                      year: parseInt(e.target.value),
                    })
                  : setNewBook({ ...newBook, year: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={editingBook ? editingBook.price : newBook.price}
              onChange={(e) =>
                editingBook
                  ? setEditingBook({
                      ...editingBook,
                      price: parseInt(e.target.value),
                    })
                  : setNewBook({ ...newBook, price: parseInt(e.target.value) })
              }
            />
          </div>
          <Button onClick={editingBook ? handleUpdateBook : handleAddBook}>
            {editingBook ? "Update Book" : "Add Book"}
          </Button>
          {editingBook && (
            <Button variant="outline" onClick={() => setEditingBook(undefined)}>
              Cancel Edit
            </Button>
          )}
        </div>

        {!loading ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Book List</h3>
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Search by title, author, genre, status, publisher"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={filterGenre} onValueChange={setFilterGenre}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Publisher</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBooks &&
                  filteredBooks.map((book) => (
                    <TableRow key={book.book_id}>
                      <TableCell>{book.title}</TableCell>
                      <TableCell>{book.author}</TableCell>
                      <TableCell>{book.genre}</TableCell>
                      <TableCell>{book.status}</TableCell>
                      <TableCell>{book.publisher}</TableCell>
                      <TableCell>{book.year}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          className="mr-2"
                          onClick={() => {
                            setEditingBook(book);
                            setIdSelected(book.book_id);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            if (!book.book_id) return;
                            handleDeleteUser(book.book_id);
                          }}
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <Pagination
              className="mt-6"
              current={currentPage}
              onChange={handleGetBooksPagination}
              pageSize={10}
              defaultCurrent={1}
              total={totalBooks}
            />
          </div>
        ) : (
          <div>Loading ...</div>
        )}
      </div>
    </>
  );
}
