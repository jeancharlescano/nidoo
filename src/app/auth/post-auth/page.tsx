import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const PostAuth = async () => {
  const session = await auth();
  if (!session?.user?.email) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  if (!user?.firstName || !user?.lastName) {
    redirect("/auth/onboarding");
  }
	redirect("/")
};

export default PostAuth;
