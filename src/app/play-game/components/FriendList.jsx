"use client";
import { AuthContext } from "@/provider/AuthProvider";
import Link from "next/link";

import React, { useContext, useEffect, useState } from "react";

export default function FriendList() {
  const { getData, user, resetEmail } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  console.log(friends);
  useEffect(() => {
    getData("chess").then((data) => {
      if (data && user) {
        data.map((item) => {
          const pureString = resetEmail(user?.email);
          console.log("pureString", pureString);
          const p1 = item?.id.split("_")[1];
          const p2 = item?.id.split("_")[0];
          console.log("p1", p1);
          console.log("p2", p2);
          if (pureString === p1) {
            setFriends((p) => [...p, p2]);
          } else if (pureString === p2) {
            setFriends((p) => [...p, p1]);
          }
        });
      }
    });
  }, []);
  console.log(friends);
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Friends List</h2>
      <ul className="space-y-2">
        {/* Add more friends as needed */}
        {friends?.map((friend, index) => (
          <Link href={`/play-game/${friend}`} key={index}>
            <li className="cursor-pointer p-2 bg-white border border-gray-300 rounded">
              {friend}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
