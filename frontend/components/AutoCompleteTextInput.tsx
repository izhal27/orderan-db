import { showToast } from "@/helpers";
import { useApiClient } from "@/lib/useApiClient";
import { Spinner, TextInput } from "flowbite-react";
import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";

interface props<T> {
  fetchUrl: string;
  getDisplayValue: (item: T) => string;
  getKeyValue: (item: T) => string | number;
  onSelect: (item: T | string) => void;
  minLength?: number;
  onEmptyQueryHandler?(): void;
  value?: string; // New prop to control the input value
  onChange?: (value: string) => void; // New prop to handle input changes
}

export default function AutoCompleteTextInput<T>({
  fetchUrl,
  getDisplayValue,
  getKeyValue,
  onSelect,
  minLength = 3,
  onEmptyQueryHandler,
  value = "", // Default to empty string
  onChange,
}: props<T>) {
  const [internalQuery, setInternalQuery] = useState<string>(value);
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [showItems, setShowItems] = useState<boolean>(true);
  const { request } = useApiClient();

  const fetchSuggestions = useCallback(
    async (searchQuery: string) => {
      setLoading(true);
      try {
        const data = await request(`${fetchUrl}?query=${searchQuery}`);
        setItems(data);
      } catch (error) {
        showToast("error", "Error fetching suggestions");
      } finally {
        setLoading(false);
      }
    },
    [fetchUrl, request],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchSuggestions = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length >= minLength) {
        fetchSuggestions(searchQuery);
      } else {
        setItems([]);
      }
    }, 500), // 500ms debounce delay
    [fetchSuggestions, minLength],
  );

  useEffect(() => {
    if (!value) {
      debouncedFetchSuggestions(internalQuery);
      if (!internalQuery.trim().length) {
        onEmptyQueryHandler && onEmptyQueryHandler();
      }
      if (!items.length || activeIndex === -1) {
        onSelect(internalQuery);
      }
    }
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [
    internalQuery,
    debouncedFetchSuggestions,
    value,
    activeIndex,
    items.length,
    onEmptyQueryHandler,
    onSelect,
  ]);

  useEffect(() => {
    setInternalQuery(value);
  }, [value]);

  const handleSuggestionClick = (item: T) => {
    const selectedValue = getDisplayValue(item);
    setInternalQuery(selectedValue);
    onChange && onChange(selectedValue);
    setShowItems(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalQuery(newValue);
    onChange && onChange(newValue);
    if (newValue.length === 0) {
      setShowItems(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prevIndex) =>
        prevIndex < items.length - 1 ? prevIndex + 1 : prevIndex,
      );
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < items.length) {
        handleSuggestionClick(items[activeIndex]);
      } else {
        onSelect(internalQuery);
        setShowItems(false);
      }
    }
  };

  return (
    <div className="relative">
      <TextInput
        disabled={!!value}
        id="generic-text-input"
        placeholder="Type to search..."
        value={internalQuery}
        onChange={handleInputChange}
        onFocus={() => setShowItems(true)}
        onKeyDown={handleKeyDown}
      />
      {loading && (
        <div className="absolute right-2 top-2">
          <Spinner size="sm" />
        </div>
      )}
      {showItems && items.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full rounded border bg-white">
          {items.map((item, index) => (
            <li
              key={getKeyValue(item)}
              className={`cursor-pointer p-2 ${index === activeIndex
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
                }`}
              onClick={() => handleSuggestionClick(item)}
              onMouseEnter={() => setActiveIndex(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSuggestionClick(item);
                }
              }}
              role="option"
              aria-selected={index === activeIndex}
            >
              {getDisplayValue(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
