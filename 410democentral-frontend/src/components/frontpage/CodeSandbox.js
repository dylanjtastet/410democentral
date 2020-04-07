import React , {useEffect, useRef} from 'react';

function CodeSandbox(props) {

	const frameRef = useRef();

	const processMessage = (e) => {
		if (e.origin === "null" && e.source === frameRef.current.contentWindow) {
			let msg = e.data;
			if (msg.info.msgType === "console") {
				props.setConsoleBuffer(consoleBuffer =>
					[...consoleBuffer, {level: msg.info.level, data: msg.data}]
				);
			} else if (msg.info.msgType === "graph") {
				props.setGraph({show: true, data: msg.data});
			} else if (msg.info.msgType === "error") {
				console.error(msg.data);
			}
		}
	}

	useEffect(() => {
		window.addEventListener('message', processMessage);
	}, []);

	useEffect(() => {
		if (props.pendingRun === true) {
			frameRef.current.contentWindow.postMessage(props.code, "*");
			props.setPendingRun(false);
		}
	}, [props.code, props.pendingRun]);

	return (
		<iframe
			src = {process.env.PUBLIC_URL + '/code_sandbox.html'}
			sandbox = "allow-scripts"
			ref = {frameRef}
			width = {0}
			height = {0}
		></iframe>
		)
}

export default CodeSandbox;