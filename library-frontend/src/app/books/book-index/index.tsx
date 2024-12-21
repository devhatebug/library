import { useEffect, useState } from "react";
import { Card, Rate, Input, Button, Space, List, Typography } from "antd";
import { getBookDetails } from "@/utils/book.crud";
import { Book } from "@/app/home";
import { useParams } from "@tanstack/react-router";
import { api } from "@/api/api";
import { AxiosError } from "axios";
import { IError } from "@/types/error";
import useMessage from "@/hooks/useMessage.ts";
import { useAuth } from "@/providers/auth-provider";
import { Trash } from "lucide-react";
import { borrowBook } from "@/utils/book.crud";
import { addWishList } from "@/utils/user.crud";
import { LocalStorageKey } from "@/types/localstorage";

const { Title, Paragraph } = Typography;

interface Review {
  review_id: number;
  user_id: number;
  book_id: number;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
}
const BookDetail = () => {
  const { id } = useParams({ strict: false });
  const { user } = useAuth();
  const { openNotification, contextHolder } = useMessage();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [book, setBook] = useState<Book>();
  const [reviews, setReviews] = useState<Review[]>();

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

  const getReviews = async (board_id: number) => {
    await api
      .get(`/review/get/${board_id}`)
      .then((res) => {
        setReviews(res.data.data);
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

  const getBook = async (book_id: number) => {
    await getBookDetails(book_id)
      .then((res) => {
        setBook(res.book);
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
    getBook(id);
    getReviews(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!book) {
    return <div>Loading...</div>;
  }
  const handleSubmit = async () => {
    if (rating === 0 || comment.trim() === "") {
      openNotification("topRight", "Please fill in all fields.");
      return;
    }
    if (!user) {
      openNotification("topRight", "Please login to leave a review.");
      return;
    }
    const newReview = {
      book_id: id,
      rating,
      comment,
      username: user.username,
    };
    await api
      .post("review/create", newReview)
      .then((res) => {
        openNotification("topRight", res.data.message);
        getReviews(id);
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
    setRating(0);
    setComment("");
  };

  const handleAddWishlist = async () => {
    if (!user) {
      openNotification("topRight", "Please login to add to wishlist.");
      return;
    }
    const wishlist = Array.isArray(user.wishlist) ? user.wishlist : [];
    if (!Array.isArray(user.wishlist)) {
      user.wishlist = JSON.parse(user.wishlist || "[]");
    }
    const isWishlist =
      user.wishlist &&
      user.wishlist.some((borrowBook) => {
        return borrowBook === parseInt(id);
      });
    if (isWishlist) {
      openNotification("topRight", "Already in favorites list.");
      return;
    }
    wishlist.push(parseInt(id));
    const dataUpdate = {
      wishlist: wishlist,
    };
    await addWishList(user.user_id, dataUpdate)
      .then((response) => {
        user.wishlist = wishlist;
        localStorage.setItem(
          LocalStorageKey.USER,
          JSON.stringify(response.user)
        );
        openNotification("topRight", "Add book to wishlist successfully.");
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

  const deleteReview = async (id: number) => {
    await api
      .delete(`/review/delete/${id}`)
      .then((res) => {
        openNotification("topRight", res.data.message);
        setReviews((prevReviews = []) =>
          prevReviews.filter((review) => review.review_id !== id)
        );
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
      <div className="flex flex-wrap justify-center items-start">
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <Card
            style={{ width: 400 }}
            actions={[
              <Button type="primary" onClick={handleAddWishlist}>
                Add to wishlist
              </Button>,
              <Button
                color="primary"
                variant="filled"
                onClick={() => handleBorrowBook(book.book_id)}
              >
                Borrow Book
              </Button>,
            ]}
          >
            <Title level={4}>{book.title}</Title>
            <Paragraph>
              <strong>Author:</strong> {book.author}
            </Paragraph>
            <Paragraph>
              <strong>Publisher:</strong> {book.publisher}
            </Paragraph>
            <Paragraph>
              <strong>Genres:</strong> {book.genre}
            </Paragraph>
            <Paragraph>
              <strong>Price:</strong> {book.price} $
            </Paragraph>
            <Paragraph>
              <strong>Status:</strong> {book.status}
            </Paragraph>
          </Card>
        </div>
        <Card className="min-w-[320px] mt-5" title="Review" hoverable>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Rate
              value={rating}
              onChange={(value) => setRating(value)}
              style={{ marginBottom: 10 }}
            />

            <Input.TextArea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment"
              rows={4}
            />

            <Button type="primary" onClick={handleSubmit}>
              Submit a review
            </Button>

            <div style={{ marginTop: 20 }}>
              <Title level={4}>Customer Reviews</Title>
              <List
                bordered
                dataSource={reviews}
                renderItem={(review) => (
                  <List.Item key={review.review_id}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <Typography.Text>
                            <strong className="mr-2">{review.username}</strong>
                          </Typography.Text>
                          <Rate disabled value={review.rating} />
                        </div>
                        <Button
                          type="link"
                          size={"small"}
                          icon={<Trash className="w-4" />}
                          onClick={() => deleteReview(review.review_id)}
                          disabled={
                            user && review.username === user.username
                              ? false
                              : true
                          }
                          danger
                        />
                      </div>
                      <Paragraph>{review.comment}</Paragraph>
                    </Space>
                  </List.Item>
                )}
              />
            </div>
          </Space>
        </Card>
      </div>
    </>
  );
};

export default BookDetail;
