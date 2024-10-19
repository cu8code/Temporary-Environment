"use client"

import { useRef, useEffect } from 'react';
import '@xterm/xterm/css/xterm.css';
import { useVSCodeStore } from "@/utils/store";
import { Terminal as TerminalIcon } from "lucide-react";

const TerminalPanel = () => {
  const { webcontainerInstance, updateFileSystem, getTheme } = useVSCodeStore();
  const terminalRef = useRef(null);
  const theme = getTheme();

  useEffect(() => {

    const loadXterm = async () => {
      const { Terminal } = await import('@xterm/xterm');
      const { FitAddon } = await import('@xterm/addon-fit');

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

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async function startShell(terminal: any) {
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
          await input.write(`npm i\n`); // Write command to shell
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          terminal.onData(async (data: any) => {
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
    };

    loadXterm();

  }, [webcontainerInstance, updateFileSystem, terminalRef]);

  return (
    <div className="flex flex-col h-full w-full" style={{ background: theme.terminal.background }}>
      <div className="bg-black border-b border-gray-700">
        <div className="flex justify-between items-center p-2">
          <div className="flex items-center">
            <TerminalIcon size={16} className="mr-2 text-gray-400" />
            <span className="text-gray-400">Terminal</span>
          </div>
        </div>
      </div>
      <div style={{ background: theme.terminal.background }} className="h-full w-full overflow-hidden" ref={terminalRef} />
    </div>
  );
};

export default TerminalPanel;
