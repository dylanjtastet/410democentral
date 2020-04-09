import React, {useState, useEffect} from 'react';

import { Hook, Console, Decode } from 'console-feed'

function ConsoleWrapper(props) {

	// This is stupid and should probably be doing something useful
	// console-feed needs a console object to hook into
	const mockConsoleTemplate = {
	    info: (...args) => {},
	    log: (...args) => {},
	    warn: (...args) => {},
	    error: (...args) => {}
	}

	const [mockConsole, setMockConsole] = useState(mockConsoleTemplate);
    const setLogs = props.setLogs;
    const consoleBuffer = props.consoleBuffer;
    const setConsoleBuffer = props.setConsoleBuffer;

	useEffect(() => {
		Hook(mockConsole, log => {
			setLogs(logs => [...logs, Decode(log)]);
		});
		setMockConsole(mockConsole);
	}, [mockConsole, setLogs]);

	useEffect(() => {
		if (consoleBuffer.length > 0) {
			consoleBuffer.forEach(msg => {
				mockConsole[msg.level](msg.data);
			});
			setConsoleBuffer([]);
		}
	}, [mockConsole, consoleBuffer, setConsoleBuffer]);

	return (
		<div style={{height: "150px", overflow: "scroll"}}>
			<Console class="console" logs={props.logs} variant="dark" />
		</div>
	)
}

export default ConsoleWrapper;
