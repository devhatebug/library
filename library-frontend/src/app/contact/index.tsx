import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HomeIcon, ChevronLeft } from "lucide-react";
import useLink from "@/hooks/useLink";

export default function HelpContactPage() {
  const { navigate } = useLink();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Instructions and Contact
        </h1>

        <Tabs defaultValue="guide" className="max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              className={`mx-2  bg-blue-500 text-white`}
              value="guide"
            >
              Instructions
            </TabsTrigger>
            <TabsTrigger className={`mx-2  bg-blue-500 text-white`} value="faq">
              Frequently Asked Questions
            </TabsTrigger>
            <TabsTrigger
              className={`mx-2  bg-blue-500 text-white`}
              value="contact"
            >
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guide">
            <Card>
              <CardHeader>
                <CardTitle>Website User Guide</CardTitle>
                <CardDescription>
                  Get familiar with the main features of Library.vn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-semibold">
                  1. Sign up for an account
                </h3>
                <p>
                  To start using the service, you need to register a new
                  account. Click on the "Register" button in the top right
                  corner of the homepage and fill in the required information.
                </p>

                <h3 className="text-lg font-semibold">2. Search for books</h3>
                <p>
                  Use the search bar at the top of the page to find books by
                  title, author, or genre. You can also browse book categories
                  to discover new books.
                </p>

                <h3 className="text-lg font-semibold">3. Borrow books</h3>
                <p>
                  When you find the book you want to read, click the "Borrow
                  Book" button. Select the borrowing period and confirm your
                  borrowing request.
                </p>

                <h3 className="text-lg font-semibold">4. Account Management</h3>
                <p>
                  On your personal page, you can track borrowed books, extend
                  your loan period, and update your personal information.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions(FAQ)</CardTitle>
                <CardDescription>
                  Answering common reader questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="bg-transparent">
                      How to borrow books?
                    </AccordionTrigger>
                    <AccordionContent>
                      To borrow a book, you need to log in to your account, find
                      the book you want to read, and click the "Borrow Book"
                      button. Then, select the borrowing period and confirm your
                      request.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2">
                    <AccordionTrigger className="bg-transparent">
                      How long can I borrow the book?
                    </AccordionTrigger>
                    <AccordionContent>
                      The normal loan period is 14 days. You can extend it for 7
                      days if no one else has reserved the book.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3">
                    <AccordionTrigger className="bg-transparent">
                      How to return books?
                    </AccordionTrigger>
                    <AccordionContent>
                      You can return books to any of our library branches. If
                      you are far away, you can use the service of sending books
                      by post.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4">
                    <AccordionTrigger className="bg-transparent">
                      How many books can I borrow at one time?
                    </AccordionTrigger>
                    <AccordionContent>
                      Each account can borrow up to 5 books at a time. If you
                      need to borrow more, please contact us for support.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5">
                    <AccordionTrigger className="bg-transparent">
                      Is there a penalty if I return a book late?
                    </AccordionTrigger>
                    <AccordionContent>
                      Yes, we do charge a late fee. The fee is 5,000
                      VND/day/book. However, we always encourage readers to
                      return books on time to avoid the late fee and give other
                      readers a chance to read the book.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact us</CardTitle>
                <CardDescription>
                  Submit a question or request support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Title</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Enter the title of your message"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Content</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Enter your message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button
                    className="bg-blue-500 text-white hover:bg-transparent hover:text-black hover:border-[0.5px] hover:border-slate-800"
                    type="submit"
                  >
                    Send message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
