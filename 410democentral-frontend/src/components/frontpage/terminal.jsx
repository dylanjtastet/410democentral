import React from 'react';
import Terminal from 'react-console-emulator';

const commands = {
    echo: {
      description: 'Echo a passed string.',
      usage: 'echo <string>',
      fn: function () {
        return `${Array.from(arguments).join(' ')}`
      }
    }
  }

const contentStyle = {
    height: "130px",
}

export default function Terminalbox(props) {
    return( 
        <Terminal
        commands={commands}
        //welcomeMessage={'Welcome to the React terminal!'}
        promptLabel={'me@React:~$'}
        contentStyle={contentStyle}
        />
    )
}

