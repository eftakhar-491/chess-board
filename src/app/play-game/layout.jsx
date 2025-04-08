import ChessBoard from "@/components/ChessBoard";
import React from "react";
import AddFriend from "./components/AddFriend";
import FriendList from "./components/FriendList";

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gradient-to-t from-gray-800 to-gray-500">
      {/* Left Side: Form and Friend List */}
      <div className="w-full md:w-1/3 p-4 bg-gray-100 min-h-screen">
        {/* Form */}
        <AddFriend />

        {/* Friend List */}
        <FriendList />
      </div>

      {/* Right Side: ChessBoard */}
      <div className="w-full md:w-2/3 p-4 min-h-screen">
        {/* <ChessBoard /> */} {children}
      </div>
    </div>
  );
}
