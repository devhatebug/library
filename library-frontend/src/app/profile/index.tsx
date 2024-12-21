import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/providers/auth-provider";
import { updateUserInfo } from "@/utils/user.crud";
import { AxiosError } from "axios";
import { IError } from "@/types/error";
import useMessage from "@/hooks/useMessage";
import { HomeIcon, ChevronLeft, Trash2 } from "lucide-react";
import useLink from "@/hooks/useLink";
import { LocalStorageKey } from "@/types/localstorage";
import { getBorrowedBooks, getWishList, addWishList } from "@/utils/user.crud";
import { returnBook } from "@/utils/book.crud";
import { Book } from "../home";

interface BorrowBook {
  book_id: number;
  title: string;
  author: string;
  publisher: string;
  year: number;
  genre: string;
  price: number;
  status: string;
  borrow_date: Date;
  return_date: Date;
}
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { navigate } = useLink();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>();
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowBook[]>();
  const { openNotification, contextHolder } = useMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const dataUpdate = {
      username: username ? (username as string) : (user.username as string),
      email: email ? (email as string) : (user.email as string),
    };
    await updateUserInfo(user.user_id, dataUpdate)
      .then((res) => {
        localStorage.setItem(LocalStorageKey.USER, JSON.stringify(res.user));
        openNotification("topRight", "Update successfully");
        setIsEditing(false);
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

  const getBorrowed = async () => {
    if (!user) return;
    await getBorrowedBooks()
      .then((res) => {
        setBorrowedBooks(res.data);
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
  const handleTabChange = (value: string) => {
    if (value === "books") {
      getBorrowed();
    }
    if (value === "favorites") {
      handleGetWishList();
    }
  };

  const handleReturnBook = async (book_id: number) => {
    if (!user) {
      openNotification("topRight", "Please login to return book");
      return;
    }
    await returnBook(book_id)
      .then((res) => {
        openNotification("topRight", res.message);
        getBorrowed();
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

  const handleGetWishList = async () => {
    if (!user) {
      openNotification("topRight", "Please login to get wishlist");
      return;
    }
    await getWishList(user.user_id)
      .then((res) => {
        setFavoriteBooks(res.widshList);
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

  const handleDeleteBookInWishList = async (book_id: number) => {
    if (!user) {
      openNotification("topRight", "Please login to remove!");
      return;
    }
    if (!Array.isArray(user.wishlist)) {
      user.wishlist = JSON.parse(user.wishlist || "[]");
    }

    const newWishList = (user.wishlist || []).filter(
      (book) => book !== book_id
    );

    await addWishList(user.user_id, { wishlist: newWishList })
      .then((res) => {
        user.wishlist = newWishList;
        localStorage.setItem(LocalStorageKey.USER, JSON.stringify(user));
        setFavoriteBooks((prevBooks) =>
          prevBooks?.filter((book) => book.book_id !== book_id)
        );
        openNotification("topRight", res.message);
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

  const handleLogout = async () => {
    await logout();
    navigate({
      to: "/",
    });
  };

  if (!user) {
    return <div>loading...</div>;
  }

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
        <h1 className="text-3xl font-bold mb-8 text-center">
          Personal information
        </h1>
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={""} alt={user.username} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user.username}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <CardDescription>
                    Account type: {user.account_type}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="info" onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="info"
                    className="bg-blue-500 text-white hover:bg-blue-700 mx-2"
                  >
                    Information
                  </TabsTrigger>
                  <TabsTrigger
                    value="books"
                    className="bg-blue-500 text-white hover:bg-blue-700 mx-2"
                  >
                    Borrowed books
                  </TabsTrigger>
                  <TabsTrigger
                    value="favorites"
                    className="bg-blue-500 text-white hover:bg-blue-700 mx-2"
                  >
                    Wishlist Books
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="info">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Tên</Label>
                        <Input
                          id="username"
                          name="username"
                          value={username || user.username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={email || user.email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <Button
                        className="bg-blue-500 text-white hover:bg-blue-700"
                        type="submit"
                      >
                        Save change
                      </Button>
                      <Button
                        className="bg-red-500 text-white hover:bg-red-700 ml-2"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        className="bg-blue-500 text-white hover:bg-blue-700 mt-4"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Infomation
                      </Button>
                      <Button
                        className="bg-red-500 text-white hover:bg-red-700 mt-4 ml-3"
                        onClick={handleLogout}
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="books">
                  <div className="space-y-4">
                    {borrowedBooks &&
                      borrowedBooks.map((book) => (
                        <Card key={book.book_id}>
                          <CardHeader>
                            <CardTitle>{book.title}</CardTitle>
                            <CardDescription>
                              <p>Author: {book.author}</p>
                              <p>Publisher: {book.publisher}</p>
                              <p>Genre: {book.genre}</p>
                              <p>Year of publication: {book.year}</p>
                            </CardDescription>
                          </CardHeader>
                          <CardFooter>
                            <p className="text-sm text-muted-foreground"></p>
                            {book.return_date ? (
                              <p>
                                Return date:{" "}
                                {new Date(
                                  book.return_date
                                ).toLocaleDateString()}
                              </p>
                            ) : (
                              <Button
                                className="bg-blue-500 text-white hover:bg-blue-700"
                                onClick={() => handleReturnBook(book.book_id)}
                              >
                                Return Book
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="favorites">
                  <div className="space-y-4">
                    {favoriteBooks &&
                      favoriteBooks.map((book) => (
                        <Card key={book.book_id}>
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <div>
                                <CardTitle>{book.title}</CardTitle>
                                <CardDescription>
                                  <p>Author: {book.author}</p>
                                  <p>Publisher: {book.publisher}</p>
                                  <p>Genre: {book.genre}</p>
                                  <p>Year of publication: {book.year}</p>
                                </CardDescription>
                              </div>
                              <Button
                                onClick={() =>
                                  handleDeleteBookInWishList(book.book_id)
                                }
                                variant="outline"
                                size="icon"
                              >
                                <Trash2 className="text-red-500" />
                              </Button>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
