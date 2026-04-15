import type { FullScreenClassroomModalProps } from './interfaces';

export const handleTabChange = (
  onTabChange: FullScreenClassroomModalProps['onTabChange'],
  _event: React.SyntheticEvent,
  newValue: string
) => {
  onTabChange?.(newValue);
};
