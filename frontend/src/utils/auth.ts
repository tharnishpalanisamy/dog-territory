
import api from "../lib/api";

export const logout = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (refreshToken) {
      await api.post("/auth/logout", {
        refresh_token: refreshToken,
      });
    }
  } catch (error) {
    console.error("Logout API failed:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    window.location.replace("/signin");
  }
};
