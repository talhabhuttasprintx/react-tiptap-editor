import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBold, faItalic, faUnderline, faStrikethrough, faPalette, faHighlighter,
  faListOl, faListUl, faUndo, faRedo, faLink, faUnlink, faTimes
} from '@fortawesome/free-solid-svg-icons';
import './style.css'; 

const LinkModal = ({ isOpen, onClose, onSubmit }) => {
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modal">
        <button className="closeButton" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="modalInput"
        />
        <button 
          onClick={() => {
            onSubmit(url);
            setUrl('');
          }}
          className="modalButton"
        >
          Add Link
        </button>
      </div>
    </div>
  );
};

const TiptapEditor = () => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color.extend({
        types: ['textStyle'],
      }),
      Highlight,
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
        validate: href => /^https?:\/\//.test(href),
      }),
    ],
    content: '<p>Replace this Text</p>',
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        setShowFloatingMenu(true);
      } else {
        setShowFloatingMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const addLink = (url) => {
    if (url) {
      const href = url.match(/^https?:\/\//) ? url : `https://${url}`;
      editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
    }
    setShowLinkModal(false);
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const applyColor = () => {
    editor.chain().focus().setColor('#ff0000').run(); // Set a specific color, e.g., red
  };

  return (
    <div className="container">
      <EditorContent editor={editor} className="editor" />
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bubbleMenu">
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={faBold}
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={faItalic}
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon={faUnderline}
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon={faStrikethrough}
        />
        <IconButton
          onClick={applyColor}
          icon={faPalette}
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          icon={faHighlighter}
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={faListOl}
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={faListUl}
        />
        <IconButton
          onClick={() => editor.chain().focus().undo().run()}
          icon={faUndo}
        />
        <IconButton
          onClick={() => editor.chain().focus().redo().run()}
          icon={faRedo}
        />
        <IconButton
          onClick={() => setShowLinkModal(true)}
          isActive={editor.isActive('link')}
          icon={faLink}
        />
        {editor.isActive('link') && (
          <IconButton onClick={removeLink} icon={faUnlink} />
        )}
      </BubbleMenu>
      {showFloatingMenu && (
        <div 
          className={showFloatingMenu ? "floatingMenu" : "floatingMenuHidden"} 
        >
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            icon={faBold}
          />
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            icon={faItalic}
          />
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={faListOl}
          />
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={faListUl}
          />
        </div>
      )}
      <LinkModal 
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onSubmit={addLink}
      />
    </div>
  );
};

const IconButton = ({ onClick, isActive, icon }) => (
  <button 
    onClick={onClick} 
    className={isActive ? "iconButton iconButtonActive" : "iconButton"}
  >
    <FontAwesomeIcon icon={icon} />
  </button>
);

export default TiptapEditor;
