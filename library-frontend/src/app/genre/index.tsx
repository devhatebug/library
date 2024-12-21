import { Button } from "@/components/ui/button";
import { getGenres } from "@/utils/book.crud";
import { useEffect, useState } from "react";
import useLink from "@/hooks/useLink";
import { ChevronLeft, HomeIcon } from "lucide-react";
export function GenrePage() {
  const { navigate } = useLink();
  const [bookCategories, setBookCategories] = useState([""]);
  const getAllGenres = async () => {
    await getGenres()
      .then((res) => {
        setBookCategories(res.genres);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    getAllGenres();
  }, []);
  return (
    <>
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
      <section className="py-16 bg-background mt-[-60px]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Genres Book</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {bookCategories.map((category) => (
              <Button
                key={category}
                variant="outline"
                onClick={() => {
                  navigate({
                    to: `/genre/${category}`,
                  });
                }}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
