import type { NextPage } from "next";
import Image from 'next/image';
import React from "react";

export const HomePageContent: NextPage = function () {
  return (
    <div className="p-6 mx-auto">
      <Image src={'/db-image.png'} width={300} height={300} alt="Logo Dunia Baliho" />
    </div>
  );
};
