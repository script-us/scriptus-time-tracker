import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";

const useUsers = ({ enabled }) => {
  const redmineApi = useRedmineApi();

  const allusersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => redmineApi.getAllUsers(),
    retryOnMount: false,
    enabled: enabled,
  });

  return {
    data: allusersQuery.data,
    isLoading: allusersQuery.isLoading,
    isError: allusersQuery.isError,
  };
};

export default useUsers;
