"use client";

import { Select } from "flowbite-react";
import { twMerge } from "tailwind-merge";

type OptionType<T> = {
  label: string;
  value: T;
};

interface props<T> {
  options: OptionType<T>[];
  onChange: (value: T) => void;
  value: T;
  placeholder?: string;
  className?: string;
}

export default function SelectInput<T>({
  options,
  onChange,
  value,
  placeholder,
  className,
}: props<T>) {
  return (
    <div className={twMerge("max-w-md", className)}>
      <Select
        id="select"
        value={value as unknown as string}
        onChange={(e) => {
          const selectedOption = options.find(
            (opt) => String(opt.value) === e.target.value,
          );
          if (selectedOption) onChange(selectedOption.value);
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option, index) => (
          <option key={index} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
