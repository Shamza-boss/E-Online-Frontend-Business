import type { FullScreenClassroomModalProps } from './types';

export const handleTabChange = (
  onTabChange: FullScreenClassroomModalProps['onTabChange'],
  _event: React.SyntheticEvent,
  newValue: string
) => {
  onTabChange?.(newValue);
};
