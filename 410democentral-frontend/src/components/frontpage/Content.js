import React from 'react';
import 'bulma/css/bulma.css';
import '../../general.css';

function Content() {
  return (
    <div className="container contentbox">

      {/*Codebox-- Should be replaced by something that styles code as it is typed (colors and whatnot)*/} 

        <div className="container"> 
            <textarea className="textarea codebox" placeholder="Insert code here"></textarea>
        </div> 
        <br>
        </br>
        <div className="container columns">
            <div className="column is-2"> 
                <p>
                    <button className="button runbutton">Run</button>
                </p>
                <br></br>
                <p>
                    <button className="button runbutton">Graph</button>
                </p>
            </div>
            {/*Terminal-- Should probably also be replaced by some sort of terminal-mimicking style thing */}
            <div className="column">
                <textarea className="textarea terminal" placeholder="Terminal"></textarea>
            </div>
        </div>
        <div className="container columns">
            <div className="column is-2"> 
                <p>
                    <button className="button runbutton">Evaluate</button>
                </p>
            </div>
            {/*Hypothetical graph-- generated when graph button is pressed*/}
            <div className="column">
                <div className="box codebox is-dark">
                    Graph here
                </div>
            </div>
        </div>
        <br>
        </br>
        <div className="container">
            Estimated Time Complexity: 
        </div>
    </div>
  );
}

export default Content;