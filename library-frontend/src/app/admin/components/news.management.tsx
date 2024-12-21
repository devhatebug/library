import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pagination } from "antd";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { News } from "@/app/home";
import {
  NewArticle,
  getAllNews,
  getNews,
  createNews,
  deleteNews,
  updateNews,
} from "@/utils/news.crud";
import { AxiosError } from "axios";
import { IError } from "@/types/error";
import useMessage from "@/hooks/useMessage";
import { PaginationProps } from "antd";

export function NewsManagement() {
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const { openNotification, contextHolder } = useMessage();
  const [totalNews, setTotalNews] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);
  const [newsArticles, setNewsArticles] = useState<News[]>();
  const [idSelected, setIdSelected] = useState<number>();
  const [newArticle, setNewArticle] = useState<NewArticle>({
    title: "",
    content: "",
    publishedAt: new Date(),
    description: "",
  });
  const [editingArticle, setEditingArticle] = useState<News>();
  const [searchTerm, setSearchTerm] = useState("");

  const handleGetAllNews = async () => {
    setLoading(true);
    await getAllNews()
      .then((res) => {
        setTotalNews(res.news.lenght);
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getNewsPagination = async (page: number, limit: number) => {
    setLoading(true);
    await getNews(limit, page)
      .then((res) => {
        const dataNews = res.news;
        setNewsArticles(dataNews);
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetNewsPagination: PaginationProps["onChange"] = async (page) => {
    setCurrentPage(page);
    await getNewsPagination(page, limit);
  };

  useEffect(() => {
    handleGetAllNews();
    getNewsPagination(currentPage, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!Array.isArray(newsArticles)) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [newsArticles]);

  const handleAddArticle = async () => {
    await createNews(newArticle)
      .then((res) => {
        openNotification("topRight", res.message);
        setNewArticle({
          title: "",
          content: "",
          publishedAt: new Date(),
          description: "",
        });
        handleGetAllNews();
        handleGetNewsPagination(currentPage, limit);
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdateArticle = async () => {
    if (!idSelected || !editingArticle) return;
    await updateNews(idSelected, editingArticle)
      .then((res) => {
        openNotification("topRight", res.message);
        handleGetNewsPagination(currentPage, limit);
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      await deleteNews(id);
      openNotification("topRight", "Article deleted successfully");
      handleGetAllNews();
      getNewsPagination(currentPage, limit);
      setEditingArticle(undefined);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        const dataError = error.response.data as IError;
        if (dataError && dataError.message) {
          openNotification("topRight", dataError.message);
          console.log(dataError.message);
        }
      } else {
        openNotification("topRight", "An unexpected error occurred.");
      }
    }
  };

  const filteredArticles =
    newsArticles &&
    newsArticles.filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      {contextHolder}
      <div className="space-y-8">
        <div className="grid gap-4">
          <h3 className="text-lg font-semibold">
            {editingArticle ? "Edit Article" : "Add New Article"}
          </h3>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editingArticle ? editingArticle.title : newArticle.title}
              onChange={(e) =>
                editingArticle
                  ? setEditingArticle({
                      ...editingArticle,
                      title: e.target.value,
                    })
                  : setNewArticle({ ...newArticle, title: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={
                editingArticle ? editingArticle.content : newArticle.content
              }
              onChange={(e) =>
                editingArticle
                  ? setEditingArticle({
                      ...editingArticle,
                      content: e.target.value,
                    })
                  : setNewArticle({ ...newArticle, content: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Description</Label>
            <Textarea
              id="content"
              value={
                editingArticle
                  ? editingArticle.description
                  : newArticle.description
              }
              onChange={(e) =>
                editingArticle
                  ? setEditingArticle({
                      ...editingArticle,
                      description: e.target.value,
                    })
                  : setNewArticle({
                      ...newArticle,
                      description: e.target.value,
                    })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Published</Label>
            <Input
              id="date"
              type="date"
              value={
                editingArticle
                  ? new Date(editingArticle.publishedAt)
                      .toISOString()
                      .split("T")[0]
                  : new Date(newArticle.publishedAt).toISOString().split("T")[0]
              }
              onChange={(e) =>
                editingArticle
                  ? setEditingArticle({
                      ...editingArticle,
                      publishedAt: new Date(e.target.value),
                    })
                  : setNewArticle({
                      ...newArticle,
                      publishedAt: new Date(e.target.value),
                    })
              }
            />
          </div>
          <Button
            onClick={editingArticle ? handleUpdateArticle : handleAddArticle}
          >
            {editingArticle ? "Update Article" : "Add Article"}
          </Button>
          {editingArticle && (
            <Button
              variant="outline"
              onClick={() => setEditingArticle(undefined)}
            >
              Cancel Edit
            </Button>
          )}
        </div>

        {!loading ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">Article List</h3>
            <div className="mb-4">
              <Input
                placeholder="Search news & article by title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Updated at</TableHead>
                  <TableHead>Published at</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles &&
                  filteredArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>{article.title}</TableCell>
                      <TableCell>
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          className="mr-2"
                          onClick={() => {
                            setIdSelected(article.id);
                            setEditingArticle(article);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteArticle(article.id)}
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
              onChange={handleGetNewsPagination}
              pageSize={limit}
              defaultCurrent={1}
              total={totalNews}
            />
          </div>
        ) : (
          <div>Loading ...</div>
        )}
      </div>
    </>
  );
}
