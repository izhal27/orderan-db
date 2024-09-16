"use client";

import { Avatar } from "flowbite-react";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

interface props {
  userImage: string | undefined;
  width?: number;
  height?: number;
  size?: string;
  rounded?: boolean;
  bordered?: boolean;
  className?: string;
}

type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

type MyComponentPropsWithChildren = PropsWithChildren<props>;

export default function UserAvatar({
  userImage,
  width = 40,
  height = 40,
  size = "md",
  rounded = false,
  bordered = false,
  children,
  className,
}: MyComponentPropsWithChildren) {
  const [srcImage, setSrcImage] = useState<undefined | string>(undefined);

  useEffect(() => {
    setSrcImage(userImage);
  }, [userImage]);

  const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
    return `${process.env.NEXT_PUBLIC_IMAGE_PATH || "http://localhost:3002/images"}/${src}?w=${width}&q=${quality || 75}`;
  };

  let image = (
    <Avatar bordered={bordered} rounded size={size} alt="User Avatar" />
  );

  if (srcImage) {
    image = (
      <Avatar
        className={className}
        bordered={bordered}
        rounded={rounded}
        size={size}
        img={(props) => {
          props.className = props.className + " object-cover";
          return (
            <Image
              loader={imageLoader}
              alt="User Avatar"
              width={width}
              height={height}
              src={srcImage}
              {...props}
            />
          );
        }}
      >
        {children}
      </Avatar>
    );
  }

  return image;
}
