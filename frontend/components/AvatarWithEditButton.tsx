import React from 'react';
import { Avatar } from 'flowbite-react';
import { FiEdit2 } from 'react-icons/fi';

interface props {
  imageUrl?: string;
}

const AvatarWithEditButton = ({ imageUrl }: props) => {
  return (
    <div className="relative w-36 h-36">
      {/* Avatar */}
      <Avatar
        img={imageUrl && `http://localhost:3002/images/${imageUrl}`}
        alt="User avatar"
        rounded={true}
        className="w-full h-full"
        size={'xl'}
      />

      {/* Floating Edit Button */}
      <button
        type="button"
        className="absolute top-0 right-2 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <FiEdit2 size={16} />
      </button>
    </div>
  );
};

export default AvatarWithEditButton;
