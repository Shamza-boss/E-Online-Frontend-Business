'use client';

import ProfileSettingsCard, {
  type ProfileSettingsUser,
} from '../../profile/ProfileSettingsCard';
import SubscriptionSettingsPanel from '../../subscription/SubscriptionSettingsPanel';

interface ProfilePanelProps {
  user: ProfileSettingsUser;
}

export default function ProfilePanel({ user }: ProfilePanelProps) {
  return (
    <>
      <ProfileSettingsCard user={user} />
      <SubscriptionSettingsPanel />
    </>
  );
}
