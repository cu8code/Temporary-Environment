export interface Theme {
  sidebar: {
    color: string;
    background: string;
    borderColor: string;
    borderWidth: string;
  };
  fileExplorer: {
    backgroundColor: string;
    head: {
      text_color: string;
      backgroundColor: string;
      borderColor: string;
      borderWidth: string;
    };
    body: {
      text_color: string;
      backgroundColor: string;
      selectedColor: string;
      hoverColor: string;
      borderColor: string;
      borderWidth: string;
      icons: {
        ".json": React.ReactNode;
        ".js": React.ReactNode;
        ".ts": React.ReactNode;
        "default-file": React.ReactNode;
        "default-folder": React.ReactNode;
      };
    };
  };
  main: {
    topbar: {
      text_color: string;
      backgroundColor: string;
      selectedColor: string;
      hoverColor: string;
      borderColor: string;
      borderWidth: string;
    };
    editor: {
      theme: string;
      backgroundColor: string;
    };
  };
  terminal: {
    background: string;
  },
  loading: {
    background: string;
    color: string;
  }
}


export default Theme
