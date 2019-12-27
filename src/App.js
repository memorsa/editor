import React, { useState, useCallback } from "react";
import { createEditor, Text, Editor, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";

import "./App.css";

function App() {
  const editor = useCallback(withReact(createEditor()), []);

  const [value, setValue] = useState(
    JSON.parse(localStorage.getItem("content")) || [
      {
        type: "paragraph",
        children: [{ text: "A line of text in a paragraph." }]
      },
      {
        type: "link",
        url: "https://google.com",
        children: [{ text: "Google" }]
      },
      {
        children: [{ text: "Test it out." }, { text: "Looks good to me." }]
      }
    ]
  );

  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

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
              if (event.key === "&") {
                event.preventDefault();
                editor.insertText("and");
              }

              if (!event.ctrlKey) {
                return;
              }

              switch (event.key) {
                case "`": {
                  event.preventDefault();
                  const [match] = Editor.nodes(editor, {
                    match: n => n.type === "code"
                  });
                  Transforms.setNodes(
                    editor,
                    { type: match ? "paragraph" : "code" },
                    { match: n => Editor.isBlock(editor, n) }
                  );
                  break;
                }

                case "b": {
                  event.preventDefault();
                  const [match] = Editor.nodes(editor, {
                    match: n => n.bold === true
                  });
                  Transforms.setNodes(
                    editor,
                    { bold: match ? null : true },
                    { match: n => Text.isText(n), split: true }
                  );
                  break;
                }

                default:
                  return;
              }
            }}
          />
        </Slate>
      </div>
    </div>
  );
}

const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  return <span {...attributes}>{children}</span>;
};

export default App;
