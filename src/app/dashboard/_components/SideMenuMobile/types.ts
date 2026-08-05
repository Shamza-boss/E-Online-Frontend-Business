export type SideMenuMobileProps = {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}
