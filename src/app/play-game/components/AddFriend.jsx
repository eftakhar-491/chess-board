"use client";
import { AuthContext } from "@/provider/AuthProvider";
import { getDatabase, ref, set, update } from "firebase/database";
import { redirect } from "next/navigation";

import React, { useContext } from "react";

export default function AddFriend() {
  const { postData, user, resetEmail, logoutUser } = useContext(AuthContext);

  const handelAddFriendClick = (e) => {
    e.preventDefault();
    const board = Array(8)
      .fill()
      .map(() => Array(8).fill(0));

    // Set up pawns
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: "pawn", color: "black" };
      board[6][i] = { type: "pawn", color: "white" };
    }

    // Set up other pieces
    const pieces = [
      ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"],

      ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"], // Corrected queen/king positions
    ];

    for (let i = 0; i < 8; i++) {
      board[0][i] = { type: pieces[0][i], color: "black" };
      board[7][i] = { type: pieces[1][i], color: "white" };
    }

    const x = resetEmail(`${e.target.email.value}_${user?.email}ADMIN`);
    console.log(board);
    const db = getDatabase();
    const dataREF = ref(db, `chess/${x}`);
    update(dataREF, {
      board: board,
      currentPlayer: "white",
    });
  };

  // logout
  const handleLeaveGame = async()=>{
      await logoutUser();
      redirect("/auth");
  }


  // 
  return (
    <div className="mb-4">
       <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold mb-2">Add Friend</h2>
          <button onClick={handleLeaveGame} className="bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 px-6 py-2 rounded-full cursor-pointer font-medium ">Leave Game</button>
       </div>
      <form onSubmit={handelAddFriendClick} className="space-y-2">
        <div>
          <label className="block text-sm font-medium">Email:</label>
          <input
            name="email"
            type="email"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          Add
        </button>
      </form>
    </div>
  );
}
