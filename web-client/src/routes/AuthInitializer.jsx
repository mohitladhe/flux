import { useEffect } from "react";
import { verifyToken } from "../services/authService";
import { useAuthStore } from "../store/authStore";

export default function AuthInitializer({ children }) {
    const { user, isAuthenticated, isLoading, setUser, logout, finishLoading } = useAuthStore();

    useEffect(() => {
      const initialize = async () => {
        const token = localStorage.getItem("token");

        if(!token) {
            finishLoading();
            return;
        }

        try {
            const data = await verifyToken();
            setUser(data.user);
        } catch (error) {
            logout();
        } finally {
            finishLoading();
        }
      };

      initialize();
    }, [setUser, logout, finishLoading]);
    return children;
}
