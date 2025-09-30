import { RichTextEditorRef, RichTextEditor } from 'mui-tiptap';
import { useRef, useEffect } from 'react';
import useExtensions from '../TipTapEditor/useExtensions';
import HomeWorkMenuControls from './HomeWorkMenuControls';
import { ExcalidrawNode } from '../../extensions/ExcalidrawNode';

interface RichTextAnswerProps {
  value: string;
  onChange: (newContent: string) => void;
  readOnly?: boolean;
}

export const RichTextAnswer: React.FC<RichTextAnswerProps> = ({
  value,
  onChange,
  readOnly = true,
}) => {
  const rteRef = useRef<RichTextEditorRef>(null);

  useEffect(() => {
    if (rteRef.current?.editor) {
      const currentContent = rteRef.current.editor.getHTML();
      if (currentContent !== value) {
        rteRef.current.editor.commands.setContent(value, false);
      }
    }
  }, [value]);

  const extensions = useExtensions({
    placeholder: 'Enter your answer here...',
  });

  return (
    <RichTextEditor
      ref={rteRef}
      content={value}
      editable={!readOnly}
      immediatelyRender={false} // MUST be true
      extensions={[...extensions, ExcalidrawNode]}
      renderControls={() => <HomeWorkMenuControls />}
      onUpdate={() => onChange(rteRef.current?.editor?.getHTML() ?? '')}
    />
  );
};
