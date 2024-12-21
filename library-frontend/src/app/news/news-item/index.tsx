import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Facebook, Twitter, Linkedin, Calendar } from "lucide-react";
import { News } from "@/app/home";
import { getNewsById } from "@/utils/news.crud";
import { api } from "@/api/api";
import useLink from "@/hooks/useLink";

export default function NewsDetailPage() {
  const params = useParams({ strict: false });
  const [news, setNews] = useState<News>();
  const [relatedNews, setRelateNews] = useState<News[]>();
  const { navigate } = useLink();

  useEffect(() => {
    const fetchNews = async () => {
      await getNewsById(params.id)
        .then((res) => {
          setNews(res);
        })
        .catch((err) => {
          console.error("Error fetching news:", err);
        });
    };
    const getNews = async () => {
      const page = 1;
      const limit = 4;
      await api
        .get(`/news/pagination?limit=${limit}&page=${page}`)
        .then((res) => {
          setRelateNews(res.data.news);
        })
        .catch((err) => {
          console.error("Error fetching news:", err);
        });
    };
    fetchNews();
    getNews();
  }, [params.id]);

  if (!news) {
    return <div>Loading...</div>;
  }
  if (!relatedNews) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{news.title}</h1>

        <div className="flex items-center space-x-4 mb-6">
          <div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div
          className="prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        <div className="flex space-x-4 mb-8">
          <Button variant="outline" size="sm">
            <Facebook className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Twitter className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Linkedin className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </article>

      <aside className="max-w-3xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-4">Related News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedNews.map((item) => (
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
      </aside>
    </div>
  );
}
