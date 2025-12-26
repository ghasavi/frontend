import { useEffect, useState } from "react";
import api from "../../utils/axios"; // centralized axios
import Loading from "../../components/loading";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // fetch all users
  const fetchUsers = async () => {
    try {
      // ✅ remove extra "/api"
      const res = await api.get("/users/all"); 
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // toggle block/unblock
  const toggleBlock = async (userId, currentStatus) => {
    const confirm = window.confirm(
      `Are you sure you want to ${currentStatus ? "unblock" : "block"} this user?`
    );
    if (!confirm) return;

    setUpdatingUserId(userId);

    try {
      // ✅ remove extra "/api"
      await api.put(`/users/block/${userId}`, { block: !currentStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isBlock: !currentStatus } : u
        )
      );
      toast.success(
        `User ${!currentStatus ? "blocked" : "unblocked"} successfully`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user status");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="w-full h-full p-4 overflow-y-auto font-[var(--font-main)]">
      <h1 className="text-2xl font-bold mb-4 text-[var(--color-accent)]">
        Users Management
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full text-center border shadow rounded">
          <thead className="bg-[var(--color-accent)] text-white">
            <tr>
              <th className="py-3 px-2">Image</th>
              <th className="py-3 px-2">Name</th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">Role</th>
              <th className="py-3 px-2">Status</th>
              <th className="py-3 px-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={`${
                  index % 2 === 0 ? "bg-[var(--color-primary)]" : "bg-gray-100"
                }`}
              >
                <td className="py-2 px-2">
                  <img
                    src={user.img || "/user.png"}
                    alt="user"
                    className="w-10 h-10 rounded-full mx-auto object-cover"
                  />
                </td>
                <td className="py-2 px-2">{user.firstName}</td>
                <td className="py-2 px-2">{user.email}</td>
                <td
                  className={`py-2 px-2 font-semibold ${
                    user.role === "admin" ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  {user.role.toUpperCase()}
                </td>
                <td
                  className={`py-2 px-2 font-semibold ${
                    user.isBlock ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {user.isBlock ? "BLOCKED" : "ACTIVE"}
                </td>
                <td className="py-2 px-2">
                  <button
                    disabled={updatingUserId === user._id}
                    onClick={() => toggleBlock(user._id, user.isBlock)}
                    className={`px-3 py-1 rounded font-semibold ${
                      user.isBlock
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {user.isBlock ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
