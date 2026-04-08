import { useCallback, useEffect, useRef, useState } from 'react';

const useFetch = (fetcher, initialData = []) => {
  const initialDataRef = useRef(initialData);
  const [data, setData] = useState(initialDataRef.current);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = useCallback(async (options = {}) => {
    const { showLoader = true } = options;

    if (showLoader) {
      setLoading(true);
    }
    setError('');

    try {
      const response = await fetcher();
      const nextData = Array.isArray(response?.data)
        ? response.data
        : response?.data?.data || initialDataRef.current;
      setData(nextData);
      return nextData;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data.');
      return null;
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, [fetcher]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      refetch();
    }, 0);

    return () => {
      clearTimeout(timerId);
    };
  }, [refetch]);

  return {
    data,
    setData,
    loading,
    error,
    refetch,
  };
};

export default useFetch;
