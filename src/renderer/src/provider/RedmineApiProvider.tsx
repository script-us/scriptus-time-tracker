import axios from "axios";
import { ReactNode, createContext, useContext } from "react";
import { RedmineApi } from "../api/redmine";
import useSettings from "../hooks/useSettings";
import { useLocation } from "react-router-dom";

const RedmineApiContext = createContext<RedmineApi | null>(null);

const { RENDERER_VITE_ADMIN_API_KEY } = import.meta.env;
const RedmineApiProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const { settings } = useSettings();
  const location = useLocation();

  return (
    <RedmineApiContext.Provider
      value={
        new RedmineApi(
          axios.create({
            baseURL: settings.redmineURL,
            headers: {
              "X-Redmine-API-Key": location.pathname === "/dashboard" ? RENDERER_VITE_ADMIN_API_KEY : settings.redmineApiKey,
            },
          })
        )
      }
    >
      {children}
    </RedmineApiContext.Provider>
  );
};

const useRedmineApi = (): RedmineApi => useContext(RedmineApiContext)!;

export { useRedmineApi };
export default RedmineApiProvider;
