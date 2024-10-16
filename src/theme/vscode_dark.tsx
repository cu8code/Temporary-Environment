import { Theme } from "./theme";
import { File, FileJson, FileJson2, Folder } from "lucide-react";

export const vscode_dark: Theme = {
  sidebar: {
    color: "rgba(255,255,255,1)", // White
    background: "rgba(20,20,20,1)", // Dark Gray
    borderColor: "rgba(50,50,50,1)", // Gray
    borderWidth: "1px",
  },
  fileExplorer: {
    backgroundColor: "rgba(20,20,20,1)", // Dark Gray
    head: {
      text_color: "rgba(255,255,255,1)", // White
      backgroundColor: "rgba(10,10,10,1)", // Very Dark Gray
      borderColor: "rgba(50,50,50,1)", // Gray
      borderWidth: "1px",
    },
    body: {
      text_color: "rgba(255,255,255,1)", // White
      backgroundColor: "rgba(20,20,20,1)", // Dark Gray
      selectedColor: "rgba(40,40,40,1)", // Dark Gray Hover
      hoverColor: "rgba(30,30,30,1)", // Gray Hover
      borderColor: "rgba(50,50,50,1)", // Gray
      borderWidth: "1px",
      icons: {
        ".json": <File />,
        ".js": <FileJson2 />,
        ".ts": <FileJson />,
        "default-file": <File />,
        "default-folder": <Folder />,
      },
    },
  },
  main: {
    topbar: {
      text_color: "rgba(255,255,255,1)", // White
      backgroundColor: "rgba(30,30,30,1)", // Dark Gray
      selectedColor: "rgba(50,50,50,1)", // Gray Selected
      hoverColor: "rgba(40,40,40,1)", // Gray Hover
      borderColor: "rgba(50,50,50,1)", // Gray
      borderWidth: "1px",
    },
    editor: {
      theme: "vs-dark", // VS Code Dark theme
    },
  },
  terminal: {
    background: "rgba(10,10,10,1)", // Very Dark Gray
  },
};
