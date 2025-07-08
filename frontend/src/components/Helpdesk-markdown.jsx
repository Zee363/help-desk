import React, { useState} from "react";
import Markdown from "react-markdown";

const HelpdeskMarkdown = ({ content }) => {
  return (
    <div className="markdown-content">
        <Markdown>{content}</Markdown>
    </div>
  );
};

export default HelpdeskMarkdown;