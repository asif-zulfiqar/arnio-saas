import React from "react";

const UsersTab = () => {
  const users = [
    {
      name: "Lisa Taylor",
      email: "jese.leos92@gmail.com",
      status: "Active",
      role: "Admin",
      action: "Suspend",
      avatar: "/avatars/1.png",
    },
    {
      name: "Jese Leos",
      email: "bonnie_g23@gmail.com",
      status: "Active",
      role: "User",
      action: "Suspend",
      avatar: "/avatars/2.png",
    },
    {
      name: "Michael Chen",
      email: "l.livingston@gmail.com",
      status: "Active",
      role: "Manager",
      action: "Suspend",
      avatar: "/avatars/3.png",
    },
    {
      name: "Sophia Martinez",
      email: "micheal.g88@gmail.com",
      status: "Active",
      role: "User",
      action: "Suspend",
      avatar: "/avatars/4.png",
    },
    {
      name: "Carlos Rivera",
      email: "mcfall.joseph21@gmail.com",
      status: "Suspended",
      role: "Manager",
      action: "Reactivate",
      avatar: "/avatars/5.png",
    },
  ];

  return (
    <div className="bg-white rounded-b-xl border border-gray-200">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold text-gray-900">Users</h2>
        <button className="bg-[#1447E6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600">
          + Add User
        </button>
      </div>

      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-gray-700 text-xs uppercase border-b border-gray-200">
          <tr>
            <th className="px-6 py-3">User</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">User Role</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {users.map((user, i) => (
            <tr key={i}>
              <td className="px-6 py-4 flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-medium">{user.name}</span>
              </td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-6 py-4">{user.role}</td>
              <td className="px-6 py-4">
                <button className="text-sm text-blue-600 hover:underline">
                  {user.action}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4 text-sm text-gray-500 border-t border-gray-200">
        Showing 1–5 of 5
      </div>
    </div>
  );
};

export default UsersTab;
