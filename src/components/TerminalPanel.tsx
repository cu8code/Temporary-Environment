import { useRef, useEffect } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useVSCodeStore } from "../store";
import { Terminal as TerminalIcon, X } from "lucide-react";


const TerminalPanel = () => {
  const { setShowTerminal, webcontainerInstance, updateFileSystem, getTheme } = useVSCodeStore();
  const terminalRef = useRef(null);
  const theme = getTheme();
  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    const terminal = new Terminal({
      convertEol: true,
    });
    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);

    fitAddon.fit();

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalRef.current);

    async function startShell(terminal: Terminal) {
      if (!webcontainerInstance) {
        return;
      }
      try {
        const shellProcess = await webcontainerInstance.spawn('jsh');
        shellProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              terminal.write(data);
            },
          })
        );
        const input = shellProcess.input.getWriter();
        terminal.onData(async (data: string) => {
          await input.write(data);
        });

        return shellProcess;
      } catch (error) {
        console.error("Error starting shell:", error);
      }
    }

    startShell(terminal).then((shellProcess) => {
      return () => {
        if (!shellProcess) return;
        shellProcess.kill();
        terminal.dispose();
      };
    }).catch((error) => {
      console.error("Error initializing shell:", error);
    });

    return () => {
      terminal.dispose();
      resizeObserver.disconnect();
    };
  }, [webcontainerInstance, updateFileSystem, terminalRef])

  return (
    <div className="flex flex-col h-full w-full" style={{ background: theme.terminal.background }}>
      <div className="bg-black border-b border-gray-700">
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center">
            <TerminalIcon size={16} className="mr-2 text-gray-400" />
            <span className="text-gray-400">Terminal</span>
          </div>
          <X
            size={18}
            className="cursor-pointer text-gray-400"
            onClick={() => setShowTerminal(false)}
          />
        </div>
      </div>
      <div style={{ background: theme.terminal.background }} className="h-full w-full overflow-hidden" ref={terminalRef} />
    </div>
  );
};

export default TerminalPanel;
