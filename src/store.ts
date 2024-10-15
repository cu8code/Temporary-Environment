import { WebContainer } from '@webcontainer/api';
import { create } from 'zustand';
import { themes } from './theme';

export interface Theme {
  sidebar: {
    color: string,
    background: string,
    borderColor: string,
    borderWidth: string
  },
  fileExplorer: {
    backgroundColor: string,
    head: {
      text_color: string,
      backgroundColor: string,
      borderColor: string,
      borderWidth: string
    },
    body: {
      text_color: string,
      backgroundColor: string,
      selectedColor: string,
      hoverColor: string,
      borderColor: string,
      borderWidth: string
    }
  },
  main: {
    topbar: {
      text_color: string,
      backgroundColor: string,
      selectedColor: string,
      hoverColor: string,
      borderColor: string,
      borderWidth: string
    }
    editor: {
      theme: string
    },
  },
  terminal: {
    background: string
  }
}

interface VSCodeState {
  selectedFile: string | null;
  openFiles: string[];
  files: FileSystem;
  webcontainerInstance: WebContainer | null;
  showExplorer: boolean;
  showTerminal: boolean;
  showSearchBar: boolean;
  theme: number;
  themes: Theme[]
  setTheme: (index: number) => void;
  getThemes: () => Theme[];
  getTheme: () => Theme;
  setSelectedFile: (file: string | null) => void;
  setOpenFiles: (files: string[]) => void;
  setFiles: (files: FileSystem) => void;
  setWebcontainerInstance: (instance: WebContainer | null) => void;
  setShowExplorer: (show: boolean) => void;
  setShowTerminal: (show: boolean) => void;
  setShowSearchBar: (show: boolean) => void;
  addFile: (fileName: string, content: string) => void;
  updateFile: (fileName: string, content: string) => void;
  closeFile: (fileName: string) => void;
  updateFileSystem: () => Promise<void>;
}


interface FileSystem {
  [key: string]: {
    file: {
      contents: string;
    };
  };
}
const initialFileSystem: FileSystem = {
  'index.js': {
    file: {
      contents: 'console.log("Hello, WebContainer!");',
    },
  },
  'package.json': {
    file: {
      contents: JSON.stringify(
        {
          name: 'webcontainer-project',
          type: 'module',
          dependencies: {},
          scripts: {
            start: 'node index.js',
          },
        },
        null,
        2
      ),
    },
  },
};

export const useVSCodeStore = create<VSCodeState>((set, get) => ({
  selectedFile: 'index.js',
  openFiles: ['index.js'],
  files: initialFileSystem,
  webcontainerInstance: null,
  showExplorer: true,
  showTerminal: true,
  showSearchBar: false,
  theme: 0, // Default to light theme
  themes: themes,
  setTheme: (index) => set({ theme: index}),
  setSelectedFile: (file) => set({ selectedFile: file }),
  setOpenFiles: (files) => set({ openFiles: files }),
  setFiles: (files) => set({ files }),
  setWebcontainerInstance: (instance) => set({ webcontainerInstance: instance }),
  setShowExplorer: (show) => set({ showExplorer: show }),
  setShowTerminal: (show) => set({ showTerminal: show }),
  setShowSearchBar: (show) => set({ showTerminal: show }),
  addFile: (fileName, content) => set((state) => ({
    files: {
      ...state.files,
      [fileName]: { file: { contents: content } },
    },
  })),
  updateFile: (fileName, content) => set((state) => ({
    files: {
      ...state.files,
      [fileName]: { file: { contents: content } },
    },
  })),
  closeFile: (fileName) => set((state: { openFiles: any[],selectedFile: string | null | undefined }) => ({
    openFiles: state.openFiles.filter((file) => file !== fileName),
    selectedFile: state.selectedFile === fileName ? state.openFiles[0] || null : state.selectedFile,
  })),
  updateFileSystem: async () => {
      const { webcontainerInstance, setFiles } = get();
      if (webcontainerInstance) {
        const updatedFiles: FileSystem = {};
        const entries = await webcontainerInstance.fs.readdir('.');
        for (const entry of entries) {
          try {
            const contents = await webcontainerInstance.fs.readFile(entry, 'utf-8');
            updatedFiles[entry] = { file: { contents } };
          } catch (error) {
            console.error(`Error reading file ${entry}:`, error);
          }
        }
        setFiles(updatedFiles);
      }
    },
    getThemes: () => {
      const { themes } = get()
      return themes
    },
    getTheme: () => {
      const {theme, themes} = get()
      return themes[theme]
    }

}));
