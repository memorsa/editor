import React, { useState, useMemo, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";

import withLinks from "./plugins/withLinks";
import withMarkdownShortcuts from "./plugins/withMarkdownShortcuts";
import { onKeyDown as OnKeyDownMark } from "./plugins/withHotkey";

import "./App.css";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code"
};

const plugins = [withReact, withHistory, withMarkdownShortcuts, withLinks];

function App() {
  const editor = useMemo(() => {
    let editor = createEditor();
    plugins.forEach(plugin => (editor = plugin(editor)));
    return editor;
  }, []);

  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem("content")) || [
      {
        type: "paragraph",
        children: [{ text: "A line of text in a paragraph." }]
      },
      {
        type: "paragraph",
        children: [
          {
            type: "link",
            url: "https://google.com",
            children: [{ text: "Google" }]
          }
        ]
      },
      {
        children: [{ text: "Test it out." }, { text: "Looks good to me." }]
      }
    ]
  );

  const renderElement = useCallback(props => <Element {...props} />, []);

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />;
  }, []);

  return (
    <div className="App">
      <div className="App-body">
        <Slate
          editor={editor}
          value={value}
          onChange={value => {
            setValue(value);
            // Save the value to Local Storage.
            const content = JSON.stringify(value);
            localStorage.setItem("content", content);
          }}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={event => {
              for (const hotkey in HOTKEYS) {
                const mark = HOTKEYS[hotkey];
                OnKeyDownMark(mark, hotkey)(event, editor);
              }
              if (event.key === "&") {
                event.preventDefault();
                editor.insertText("and");
              }
            }}
          />
        </Slate>
      </div>
    </div>
  );
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "block-quote":
      return <blockquote {...attributes}>{children}</blockquote>;
    case "bulleted-list":
      return <ul {...attributes}>{children}</ul>;
    case "heading-one":
      return <h1 {...attributes}>{children}</h1>;
    case "heading-two":
      return <h2 {...attributes}>{children}</h2>;
    case "heading-three":
      return <h3 {...attributes}>{children}</h3>;
    case "heading-four":
      return <h4 {...attributes}>{children}</h4>;
    case "heading-five":
      return <h5 {...attributes}>{children}</h5>;
    case "heading-six":
      return <h6 {...attributes}>{children}</h6>;
    case "list-item":
      return <li {...attributes}>{children}</li>;
    case "code":
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      );
    case "link":
      return (
        <a {...attributes} href={element.url} contentEditable={false}>
          {children}
        </a>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export default App;
