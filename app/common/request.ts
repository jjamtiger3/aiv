import { useState } from 'react';
import Swal from 'sweetalert2';

const base = 'http://localhost:4000';

const useApi = () => {
  const [loading, setLoading] = useState(false);

  const get = async (url: string, query?: Record<string, any>) => {
    try {
      setLoading(true); // 로딩 시작
      const queryString = new URLSearchParams(query).toString();
      const res = await fetch(`${base}${url}${queryString ? `?${queryString}` : ''}`).then(res => res.json());
      return res;
    } catch (error: any) {
      console.error('Error fetching data:', error);
      Swal.fire(error.toString());
      throw error;
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return { get, loading };
};

export default useApi;
