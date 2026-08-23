import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/api";

export interface WeeklyResource {
  id: number;
  week_id: number;
  title: string;
  description: string;
  resource_type: string;
  url: string;
  est_minutes: number;
  order_no: int;
}

export interface WeeklyVenezaWeek {
  id: number;
  week_number: number;
  title: string;
  description?: string;
  target_date?: string;
  is_current: boolean;
  status: string; // "past", "current", "upcoming"
  order_no: number;
  resources: WeeklyResource[];
}

export function useWeeklyVenezaData() {
  return useQuery<WeeklyVenezaWeek[]>({
    queryKey: ["weekly-veneza"],
    queryFn: async () => {
      const res = await fetch(getApiUrl("/api/weekly-veneza"));
      if (!res.ok) {
        throw new Error("Failed to fetch Weekly Veneza curriculum");
      }
      return res.json();
    },
  });
}

export function useWeeklyVenezaProgress(token: string | null) {
  return useQuery<number[]>({
    queryKey: ["weekly-veneza-progress", token],
    queryFn: async () => {
      if (!token) return [];
      const res = await fetch(getApiUrl("/api/weekly-veneza/progress"), {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!res.ok) {
        return [];
      }
      return res.json();
    },
    enabled: !!token,
  });
}

export function useToggleWeeklyProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resourceId, token }: { resourceId: number; token: string }) => {
      const res = await fetch(getApiUrl(`/api/weekly-veneza/${resourceId}/toggle`), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to toggle progress");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly-veneza-progress"] });
    },
  });
}

export function useResetWeeklyProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (token: string) => {
      const res = await fetch(getApiUrl("/api/weekly-veneza/reset"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to reset progress");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["weekly-veneza-progress"] });
    },
  });
}
