import { useCallback, useEffect, useState } from "react";
import { Spinner, TextInput } from "flowbite-react";
import debounce from 'lodash.debounce';
import React from "react";

interface props<T> {
  fetchUrl: string;
  getDisplayValue: (item: T) => string;
  getKeyValue: (item: T) => string | number;
  onSelect: (item: T | string) => void;
  minLength?: number;
  accessToken?: string;
  onEmptyQueryHandler?(): void;
}

export default function AutoCompleteTextInput<T>({
  fetchUrl,
  getDisplayValue,
  getKeyValue,
  onSelect,
  minLength = 3,
  accessToken,
  onEmptyQueryHandler,
}: props<T>) {
  const [query, setQuery] = useState<string>('');
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [showItems, setShowItems] = useState<boolean>(true);

  const fetchSuggestions = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${fetchUrl}?query=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length >= minLength) {
        fetchSuggestions(searchQuery);
      } else {
        setItems([]);
      }
    }, 500), // 500ms debounce delay
    [fetchUrl, minLength]
  );

  useEffect(() => {
    debouncedFetchSuggestions(query);
    if (!query.trim().length) {
      onEmptyQueryHandler && onEmptyQueryHandler();
    }
    if (!items.length || activeIndex === -1) {
      onSelect(query);
    }
    return () => {
      debouncedFetchSuggestions.cancel();
    };
  }, [query, debouncedFetchSuggestions]);

  const handleSuggestionClick = (item: T) => {
    setQuery(getDisplayValue(item));
    setShowItems(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex((prevIndex) => (prevIndex < items.length - 1 ? prevIndex + 1 : prevIndex));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < items.length) {
        handleSuggestionClick(items[activeIndex]);
      } else {
        onSelect(query);
        setShowItems(false);
      }
    }
  };

  return (
    <div className="relative">
      <TextInput
        id="generic-text-input"
        placeholder="Type to search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (query.length === 0) {
            setShowItems(true)
          }
        }}
        onBlur={() => setShowItems(false)}
        onFocus={() => setShowItems(true)}
        onKeyDown={handleKeyDown}
      />
      {loading && (
        <div className="absolute right-2 top-2">
          <Spinner size="sm" />
        </div>
      )}
      {showItems && items.length > 0 && (
        <ul className="absolute bg-white border rounded mt-2 w-full z-10">
          {items.map((item, index) => (
            <li
              key={getKeyValue(item)}
              className={`p-2 cursor-pointer ${index === activeIndex ? 'bg-blue-500 text-white' : 'bg-white text-black'
                }`}
              onClick={() => handleSuggestionClick(item)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {getDisplayValue(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}