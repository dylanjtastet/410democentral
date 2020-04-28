import React, {useState} from 'react';

const CopySample = (props) => {

	const [name, setName] = useState(props.name + " (Copy)");

	const makeCopy = () => {
		props.addNewProgram(
		{name: name, code: props.code}, 
		props.category, props.group, true,  true);
		props.setShowCopyModal(false);
	}

	return (
		<div className="modal is-active">
			<div className="modal-background"></div>
	  		<div className="modal-card">
	    		<header className="modal-card-head">
	      			<p className="modal-card-title">Enter Name for Copy</p>
		      		<button className="delete" aria-label="close"
		      			onClick={() => {props.setShowCopyModal(false)}}>
		      		</button>
		    	</header>
		    	<section className="modal-card-body">
		      		<input className="input" type="text" placeholder={name}
		      			value={name} onChange={e => setName(e.target.value)}>
		      		</input>
		   		</section>
                <footer className="modal-card-foot">
                    <button className="button is-success" onClick={makeCopy}>Add Code</button>
                </footer>		   		 
		  	</div>
		</div>
	)
}

export default CopySample;