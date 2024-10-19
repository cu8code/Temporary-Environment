import { Theme } from "./theme";
import { File, FileJson, FileJson2, Folder } from "lucide-react";

const color = {
  base: "#1f1f1f",
  main: "#141414",
  accent: "#939393",
  _base: "#fff",
};

export const vscode_dark: Theme = {
  sidebar: {
    color: "#dbdbdb",
    background: color.main,
    borderColor: "#303030",
    borderWidth: "1px",
  },
  fileExplorer: {
    backgroundColor: color.main,
    head: {
      text_color: color._base,
      backgroundColor: color.main,
      borderColor: color.accent,
      borderWidth: "1px",
    },
    body: {
      text_color: color._base,
      backgroundColor: color.main,
      selectedColor: color.base,
      hoverColor: color.accent,
      borderColor: color.accent,
      borderWidth: "1px",
      icons: {
        "json": <File />,
        "js": <FileJson2 />,
        "ts": <FileJson />,
        "default-file": <File />,
        "default-folder": <Folder />,
      },
    },
  },
  main: {
    topbar: {
      text_color: color._base,
      backgroundColor: color.main,
      selectedColor: "#303030",
      hoverColor: color.accent,
      borderColor: color.accent,
      borderWidth: "1px",
    },
    editor: {
      theme: "vs-dark", // VS Code Dark theme
      backgroundColor: color.base
    },
  },
  terminal: {
    background: color.main, // Very Dark Gray
  },
  loading: {
    background: color.main,
    color: color.accent
  },
  view: {
    background: color.main
  }
};
