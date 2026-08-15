import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/api";

export type ClubResource = {
  id: number;
  title: string;
  description: string;
  resource_type: string;
  url: string;
  group_name: string;
  order_no: number;
};

export function useCurriculumResources() {
  return useQuery({
    queryKey: ["curriculumResources"],
    queryFn: async (): Promise<ClubResource[]> => {
      const res = await fetch(getApiUrl("/api/resources"));
      if (!res.ok) throw new Error("Failed to fetch resources");
      return res.json();
    },
  });
}

export function useCurriculumProgress(token: string | null) {
  return useQuery({
    queryKey: ["curriculumProgress", token],
    queryFn: async (): Promise<number[]> => {
      if (!token) return [];
      const res = await fetch(getApiUrl("/api/resources/progress"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch progress");
      return res.json();
    },
    enabled: !!token,
  });
}

export function useToggleProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      resourceId,
      token,
    }: {
      resourceId: number;
      token: string;
    }) => {
      const res = await fetch(getApiUrl(`/api/resources/${resourceId}/toggle`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to toggle progress");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["curriculumProgress", variables.token],
      });
    },
  });
}
