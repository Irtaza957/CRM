import { RootState } from "../store";
import CustomToast from "./ui/CustomToast";

import { toast } from "sonner";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface RouteProtectorProps {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: RouteProtectorProps) => {
  const { user } = useSelector((state: RootState) => state.global);

  useEffect(() => {
    if (!user) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          title="Unauthorized!"
          message="Login to Access Resources!"
        />
      ));
    }
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default RouteGuard;
