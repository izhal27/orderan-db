"use client";

import { Avatar } from "flowbite-react";
import Image from "next/image";
import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

interface props {
  userImage: string | undefined;
  name?: string | null | undefined;
  width?: number;
  height?: number;
  size?: string;
  rounded?: boolean;
  bordered?: boolean;
  className?: string;
  debugLabel?: string;
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
  name,
  debugLabel,
}: MyComponentPropsWithChildren) {
  const [srcImage, setSrcImage] = useState<undefined | string>(undefined);
  const [cacheBuster, setCacheBuster] = useState<number | null>(null);
  const hasLoggedRef = useRef(false);

  useEffect(() => {
    setSrcImage(userImage);
    if (userImage) {
      setCacheBuster(Date.now());
    }
  }, [userImage]);

  const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
    const base = `${process.env.NEXT_PUBLIC_IMAGE_PATH || "http://localhost:3002/images"}/${src}`;
    const qs = `w=${width}&q=${quality || 75}${cacheBuster ? `&v=${cacheBuster}` : ""}`;
    return `${base}?${qs}`;
  };

  let image = (
    <Avatar bordered={bordered} rounded size={size} alt="User Avatar">
      {children}
    </Avatar>
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
  } else if (!children) {
    const safeName = (name || "").trim();
    const initials = safeName
      ? safeName
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase())
          .join("")
      : "?";
    image = (
      <Avatar bordered={bordered} rounded size={size} alt="User Avatar">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-300">
          {initials}
        </span>
      </Avatar>
    );
  }

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!debugLabel) return;
    if (!srcImage && !hasLoggedRef.current) {
      hasLoggedRef.current = true;
      // eslint-disable-next-line no-console
      console.debug(`[UserAvatar:${debugLabel}] missing image`, {
        userImage,
        name,
      });
    }
  }, [debugLabel, name, srcImage, userImage]);

  return image;
}
