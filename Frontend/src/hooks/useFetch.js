import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data-fetching hook with loading / error / refetch
 * @param {Function} fetchFn  – async function returning data
 * @param {Array}    deps     – dependency array (re-runs when changed)
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData]       = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result?.data ?? result);
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { execute(); }, [execute]);

  return { data, isLoading, error, refetch: execute };
}
