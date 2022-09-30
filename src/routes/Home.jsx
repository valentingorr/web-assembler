import React from "react";

export default props => {
	return (
		<div route="home">
			<button onClick={() => window.bridge.command("dd")()}>Click Me</button>
			<div className="banner"></div>
			<div className="projects-wrapper">
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
};