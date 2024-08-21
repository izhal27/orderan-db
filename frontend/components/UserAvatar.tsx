'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Avatar } from "flowbite-react";

interface props {
  userImage: string | undefined;
  width?: number;
  height?: number;
  size?: string;
  bordered?: boolean
}

export default function UserAvatar({ userImage, width = 40, height = 40, size, bordered }: props) {
  const [srcImage, setSrcImage] = useState<undefined | string>(undefined);

  useEffect(() => {
    setSrcImage(userImage);
  }, [userImage]);

  let image = <Avatar
    bordered={bordered}
    rounded
    size={size}
    alt='User Avatar'
  />;

  if (srcImage) {
    image = <Avatar
      bordered={bordered}
      rounded
      size={size}
      img={(props) => {
        props.className = props.className + ' object-cover';
        return (<Image
          alt="User Avatar"
          width={width}
          height={height}
          src={`http://localhost:3002/images/${userImage}`}
          {...props}
        />);
      }}
    />
  }

  return image;
}