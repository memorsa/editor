import isHotkey from "is-hotkey";
import { Editor } from "slate";

export const onKeyDown = (mark, hotkey) => {
  return (event, editor) => {
    if (isHotkey(hotkey, event)) {
      event.preventDefault();
      toggleMark(editor, mark);
    }
  };
};

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
