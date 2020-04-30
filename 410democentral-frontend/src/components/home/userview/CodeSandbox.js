import React , {useEffect, useRef} from 'react';

function CodeSandbox(props) {

	const frameRef = useRef();
    const setConsoleBuffer = props.setConsoleBuffer;
    const setGraph = props.setGraph;

	useEffect(() => {
        const processMessage = (e) => {
            if(frameRef.current===null) {
                return;
            }

            if (e.origin === "null" && e.source === frameRef.current.contentWindow) {
                let msg = e.data;
                if (msg.info.msgType === "console") {
                    setConsoleBuffer(consoleBuffer =>
                        [...consoleBuffer, {level: msg.info.level, data: msg.data}]
                    );
                } else if (msg.info.msgType === "graph") {
                    setGraph({show: true, data: msg.data.data});
                } else if (msg.info.msgType === "error") {
                    console.error(msg.data);
                }
            }
        }
		window.addEventListener('message', processMessage);
	}, [setConsoleBuffer, setGraph]);

    const setPendingRun = props.setPendingRun;
    const pendingRun = props.pendingRun;
    const code = props.code;

	useEffect(() => {
		if (pendingRun === true) {
			frameRef.current.contentWindow.postMessage(code, "*");
			setPendingRun(false);
		}
	}, [setPendingRun, pendingRun, code]);

	return (
		<iframe title="code sandbox"
			src = {process.env.PUBLIC_URL + '/code_sandbox.html'}
			sandbox = "allow-scripts"
			ref = {frameRef}
			width = {0}
			height = {0}
		></iframe>
		)
}

export default CodeSandbox;
