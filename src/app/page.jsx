// app/page.js
"use client";

import ChessBoard from "@/components/ChessBoard";
import { AuthContext } from "@/provider/AuthProvider";
import Link from "next/link";
import { redirect } from "next/navigation";
import { use, useContext } from "react";

export default function Home() {
  const { user, logoutUser } = useContext(AuthContext);
  console.log(user);
  if (!user) {
    redirect("/auth");
  } else {
    return (
      <>
        <div className="flex items-center justify-center w-screen h-screen">
          <ul className="flex gap-6 text-xl font-bold text-white">
            <Link href="/">
              <li className="hover:underline cursor-pointer">Home</li>
            </Link>{" "}
            <Link href="/play-game">
              <li className="hover:underline cursor-pointer">Play Game</li>{" "}
            </Link>{" "}
            <li
              onClick={() => {
                logoutUser();
              }}
              className="hover:underline cursor-pointer"
            >
              Signout
            </li>
          </ul>
        </div>
      </>
    );
  }
}
