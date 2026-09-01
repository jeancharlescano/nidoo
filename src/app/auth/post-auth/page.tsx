import { auth } from "@/auth";
import { findUserByEmail } from "@/lib/queries/userQueries";
import { redirect } from "next/navigation";

const PostAuth = async () => {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/login");

  const user = await findUserByEmail(session.user.email);

  if (!user?.firstName || !user?.lastName) {
    redirect("/onboarding");
  }
  redirect("/dashboard");
};

export default PostAuth;
