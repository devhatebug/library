import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "antd";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IUser } from "@/types/user";
import { Credentials } from "@/api/auth-api";
import {
  getAllUsers,
  getUserPagination,
  createUser,
  updateUser,
  deleteUser,
} from "@/utils/user.crud";
import { AxiosError } from "axios";
import { IError } from "@/types/error.ts";
import useMessage from "@/hooks/useMessage";
import { PaginationProps } from "antd";
import useLink from "@/hooks/useLink";
import { useAuth } from "@/providers/auth-provider";

export function UserManagement() {
  const { navigate } = useLink();
  const { user, logout } = useAuth();
  if (!user) {
    navigate({
      to: "/auth/login",
    });
  }
  const limit = 10;
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { openNotification, contextHolder } = useMessage();
  const [users, setUsers] = useState<IUser[]>();
  const [idSelected, setIdSelected] = useState<number>();
  const [newUser, setNewUser] = useState<Credentials>({
    username: "",
    email: "",
    password: "",
    account_type: "Normal",
  });
  const [editingUser, setEditingUser] = useState<IUser>();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<
    IUser["account_type"] | "all" | ""
  >("all");

  const handleGetAllUsers = async () => {
    setLoading(true);
    await getAllUsers()
      .then((res) => {
        setTotalUsers(res.users.length);
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

  const getUsersPagination = async (page: number, limit: number) => {
    setLoading(true);
    await getUserPagination(page, limit)
      .then((res) => {
        setUsers(res.users);
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

  const handleGetUsersPagination: PaginationProps["onChange"] = async (
    page
  ) => {
    setFilterRole("all");
    setCurrentPage(page);
    await getUsersPagination(page, limit);
  };

  useEffect(() => {
    handleGetAllUsers();
    getUsersPagination(currentPage, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!Array.isArray(users)) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [users]);

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.username || !newUser.password) {
      openNotification("topRight", "Email, Username and Password is required!");
      return;
    }
    await createUser(newUser)
      .then((res) => {
        openNotification("topRight", res.message);
        setNewUser({
          username: "",
          email: "",
          password: "",
          account_type: "Normal",
        });
        handleGetAllUsers();
        getUsersPagination(currentPage, limit);
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

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    if (!editingUser.email || !editingUser.username) {
      openNotification("topRight", "Email, username is not empty!");
      return;
    }
    const dataUpdate = {
      account_type: editingUser.account_type || "Normal",
      email: editingUser.email,
      username: editingUser.username,
    };
    if (!idSelected) return;
    await updateUser(idSelected, dataUpdate)
      .then((res) => {
        openNotification("topRight", res.message);
        setNewUser({
          username: "",
          email: "",
          password: "",
          account_type: "Normal",
        });
        getUsersPagination(currentPage, limit);
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

  const handleDeleteUser = async (id: number) => {
    if (!user) return;
    await deleteUser(id)
      .then((res) => {
        openNotification("topRight", res.message);
        handleGetAllUsers();
        getUsersPagination(currentPage, limit);
        setEditingUser(undefined);
        if (user.user_id === id) {
          logout();
          navigate({
            to: "/auth/login",
          });
        }
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

  const filteredUsers =
    users &&
    users.filter(
      (user) =>
        ((user.username &&
          user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (filterRole === "all" || user.account_type === filterRole)
    );

  return (
    <>
      {contextHolder}
      <div className="space-y-8">
        <div className="grid gap-4 mb-8">
          <h3 className="text-lg font-semibold">
            {editingUser ? "Edit User" : "Add New User"}
          </h3>
          <div className="grid gap-2">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              value={editingUser ? editingUser.username : newUser.username}
              onChange={(e) =>
                editingUser
                  ? setEditingUser({ ...editingUser, username: e.target.value })
                  : setNewUser({ ...newUser, username: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={editingUser ? editingUser.email : newUser.email}
              onChange={(e) =>
                editingUser
                  ? setEditingUser({ ...editingUser, email: e.target.value })
                  : setNewUser({ ...newUser, email: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">password</Label>
            <Input
              id="password"
              value={newUser.password}
              disabled={editingUser !== undefined}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={
                editingUser ? editingUser.account_type : newUser.account_type
              }
              onValueChange={(value: IUser["account_type"]) =>
                editingUser
                  ? setEditingUser({ ...editingUser, account_type: value })
                  : setNewUser({ ...newUser, account_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="VIP">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={editingUser ? handleUpdateUser : handleAddUser}>
            {editingUser ? "Update User" : "Add User"}
          </Button>
          {editingUser && (
            <Button
              variant="outline"
              onClick={() => {
                setNewUser({
                  username: "",
                  email: "",
                  password: "",
                  account_type: "Normal",
                });
                setEditingUser(undefined);
              }}
            >
              Cancel Edit
            </Button>
          )}
        </div>

        {!loading ? (
          <div>
            <h3 className="text-lg font-semibold mb-4">User List</h3>
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Search by username or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select
                value={filterRole}
                onValueChange={(value: IUser["account_type"] | "all" | "") =>
                  setFilterRole(value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Account type</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers &&
                  filteredUsers.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.account_type}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          className="mr-2"
                          onClick={() => {
                            setNewUser({
                              username: "",
                              email: "",
                              password: "",
                              account_type: "Normal",
                            });
                            setIdSelected(user.user_id);
                            setEditingUser(user);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.user_id)}
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
              onChange={handleGetUsersPagination}
              pageSize={limit}
              defaultCurrent={1}
              total={totalUsers}
            />
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}
