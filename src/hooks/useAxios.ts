"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "@/models/response";
import { useCsrfToken } from "@/context/csrf.context";
import { authApiUrl } from "@/api";
import { useRouter } from "next/navigation";

type UseAxiosResult<T> = {
  data: T | null;
  error?: AxiosError | null;
  loading?: boolean;
  header?: Record<string, string>;
  refetch?: () => void;
  fetchData?: (id?: string) => Promise<void>;
};

// This hook is used for GET requests that will be called immediately
export const useAxios = <T = unknown>(
  config: AxiosRequestConfig,
  dependencies: unknown[] = [],
  skip?: boolean,
): UseAxiosResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [header, setHeader] = useState<Record<string, string>>({});
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<number>(0);

  const stableConfig = useMemo(() => config, [JSON.stringify(config)]);

  const refetch = useCallback(() => {
    setTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (skip) return;

    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      try {
        const response: AxiosResponse<ApiResponse<T>> = await axios({
          ...config,
          signal: controller.signal,
        });
        setData(response.data.metadata || null);
        setHeader(Object.fromEntries(
          Object.entries(response.headers).map(([key, value]) => [key, String(value)])
        ));
        setError(null);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err as AxiosError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, trigger, stableConfig, skip]);

  return { data, error, loading, refetch, header };
}

export const useAxiosMutation = <T = unknown, D = unknown>(
  config: AxiosRequestConfig
) => {
  const csrfToken = useCsrfToken();
  const router = useRouter();

  const sendRequest = async (payload?: D, id?: string): Promise<{
    data?: T | null;
    error?: AxiosError | null;
    headers?: Record<string, string>;
  }> => {
    const makeRequest = async () => {
      return await axios({
        ...config,
        url: id ? `${config.url}/${id}` : config.url,
        ...(payload && { data: payload }),
        headers: {
          ...config.headers,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
    };

    try {
      let response = await makeRequest();

      if (response.status === 401) {
        // Try refresh token
        try {
          const refreshResponse = await axios({
            method: 'POST',
            url: authApiUrl.refreshToken,
            withCredentials: true,
            headers: { 'X-CSRF-Token': csrfToken },
          });

          if (refreshResponse.status === 200) {
            response = await makeRequest();
          } else {
            router.push('/login');
            return { data: null, error: new Error('Unauthorized') as AxiosError, headers: {} };
          }
        } catch (refreshError) {
          router.push('/login');
          return { data: null, error: refreshError as AxiosError, headers: {} };
        }
      }

      const headers = Object.fromEntries(
        Object.entries(response.headers).map(([key, value]) => [key, String(value)])
      );

      return {
        data: response.data.metadata || null,
        error: null,
        headers,
      };
    } catch (err) {
      return { data: null, error: err as AxiosError, headers: {} };
    }
  };

  return { sendRequest };
};
