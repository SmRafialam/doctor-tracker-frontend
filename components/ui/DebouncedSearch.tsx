"use client";

import { useEffect, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import SearchInput from "./SearchInput";

/**
 * Typing updates local state instantly (a responsive input); the URL and the
 * request only change once typing pauses.
 */
export default function DebouncedSearch({
  value,
  onSearch,
  label,
  placeholder,
}: {
  value: string;
  onSearch: (q: string) => void;
  label: string;
  placeholder: string;
}) {
  const [text, setText] = useState(value);
  const debounced = useDebouncedValue(text);
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  });

  // Sync when the URL changes from outside (e.g. "Clear filters", back button).
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setText(value);
  }

  useEffect(() => {
    if (debounced.trim() !== value) onSearchRef.current(debounced.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the debounced text
  }, [debounced]);

  return <SearchInput label={label} placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} />;
}
