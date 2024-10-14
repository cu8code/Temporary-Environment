const TerminalPane: React.FC<{
  terminalCommands: {
    echo: (args: string) => string;
    execute: (command: string) => Promise<string>;
  };
}> = ({ terminalCommands }) => {
  const { setShowTerminal } = useVSCodeStore();
  return (
    <Resizable axis="y" initial={200} min={100} max={400} reverse>
      {({ position, separatorProps }) => (
        <div className="flex flex-col">
          <div
            {...separatorProps}
            className="h-1 bg-gray-600 cursor-row-resize"
          />
          <div className="bg-black" style={{ height: position }}>
            <div className="flex justify-between items-center p-2 border-b border-gray-700">
              <div className="flex items-center">
                <Terminal size={16} className="mr-2" />
                <span>Terminal</span>
              </div>
              <X
                size={18}
                className="cursor-pointer"
                onClick={() => setShowTerminal(false)}
              />
            </div>
            <div className="h-full">
              <ReactTerminal
                commands={terminalCommands}
                themes={{
                  'vscode-dark': {
                    themeBGColor: '#1e1e1e',
                    themeToolbarColor: '#323233',
                    themeColor: '#cccccc',
                    themePromptColor: '#9cdcfe',
                  },
                }}
                theme="vscode-dark"
                showControlButtons={false}
                promptLabel="$"
              />
            </div>
          </div>
        </div>
      )}
    </Resizable>
  );
};

export default TerminalPane;
