import React, { useRef, useEffect } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useVSCodeStore } from "../store";
import { Terminal as TerminalIcon, X } from "lucide-react";


const TerminalPanel: React.FC = () => {
  const { setShowTerminal, webcontainerInstance } = useVSCodeStore();
  const terminalRef = useRef(null);

  useEffect(() => {
    const terminal = new Terminal({
      convertEol: true,
    });
    const fitAddon = new FitAddon();

    terminal.loadAddon(fitAddon);
    if (terminalRef.current){
      terminal.open(terminalRef.current);
    }
    fitAddon.fit();

    async function startShell(terminal: Terminal) {
      if (!webcontainerInstance){
        throw new Error("webcontainerInstance must not be null or undefined")
        return
      }
      const shellProcess = await webcontainerInstance.spawn('jsh');
      shellProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            terminal.write(data);
          },
        })
      );

      const input = shellProcess.input.getWriter();
      terminal.onData((data: string) => {
        input.write(data);
      });

      return shellProcess;
    }

    startShell(terminal).then((shellProcess) => {
      return () => {
        if (!shellProcess){
          return
        }
        shellProcess.kill();
        terminal.dispose();
      };
    });

    return () => {
      terminal.dispose();
    };
  }, [webcontainerInstance]);

  return (
    <div className="flex flex-col">
      <div className="bg-black" style={{ height: '200px' }}>
        <div className="flex justify-between items-center p-2 border-b border-gray-700">
          <div className="flex items-center">
            <TerminalIcon size={16} className="mr-2" />
            <span>Terminal</span>
          </div>
          <X
            size={18}
            className="cursor-pointer"
            onClick={() => setShowTerminal(false)}
          />
        </div>
        <div className="h-full" ref={terminalRef} />
      </div>
    </div>
  );
};

export default TerminalPanel;
