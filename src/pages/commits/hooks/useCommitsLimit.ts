import { MutableRefObject, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDimensions } from "hooks/useDimensions";
import { MainlineCommitQueryParams } from "types/commits";

export const useCommitsLimit = <T extends HTMLElement>(): [
  MutableRefObject<T>,
  number
] => {
  const [params, setParams] = useSearchParams();
  const commitsContainerRef = useRef<T>();
  const { width } = useDimensions(commitsContainerRef);
  const nextLimit = Math.max(Math.round(width / COL_WIDTH), MIN_LIMIT);

  useEffect(() => {
    const nextParams = { ...params };
    delete nextParams[MainlineCommitQueryParams.SkipOrderNumber];
    setParams(nextParams);
  }, [nextLimit]); // eslint-disable-line react-hooks/exhaustive-deps

  return [commitsContainerRef, nextLimit];
};

const MIN_LIMIT = 5;
const COL_WIDTH = 200;
