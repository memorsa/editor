import React, { useMemo, useState } from "react";

// Import the Slate editor factory.
import { createEditor } from "slate";

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";

import "./App.css";

function App() {
  // Create a Slate editor object that won't change across renders.
  const editor = useMemo(() => withReact(createEditor()), []);

  // Add the initial value when setting up our state.
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }]
    }
  ]);

  // Render the Slate context.
  return (
    <div className="App">
      <Slate editor={editor} value={value} onChange={value => setValue(value)}>
        <Editable />
      </Slate>
    </div>
  );
}

export default App;
