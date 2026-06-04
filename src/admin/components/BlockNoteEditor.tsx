import React, { useEffect, useState } from 'react';
import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import mantineStyles from '@mantine/core/styles.css?inline';
import blocknoteCore from '@blocknote/core/style.css?inline';
import blocknoteReact from '@blocknote/react/style.css?inline';
import blocknoteMantine from '@blocknote/mantine/style.css?inline';

interface Props {
  name: string;
  value: string | null;
  onChange: (event: { target: { name: string; value: string; type: string } }) => void;
  disabled?: boolean;
}

const parseInitialContent = async (html: string): Promise<PartialBlock[]> => {
  const tmpEditor = BlockNoteEditor.create();
  return tmpEditor.tryParseHTMLToBlocks(html);
};

const EditorInner = ({
  name,
  initialBlocks,
  onChange,
  disabled,
}: {
  name: string;
  initialBlocks: PartialBlock[] | undefined;
  onChange: Props['onChange'];
  disabled?: boolean;
}) => {
  const editor = useCreateBlockNote({ initialContent: initialBlocks });

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '4px', minHeight: '300px' }}>
      <BlockNoteView
        editor={editor}
        editable={!disabled}
        theme="light"
        onChange={async () => {
          const html = await editor.blocksToHTMLLossy(editor.document);
          onChange({ target: { name, value: html, type: 'text' } });
        }}
      />
    </div>
  );
};

const STYLE_ID = 'blocknote-injected-styles';

const BlockNoteEditorField = ({ name, value, onChange, disabled }: Props) => {
  const [initialBlocks, setInitialBlocks] = useState<PartialBlock[] | null>(null);

  useEffect(() => {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = mantineStyles + blocknoteCore + blocknoteReact + blocknoteMantine;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    if (value) {
      parseInitialContent(value).then(setInitialBlocks);
    } else {
      setInitialBlocks([]);
    }
  }, []);

  if (initialBlocks === null) {
    return (
      <div style={{
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        minHeight: '300px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '14px',
      }}>
        로딩 중...
      </div>
    );
  }

  return (
    <EditorInner
      name={name}
      initialBlocks={initialBlocks.length > 0 ? initialBlocks : undefined}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

export default BlockNoteEditorField;
