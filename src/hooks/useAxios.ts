import { useState, useEffect, useCallback, useMemo } from "react";
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { ApiResponse } from "@/models/response";

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

// This hook is used for POST, PUT, DELETE requests
type UseAxiosMutationResult<T, D = unknown> = {
    data: T | null;
    error?: AxiosError | null;
    loading?: boolean;
    header?: Record<string, string>;
    sendRequest: (data?: D, id?: string) => Promise<void>;
};

export const useAxiosMutation = <T = unknown, D = unknown>(
    config: AxiosRequestConfig
): UseAxiosMutationResult<T, D> => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<AxiosError | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [header, setHeader] = useState<Record<string, string>>({});

    const sendRequest = async (payload?: D, id?: string) => {
        setLoading(true);
        try {
            const response: AxiosResponse<ApiResponse<T>> = await axios({
                ...config,
                url: id ? `${config.url}/${id}` : config.url,
                data: payload,
            });
            setData(response.data.metadata || null);
            setHeader(Object.fromEntries(
                Object.entries(response.headers).map(([key, value]) => [key, String(value)])
            ));
            setError(null);
        } catch (err) {
            setError(err as AxiosError);
        } finally {
            setLoading(false);
        }
    };

    return { data, error, loading, sendRequest, header };
}
