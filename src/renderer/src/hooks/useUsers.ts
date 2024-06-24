import { useQuery } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";

const useUsers = () => {
  const redmineApi = useRedmineApi();

  const allusersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => redmineApi.getAllUsers(),
    retryOnMount: false,
  });

  return {
    data: allusersQuery.data,
    isLoading: allusersQuery.isLoading,
    isError: allusersQuery.isError,
  };
};

export default useUsers;
