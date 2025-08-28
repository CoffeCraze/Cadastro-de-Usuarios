import { useEffect } from "react";
import { useRouter } from "next/router";
import { verifyToken } from "../lib/auth";

export default function withAuth(WrappedComponent) {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        verifyToken(token);
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };
}
