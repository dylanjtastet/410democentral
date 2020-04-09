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

	useEffect(() => {
		Hook(mockConsoleTemplate, log => {
			props.setLogs(logs => [...logs, Decode(log)]);
		});
		setMockConsole(mockConsoleTemplate);
	}, []);

	useEffect(() => {
		if (props.consoleBuffer.length > 0) {
			props.consoleBuffer.forEach(msg => {
				mockConsole[msg.level](msg.data);
			});
			props.setConsoleBuffer([]);
		}
	}, [props.consoleBuffer]);

	return (<Console class="console" logs={props.logs} variant="dark" />)
}

export default ConsoleWrapper;