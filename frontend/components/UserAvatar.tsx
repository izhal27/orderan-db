'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Avatar } from "flowbite-react";

interface props {
  imageUrl: string;
  width?: number;
  height?: number;
  size?: string;
  bordered?: boolean
}

export default function UserAvatar({ imageUrl, width = 40, height = 40, size, bordered }: props) {
  const [srcImage, setSrcImage] = useState('');

  useEffect(() => {
    if (imageUrl !== 'undefined') {
      setSrcImage(imageUrl);
    }
  }, [imageUrl]);

  if (!srcImage) {
    return <Avatar alt='User Avatar' />
  }

  return <Avatar
    bordered={bordered}
    rounded
    size={size}
    img={(props) => {
      props.className = props.className + ' object-cover';
      return (<Image
        alt="User Avatar"
        width={width}
        height={height}
        src={imageUrl}
        {...props}
      />);
    }}
  />
}