import { Avatar } from "@mui/material";
import { useState, useEffect } from "react";

interface UserAvatarProps {
  avatar: string;
  alt: string;
}

const UserAvatar = ({ avatar, alt = "avatar-image" }:UserAvatarProps) => {
  const [avatarImg, setAvatarImg] = useState("");

  useEffect(() => {
    const getAvatarImg = async () => {
      try {
        // imports images dynamically
        const img = new URL(
          `../../assets/images/${avatar}.jpg`,
          import.meta.url
        );
        setAvatarImg(img.href);
      } catch (err) {
        console.log(err);
      }
    };
    getAvatarImg();
  }, [avatar]);

  return <Avatar src={avatarImg} alt={alt} />;
  
};

export default UserAvatar;
