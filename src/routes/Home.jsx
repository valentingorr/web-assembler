import React from "react";

import {
	useSelector,
	useDispatch
} from "react-redux";
import reducers from "../redux/reducers.js";
import * as ACTIONS from "../redux/actions.js";

import "../style/home.scss";

export default props => {

	const dispatch = useDispatch();

	return (
		<div route="home">
			<div className="banner"></div>
			<main>
				<aside>
					<button onClick={() => dispatch(ACTIONS.form("newProject"))} type="button" scomponent="button">New Project</button>
					<button type="button" scomponent="button" className="secondary">Open Project</button>
				</aside>
			</main>
		</div>
	);
};