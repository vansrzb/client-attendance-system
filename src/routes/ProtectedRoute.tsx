import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}