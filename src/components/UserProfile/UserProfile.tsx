import UserAvatar from "../UserAvatar";

interface UserProfileProps {
  name: string;
  avatar: string;
  alt: string;
  compact?: boolean;
}

const UserProfile = ({ name, avatar, alt, compact = false }:UserProfileProps) => {
    
  return (
    <div className={`name-badge-wrapper ${compact ? 'compact' : ''}`}>
      <UserAvatar avatar={avatar} alt={alt} />
      {name && <span>{name}</span>}
    </div>
  );
  
};

export default UserProfile;
