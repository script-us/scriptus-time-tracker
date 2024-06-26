import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import useSettings from "./useSettings";

const useCurrentUser = () => {
  const { settings } = useSettings();
  const redmineApi = useRedmineApi();

  const currentUserQuery = useQuery({
    queryKey: ["currentUser", settings.redmineURL, settings.redmineApiKey],
    queryFn: () => redmineApi.getCurrentUser(),
  });

  return {
    data: currentUserQuery.data,
    isLoading: currentUserQuery.isLoading,
    isError: currentUserQuery.isError,
  };
};

export default useCurrentUser;
