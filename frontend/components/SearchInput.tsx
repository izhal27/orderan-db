import { TextInput } from 'flowbite-react';
import { useState } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';

interface props {
  onSeachHandler(value: string): void;
  onClearHandler(): void;
}

export function SearchInput({ onSeachHandler, onClearHandler }: props) {
  const [value, setValue] = useState('');
  const handleClear = () => {
    setValue('');
    onClearHandler();
  };

  const handleSearch = () => {
    if (value?.length < 3) {
      return;
    }
    onSeachHandler(value);
  };

  return (
    <div className="relative max-w-fit">
      {/* Left Search Icon */}
      <HiSearch className="absolute left-3 top-3 text-gray-500" />
      {/* Input Field */}
      <TextInput
        id="value"
        value={value}
        type="text" icon={HiSearch}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
        className='w-full'
      />
      {/* Clear Button */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-14 top-3 text-gray-500 focus:outline-none"
        ><HiX />
        </button>
      )}
      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={!value}
        className={
          `absolute right-0 top-0 h-full px-4 rounded-r-md focus:outline-none
           ${value ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
      >
        <HiSearch />
      </button>
    </div>
  );
};
