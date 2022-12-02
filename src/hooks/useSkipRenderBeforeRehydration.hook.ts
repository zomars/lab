import {
  useEffect,
  useState,
} from 'react';

/**
 * Skip first render on hydration to avoid DOM inconsistency issue.
 * @link https://www.joshwcomeau.com/react/the-perils-of-rehydration/#the-solution
 */
export function useSkipRenderBeforeRehydration(): boolean {
  const [skip, setSkipFlag] = useState(true);

  useEffect(() => {
    setSkipFlag(false);
  }, []);

  return skip;
}
