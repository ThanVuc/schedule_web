"use client";

import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import "./style.scss";
interface RichTextProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  minHeight?: string;
  color?: string;
}
const SimpleMDEEditor = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
export default function RichText({ value, onChange, className, minHeight="200", color="black"}: RichTextProps) {
   const colorClass = color === "white" ? "text-black bg-white" : color === "black" ? "text-white" : "";
  return (
    <div
      className={`p-4 ${className} w-md ${colorClass}`}
    >
     <div className="max-w-md mx-auto">
        <SimpleMDEEditor
          value={value}
          onChange={onChange}
          options={{
            spellChecker: false,
            placeholder: "Nhập ...",
            lineWrapping: true,
            minHeight: minHeight,
            maxHeight: "200px",
            toolbar: [
              "bold",
              "italic",
              "heading",
              "|",
              "quote",
              "unordered-list",
              "ordered-list",
              "|",
              "link",
              "image",
              "|",
              "preview",
            ],
          }}
        />
      </div>
    </div>
  );
}
