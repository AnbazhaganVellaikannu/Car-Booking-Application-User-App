import { useEffect, useRef, useState } from 'react';

export function useAsync(fn, deps) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => alive.current && setState({ loading: false, data, error: null }))
      .catch((error) => alive.current && setState({ loading: false, data: null, error }));
    return () => {
      alive.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

export function todayISODate() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}
