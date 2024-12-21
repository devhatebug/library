import { useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getBookByGenre, borrowBook } from "@/utils/book.crud";
import { Book } from "@/app/home";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";
import useMessage from "@/hooks/useMessage";
import { IError } from "@/types/error";
import { AxiosError } from "axios";
import useLink from "@/hooks/useLink";

export function GenreItem() {
  const { user } = useAuth();
  const { openNotification, contextHolder } = useMessage();
  const { navigate } = useLink();
  const { genre } = useParams({ strict: false });
  const [dataBooks, setDataBooks] = useState<Book[]>();
  const getBooksByGenre = async () => {
    await getBookByGenre(genre)
      .then((res) => {
        setDataBooks(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    getBooksByGenre();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genre]);
  if (!Array.isArray(dataBooks)) {
    return <div>Loading...</div>;
  }
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
      <div className="container mx-auto px-4 pb-8 mt-[-30px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dataBooks &&
            dataBooks.map((book) => (
              <Card key={book.book_id}>
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
                    className="w-full mx-2"
                  >
                    View more
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
}
