// src/components/PageLayout.js
import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coy as style } from "react-syntax-highlighter/dist/esm/styles/prism";

const PageLayout = ({ content, queries }) => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, padding: "20px", overflowY: "scroll" }}>
        {content}
      </div>
      <div
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderLeft: "1px solid #ddd",
          overflowY: "scroll",
        }}
      >
        {/* <h2>Requêtes SPARQL utilisées</h2> */}
        {queries.map((query, index) => (
          <div key={index} style={{ marginBottom: "30px" }}>
            <h3>{query.description}</h3>
            <SyntaxHighlighter language="sparql" style={style}>
              {query.query}
            </SyntaxHighlighter>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PageLayout;
