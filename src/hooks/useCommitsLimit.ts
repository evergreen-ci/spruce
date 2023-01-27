import { MutableRefObject, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { MainlineCommitQueryParams } from "types/commits";
import { useDimensions } from "./useDimensions";

export const useCommitsLimit = (): [MutableRefObject<HTMLElement>, number] => {
  const [params, setParams] = useSearchParams();
  const commitsContainerRef = useRef<HTMLElement>();
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
