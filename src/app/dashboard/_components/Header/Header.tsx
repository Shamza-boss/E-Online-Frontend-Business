import NavbarBreadcrumbs from '../NavbarBreadcrumbs';
import ColorModeIconDropdown from '../../../_lib/components/shared-theme/ColorModelIconDropdown';
import Search from '../Search';
import { HeaderContainer, HeaderStack, ActionsStack } from './elements';

export default function Header() {
  return (
    <HeaderContainer>
      <HeaderStack direction="row" spacing={1}>
        <NavbarBreadcrumbs />
        <ActionsStack>
          <Search />
          <ColorModeIconDropdown />
        </ActionsStack>
      </HeaderStack>
    </HeaderContainer>
  );
}
