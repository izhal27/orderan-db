'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Avatar } from 'flowbite-react';
import { twMerge } from "tailwind-merge";
import { HiPencil, HiX } from 'react-icons/hi';

interface props {
  userImage: string | undefined;
  onSelectedImageHandler(imgFile: File): void;
}

const AvatarWithEditButton = ({ userImage, onSelectedImageHandler }: props) => {
  const [img, setImg] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    userImage && setImg(userImage);
  }, [userImage]);

  const onClickHandler = () => {
    if (!img) {
      inputRef?.current?.click();
    } else {
      inputRef!.current!.value = '';
      setImg(undefined);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectedImageHandler(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  let avatarImg = <Avatar
    bordered
    rounded
    size={'xl'}
    alt='User Avatar'
  />;

  if (img) {
    avatarImg = <Avatar
      bordered
      rounded
      size={'xl'}
      img={(props) => {
        props.className = props.className + ' object-cover';
        return (<img
          alt="User Avatar"
          width={40}
          height={40}
          src={img}
          {...props}
        />);
      }}
    />
  }

  return (
    <div className="relative w-36 h-36">
      {avatarImg}
      <button
        type="button"
        onClick={onClickHandler}
        className={
          twMerge("absolute top-0 right-2 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none",
            img && 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500'
          )}
      >
        {img ? <HiX size={16} /> : <HiPencil size={16} />}
      </button>
      <input
        ref={inputRef}
        type="file"
        id="avatarInput"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default AvatarWithEditButton;
