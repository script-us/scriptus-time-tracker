import axios from "axios";
import { ReactNode, createContext, useContext } from "react";
import { RedmineApi } from "../api/redmine";
import useSettings from "../hooks/useSettings";

const RedmineApiContext = createContext<RedmineApi | null>(null);

const RedmineApiProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const { settings } = useSettings();

  return (
    <RedmineApiContext.Provider
      value={
        new RedmineApi(
          axios.create({
            baseURL: settings.redmineURL,
            headers: {
              "X-Redmine-API-Key": settings.redmineApiKey,
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
