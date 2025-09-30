import {
  MenuButtonAddTable,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonIndent,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonTaskList,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuButtonUnindent,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuSelectTextAlign,
  isTouchDevice,
} from 'mui-tiptap';
import DrawingButton from '../TipTapEditor/MenuButtonFreeHand';

export default function HomeWorkMenuControls() {
  return (
    <MenuControlsContainer>
      <MenuSelectHeading />
      <MenuDivider />
      <MenuButtonBold />
      <MenuButtonItalic />
      <MenuButtonUnderline />
      <MenuDivider />
      <MenuSelectTextAlign />
      <MenuDivider />
      <MenuButtonOrderedList />
      <MenuButtonBulletedList />
      <MenuButtonTaskList />
      {isTouchDevice() && (
        <>
          <MenuButtonIndent />
          <MenuButtonUnindent />
        </>
      )}
      <MenuDivider />
      <MenuButtonBlockquote />
      <MenuDivider />
      <MenuButtonAddTable />
      <MenuDivider />
      <MenuButtonUndo />
      <MenuButtonRedo />
      <MenuDivider />
      <DrawingButton />
    </MenuControlsContainer>
  );
}
