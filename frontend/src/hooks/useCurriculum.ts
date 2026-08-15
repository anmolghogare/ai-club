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
  const activeToken = token || localStorage.getItem("access_token");
  return useQuery({
    queryKey: ["curriculumProgress", activeToken],
    queryFn: async (): Promise<number[]> => {
      const authToken = activeToken || localStorage.getItem("access_token");
      if (!authToken) return [];
      const res = await fetch(getApiUrl("/api/resources/progress"), {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch progress");
      return res.json();
    },
    enabled: !!(activeToken || localStorage.getItem("access_token")),
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
      token?: string;
    }) => {
      const authToken = token || localStorage.getItem("access_token");
      const res = await fetch(getApiUrl(`/api/resources/${resourceId}/toggle`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to toggle progress");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["curriculumProgress"],
      });
    },
  });
}

export function useResetProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (token?: string) => {
      const authToken = token || localStorage.getItem("access_token");
      const res = await fetch(getApiUrl("/api/resources/reset"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to reset progress");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["curriculumProgress"],
      });
    },
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<ClubResource, "id">) => {
      const token = localStorage.getItem("access_token");
      const res = await fetch(getApiUrl("/api/admin/resources"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create resource");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculumResources"] });
    },
  });
}

export function useUpdateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: ClubResource) => {
      const token = localStorage.getItem("access_token");
      const res = await fetch(getApiUrl(`/api/admin/resources/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update resource");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculumResources"] });
    },
  });
}

export function useDeleteResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("access_token");
      const res = await fetch(getApiUrl(`/api/admin/resources/${id}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete resource");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculumResources"] });
    },
  });
}

