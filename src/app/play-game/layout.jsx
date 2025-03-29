import ChessBoard from "@/components/ChessBoard";
import React from "react";

export default function AppLayout() {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side: Form and Friend List */}
      <div className="w-full md:w-1/3 p-4 bg-gray-100">
        {/* Form */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-2">Add Friend</h2>
          <form className="space-y-2">
            <div>
              <label className="block text-sm font-medium">Email:</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Friend List */}
        <div>
          <h2 className="text-lg font-bold mb-2">Friends List</h2>
          <ul className="space-y-2">
            <li className="cursor-pointer p-2 bg-white border border-gray-300 rounded">
              Friend 1
            </li>
            <li className="cursor-pointer p-2 bg-white border border-gray-300 rounded">
              Friend 2
            </li>
            {/* Add more friends as needed */}
          </ul>
        </div>
      </div>

      {/* Right Side: ChessBoard */}
      <div className="w-full md:w-2/3 p-4">
        <ChessBoard />
      </div>
    </div>
  );
}
