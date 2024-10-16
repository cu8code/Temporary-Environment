import { useRef, useEffect, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useVSCodeStore } from "../store";
import { Terminal as TerminalIcon, X } from "lucide-react";


const TerminalPanel = () => {
  const { setShowTerminal, webcontainerInstance, updateFileSystem, getTheme } = useVSCodeStore();
  const terminalRef = useRef(null);
  const theme = getTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Effect started");

    if (!terminalRef.current) {
      console.log("Terminal ref not available");
      return;
    }

    console.log("Terminal ref available");

    const terminal = new Terminal({
      convertEol: true,
    });
    const fitAddon = new FitAddon();

    console.log("Loading terminal addon");
    terminal.loadAddon(fitAddon);

    console.log("Opening terminal");
    terminal.open(terminalRef.current);

    console.log("Fitting terminal");
    fitAddon.fit();

    const resizeObserver = new ResizeObserver(() => {
      console.log("Resized");
      fitAddon.fit();
    });
    resizeObserver.observe(terminalRef.current);

    async function startShell(terminal: Terminal) {
      console.log("Starting shell");

      if (!webcontainerInstance) {
        console.log("Webcontainer instance not ready");
        return;
      }


      console.log("Webcontainer instance ready");

      try {
        console.log("Spawning shell process");
        const shellProcess = await webcontainerInstance.spawn('jsh');

        console.log("Shell process started");
        shellProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log("Writing to terminal:", data);
              terminal.write(data);
            },
          })
        );

        const input = shellProcess.input.getWriter();

        terminal.onData(async (data: string) => {
          console.log("Terminal input:", data);
          await input.write(data);
        });

        return shellProcess;
      } catch (error) {
        console.error("Error starting shell:", error);
      }
    }

    startShell(terminal).then((shellProcess) => {
      console.log("Shell process initialized");
      setLoading(false);
      return () => {
        if (!shellProcess) return;
        shellProcess.kill();
        terminal.dispose();
      };
    }).catch((error) => {
      console.error("Error initializing shell:", error);
    });

    return () => {
      console.log("Disposing terminal");
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
      {
        loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Initializing...
          </div>
        ) : null
      }
      <div style={{ background: theme.terminal.background }} className="h-full w-full overflow-hidden" ref={terminalRef} />
    </div>
  );
};

export default TerminalPanel;
