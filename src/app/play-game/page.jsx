"use client";
import { AuthContext } from "@/provider/AuthProvider";
import Image from "next/image";
import React, { useContext, useState } from "react";

export default function page() {
  const { user } = useContext(AuthContext);
  const [playerName, setPlayerName] = useState("");

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
          <h1 className="text-white text-center text-3xl font-semibold mb-4">Start a Game With Friend !</h1>
            <p className="text-gray-300 capitalize font-medium -mb-10">for Start click on the added gmail...</p>
           <Image src={"/image/chess-board-removebg-preview.png"} alt="image" width={"400"} height={400} className="w-96 h-96 mx-auto "/>
    </div>
   
    // <div style={{ textAlign: "center", padding: "20px" }}>
    //   <h1>Chess Game</h1>
    //   <input
    //     value=""
    //     onChange={(e) => setPlayerName(e.target.value)}
    //     placeholder="email"
    //   />

    //   <button onClick={"hangelCreateGame"} className="cursor-pointer">
    //     create game
    //   </button>

    //   {/* <ChessBoard /> */}
    // </div>
  );
}
