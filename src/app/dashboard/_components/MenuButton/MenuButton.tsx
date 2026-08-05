import Badge, { badgeClasses } from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import type { MenuButtonProps } from './types';

export default function MenuButton({
  showBadge = false,
  ...props
}: MenuButtonProps) {
  const { touchRippleRef: _touchRippleRef, ...iconButtonProps } = props as MenuButtonProps & {
    touchRippleRef?: unknown;
  };

  return (
    <Badge
      color="error"
      variant="dot"
      invisible={!showBadge}
      sx={{ [`& .${badgeClasses.badge}`]: { right: 2, top: 2 } }}
    >
      <IconButton size="small" {...iconButtonProps} />
    </Badge>
  );
}
