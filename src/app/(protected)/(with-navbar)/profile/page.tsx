"use client";

import { signOut } from "next-auth/react";

const ProfilePage = () => {
  return (
    <button onClick={() => signOut({ callbackUrl: "/auth/login" })}>
      ProfilePage
    </button>
  );
};

export default ProfilePage;
