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
	const consoleRerenderHook = props.consoleRerenderHook;

	useEffect(() => {
		Hook(mockConsole, log => {
			setLogs(logs => [...logs, Decode(log)]);
		});
		setMockConsole(mockConsole);
	}, [mockConsole, setLogs]);

	useEffect(() => {
		console.log("bop");
		if (consoleBuffer.current.length > 0) {
			consoleBuffer.current.forEach(msg => {
				mockConsole[msg.level](msg.data);
			});
			consoleBuffer.current = [];
		}
	}, [mockConsole, consoleRerenderHook, consoleBuffer]);

	return (
		<Console class="console" logs={props.logs} variant="dark" />
	)
}

export default ConsoleWrapper;
