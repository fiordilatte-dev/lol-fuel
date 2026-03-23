"use client";

import useSWR from "swr";
import { FuelPriceData } from "@/types";
import { REFRESH_INTERVAL_MS } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useFuelPrices() {
  const { data, error, isLoading, mutate } = useSWR<FuelPriceData>(
    "/api/prices",
    fetcher,
    {
      refreshInterval: REFRESH_INTERVAL_MS,
      revalidateOnFocus: true,
    }
  );

  return {
    prices: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
