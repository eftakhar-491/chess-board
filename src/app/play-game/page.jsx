"use client";
import { AuthContext } from "@/provider/AuthProvider";
import React, { useContext, useState } from "react";

export default function page() {
  const { user } = useContext(AuthContext);
  const [playerName, setPlayerName] = useState("");

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Chess Game</h1>
      <input
        value=""
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="email"
      />

      <button onClick={"hangelCreateGame"} className="cursor-pointer">
        create game
      </button>

      {/* <ChessBoard /> */}
    </div>
  );
}
