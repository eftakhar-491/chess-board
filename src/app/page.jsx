// app/page.js
"use client";

import { AuthContext } from "@/provider/AuthProvider";
import Link from "next/link";
import { redirect } from "next/navigation";
import { use, useContext } from "react";

export default function Home() {
  const { user, logoutUser, loading} = useContext(AuthContext);

  // handle loaidng state
  if(loading){
    return <p className="text-red-500 flex justify-center min-h-screen items-center text-3xl font-600 capitalize">Crazy chess...</p>
  }
//  handle if user not available
  if (!user) {
    redirect("/auth");
  } 
  // 
  else {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-screen min-h-dvh homeBg-image">
          {/* wellcome message */}
             <div className="bg-gradient-to-t from-gray-800/70 to-gray-500/40 px-6 py-2 rounded-lg mb-4 space-y-2.5 text-center">
               <h2 className="text-3xl text-gray-200 font-bold">Welcome to Crazy Chess</h2>
                <h2 className="text-[#00ef00] text-lg font-medium">Player -- {user?.email.split("@gmail.com")}</h2>
             </div> 
          {/* button */}
          <ul className="flex gap-6 text-xl font-bold text-white">
            {/* <Link href="/">
              <li className="hover:underline cursor-pointer ">Home</li>
            </Link>{" "} */}
            <Link href="/play-game">
              <li className="shadow-2xl hover:underline cursor-pointer bg-gradient-to-br from-teal-400 via-indigo-500 to-purple-600 px-6 py-2 border-2 rounded-3xl capitalize ">Start a match</li>{" "}
            </Link>{" "}
            <li
              onClick={() => {
                logoutUser();
              }}
              className="hover:underline cursor-pointer bg-gradient-to-br from-yellow-400 via-red-500 to-pink-500 px-6 py-2 border-2 rounded-3xl capitalize "
            >
              Signout
            </li>
          </ul>
        </div>
      </>
    );
  }
}
