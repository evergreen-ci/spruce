import { MutableRefObject, useEffect, useRef } from "react";
import { useDimensions } from "hooks/useDimensions";
import { useQueryParam } from "hooks/useQueryParam";
import { MainlineCommitQueryParams } from "types/commits";

export const useCommitLimit = <T extends HTMLElement>(): [
  MutableRefObject<T>,
  number
] => {
  const [, setSkipOrderNumber] = useQueryParam(
    MainlineCommitQueryParams.SkipOrderNumber,
    0
  );
  const commitsContainerRef = useRef<T>();
  const { width } = useDimensions(commitsContainerRef);
  const nextLimit = Math.max(Math.round(width / COL_WIDTH), MIN_LIMIT);

  useEffect(() => {
    setSkipOrderNumber(undefined);
  }, [nextLimit]); // eslint-disable-line react-hooks/exhaustive-deps

  return [commitsContainerRef, nextLimit];
};

const MIN_LIMIT = 5;
const COL_WIDTH = 200;
