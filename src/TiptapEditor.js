import React, { useEffect, useState } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faPalette,
  faHighlighter,
  faListOl,
  faListUl,
  faUndo,
  faRedo,
  faLink,
  faUnlink,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import ColorDropdown from "./ColorDropdown";
import "./style.css";

const colors = [
  "#ffa500",
  "#40e0d0",
  "#008000",
  "#ff4040",
  "#ff1493",
  "#40e0d0",
];

const LinkModal = ({ isOpen, onClose, onSubmit }) => {
  const [url, setUrl] = useState("");

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
            setUrl("");
          }}
          className="modalButton"
        >
          Add Link
        </button>
      </div>
    </div>
  );
};

const TiptapEditor = ({ onChange }) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [colorType, setColorType] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color.extend({
        types: ["textStyle"],
      }),
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: true,
        linkOnPaste: true,
        validate: (href) => /^https?:\/\//.test(href),
      }),
    ],
    content: "",
    onUpdate({ editor }) {
      // Call the onChange prop with the updated content
      if (onChange) {
        onChange(editor.getJSON());
      }
    },
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        setShowFloatingMenu(true);
      } else {
        setShowFloatingMenu(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const addLink = (url) => {
    if (url) {
      const href = url.match(/^https?:\/\//) ? url : `https://${url}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setShowLinkModal(false);
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const applyColor = (color) => {
    if (colorType === "text") {
      editor.chain().focus().setColor(color).run();
    } else if (colorType === "highlight") {
      editor.chain().focus().toggleHighlight({ color: color }).run();
    }
    setShowColorDropdown(false);
    setColorType(null);
  };

  const handleEditorClick = () => {
    if (editor) {
      editor.chain().focus().run();
    }
  };

  return (
    <div className="container">
      <EditorContent
        editor={editor}
        className="editor"
        onClick={handleEditorClick}
      />
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="bubbleMenu"
      >
        {showColorDropdown && (
          <ColorDropdown colors={colors} onColorSelect={applyColor} />
        )}
        <IconButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={faBold}
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={faItalic}
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={faUnderline}
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          icon={faStrikethrough}
        />
        <IconButton
          onClick={() => {
            setColorType("text");
            setShowColorDropdown(!showColorDropdown);
          }}
          icon={faPalette}
        />
        <IconButton
          onClick={() => {
            setColorType("highlight");
            setShowColorDropdown(!showColorDropdown);
          }}
          icon={faHighlighter}
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={faListOl}
        />
        <IconButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
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
          isActive={editor.isActive("link")}
          icon={faLink}
        />
        {editor.isActive("link") && (
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
            isActive={editor.isActive("orderedList")}
            icon={faListOl}
          />
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
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
