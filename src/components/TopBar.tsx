const TopBar: React.FC = () => {
  const { showExplorer, showTerminal, setShowExplorer, setShowTerminal } =
    useVSCodeStore();
  return (
    <div className="flex justify-between items-center p-2 bg-gray-900 border-b border-gray-700">
      <div className="flex space-x-2">
        <button
          className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          onClick={() => setShowExplorer(!showExplorer)}
        >
          {showExplorer ? 'Hide' : 'Show'} Explorer
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
          onClick={() => setShowTerminal(!showTerminal)}
        >
          {showTerminal ? 'Hide' : 'Show'} Terminal
        </button>
      </div>
    </div>
  );
};

export default TopBar;
