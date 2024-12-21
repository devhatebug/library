import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookManagement } from "./components/book.management";
import { UserManagement } from "./components/user.management";
import { NewsManagement } from "./components/news.management";
import useLink from "@/hooks/useLink";
import { useAuth } from "@/providers/auth-provider";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("books");
  const { navigate } = useLink();
  const { user } = useAuth();
  if (!user) return <div>Loading .. </div>;
  if (user.account_type !== "Admin") {
    navigate({
      to: "/auth/login",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full h-auto grid-cols-3">
          <TabsTrigger className="text-wrap h-auto" value="books">
            Books
          </TabsTrigger>
          <TabsTrigger className="text-wrap h-auto" value="users">
            Users
          </TabsTrigger>
          <TabsTrigger className="text-wrap h-auto" value="news">
            News & Article
          </TabsTrigger>
        </TabsList>

        <TabsContent value="books">
          <Card>
            <CardHeader>
              <CardTitle>Books Management</CardTitle>
              <CardDescription>
                Add, delete, update books in the library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>
                Add, delete, update users in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle>News & Article Management</CardTitle>
              <CardDescription>
                Add, delete, update news articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NewsManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
