import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRedmineApi } from "../provider/RedmineApiProvider";

const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 15;
const STALE_DATA_TIME = 1000 * 60;

const useTimeEntries = (from: Date, to: Date, user_id: number[] | string, project_id: number[]) => {
  const redmineApi = useRedmineApi();

  const entriesQuery = useInfiniteQuery({
    queryKey: ["timeEntries", from, to, user_id, project_id],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => redmineApi.getAllTimeEntries(from, to, pageParam * 100, 100, user_id, project_id),
    getNextPageParam: (lastPage, allPages) => (lastPage?.length === 100 ? allPages?.length : undefined),
    staleTime: STALE_DATA_TIME,
    // refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
  });

  // auto fetch all pages
  useEffect(() => {
    if (entriesQuery?.hasNextPage && !entriesQuery?.isFetchingNextPage) entriesQuery.fetchNextPage();
  }, [entriesQuery]);

  const entries = entriesQuery?.data?.pages?.flat() ?? [];

  return {
    data: entries,
    isLoading: entriesQuery.isLoading,
    isError: entriesQuery.isError,
    refetch: entriesQuery.refetch,
  };
};

export default useTimeEntries;
