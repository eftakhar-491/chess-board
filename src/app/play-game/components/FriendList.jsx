"use client";
import { AuthContext } from "@/provider/AuthProvider";
import Link from "next/link";

import React, { useContext, useEffect, useState } from "react";

export default function FriendList() {
  const { getData, user, resetEmail } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    getData("chess").then((data) => {
      if (data && user) {
        const uniqueFriends = new Set();
        data.forEach((item) => {
          const pureString = resetEmail(user?.email);

          const p1 = item?.id.split("_")[1];
          const p2 = item?.id.split("_")[0];

          if (pureString + "ADMIN" === p1) {
            uniqueFriends.add(p2);
          } else if (pureString === p2) {
            uniqueFriends.add(p1);
          }
        });
        setFriends(Array.from(uniqueFriends));
      }
    });
  }, [user]);

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
