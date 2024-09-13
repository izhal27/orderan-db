"use client";

import { Avatar } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { HiPencil } from "react-icons/hi";

interface props {
  userImage: string | undefined;
  onSelectedImageHandler(imgFile: File): void;
}

const AvatarWithEditButton = ({ userImage, onSelectedImageHandler }: props) => {
  const isEditMode = !!userImage;
  const [img, setImg] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    userImage && setImg(userImage);
  }, [userImage]);

  const onClickHandler = () => {
    inputRef?.current?.click();
  };

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

  let avatarImg = <Avatar bordered rounded size={"xl"} alt="User Avatar" />;

  if (img) {
    avatarImg = (
      <Avatar
        bordered
        rounded
        size={"xl"}
        img={(props) => {
          // eslint-disable-next-line react/prop-types
          props.className = props.className + " object-cover";
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="User Avatar"
              width={40}
              height={40}
              src={
                isEditMode && userImage === img
                  ? `http://localhost:3002/images/${img}`
                  : img
              }
              {...props}
            />
          );
        }}
      />
    );
  }

  return (
    <div className="relative size-36">
      {avatarImg}
      <button
        type="button"
        onClick={onClickHandler}
        className="absolute right-2 top-0 rounded-full bg-blue-600 p-2 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <HiPencil size={16} />
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
