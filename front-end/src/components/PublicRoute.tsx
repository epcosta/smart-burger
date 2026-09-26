import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const cookie = document.cookie;
    if (cookie) {
      const cookies = cookie.split("; ");
      const userCookie = cookies.find((c) => c.startsWith("user="));

      if (userCookie) {
        navigate("/", { replace: true });
        return;
      }
    }
    setIsChecking(false);
  }, [navigate]);
  if (isChecking) {
    return <p>Carregando</p>;
  }

  return <div>{children}</div>;
};

export default PublicRoute;
