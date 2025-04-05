import ChessBoard from "@/components/ChessBoard";
import React from "react";
import AddFriend from "./components/AddFriend";
import FriendList from "./components/FriendList";

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side: Form and Friend List */}
      <div className="w-full md:w-1/3 p-4 bg-gray-100">
        {/* Form */}
        <AddFriend />

        {/* Friend List */}
        <FriendList />
      </div>

      {/* Right Side: ChessBoard */}
      <div className="w-full md:w-2/3 p-4">
        {/* <ChessBoard /> */} {children}
      </div>
    </div>
  );
}
