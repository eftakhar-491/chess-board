// app/page.js
"use client";

import ChessBoard from "@/components/ChessBoard";
import { AuthContext } from "@/provider/AuthProvider";
import { redirect } from "next/navigation";
import { useContext } from "react";

export default function Home() {
  const { user } = useContext(AuthContext);

  if (!user) {
    redirect("/auth");
  } else {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Chess Game</h1>
        <input
          value=""
          // onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Your name"
        />
        <button>Create Game</button>
        <input
          value=""
          // onChange={(e) => setGameId(e.target.value)}
          placeholder="Enter Game ID"
        />
        <button className="cursor-pointer">Join Game</button>

        <ChessBoard />
      </div>
    );
  }
}
