import { useState, useEffect } from "react";
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
import { getNews } from "@/utils/news.crud";
import useLink from "@/hooks/useLink";
import { News } from "../home";

export default function NewsPage() {
  const { navigate } = useLink();
  const [searchTerm, setSearchTerm] = useState("");
  const [disPrev, setDisPrev] = useState(false);
  const [disNext, setDisNext] = useState(false);
  const [page, setPage] = useState(1);
  const [newsItems, setNewsItems] = useState<News[]>();
  const currentPage = 1;
  const limit = 6;

  const handleGetNews = async () => {
    try {
      const res = await getNews(limit, currentPage);
      setNewsItems(res.news);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };
  useEffect(() => {
    handleGetNews();
  }, []);
  const prevGetBooks = async () => {
    let pageNumber = page;
    if (pageNumber > 1) {
      pageNumber -= 1;
      setPage(pageNumber);
    }
    try {
      const res = await getNews(limit, pageNumber);
      setSearchTerm("");
      setNewsItems(res.news);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };
  const nextGetBooks = async () => {
    let pageNumber = page;
    pageNumber += 1;
    setPage(pageNumber);
    try {
      const res = await getNews(limit, pageNumber);
      setSearchTerm("");
      setNewsItems(res.news);
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
    if (!newsItems) {
      return;
    }
    if (newsItems.length < limit || newsItems.length === 0) {
      setDisNext(true);
    } else {
      setDisNext(false);
    }
  }, [page, newsItems]);
  if (!Array.isArray(newsItems)) {
    return <div>Loading...</div>;
  }
  const filteredNews = newsItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        List News & Articles
      </h1>

      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-xl">
          <Input
            type="text"
            placeholder="Search news"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                {new Date(item.publishedAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{item.description}</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  navigate({
                    to: `/news/${item.id}`,
                  });
                }}
                variant="outline"
                className="w-full"
              >
                Read more
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {filteredNews.length === 0 && !disNext && (
        <p className="text-center text-gray-500 mt-8">
          Không tìm thấy tin tức phù hợp với tìm kiếm của bạn.
        </p>
      )}
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
          onClick={nextGetBooks}
          disabled={disNext}
          variant="outline"
        >
          Next Page
        </Button>
      </div>
    </div>
  );
}
