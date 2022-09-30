import React, {
	useState,
	useEffect
} from "react";

import {
	useDispatch
} from "react-redux";
import * as ACTIONS from "../redux/actions.js";

import { v4 as uuid } from "uuid";

import * as Icons from "./Icons.jsx";

const Header = props => {
	return (
		<header>
			<header>
				<p className="title">{props.title}</p>
			</header>
			<main>{props.children}</main>
		</header>
	);
};

const Viewport = props => {

	const dispatch = useDispatch();

	return (
		<div cmenu="true" className="viewport" onContextMenu={event => {
			dispatch(ACTIONS.contextMenu.set({
				pos: [event.pageX, event.pageY],
				items: [
					{
						title: "Delete",
						icon: "delete",
						click: props.delete
					}
				]
			}));
		}}>
			<div scomponent="input-container">
				<label htmlFor="viewport-width-input">Width</label>
				<input placeholder="value" type="text" id="viewport-width-input" />
				<span scomponent="label">Px</span>
			</div>
			<div scomponent="input-container">
				<label htmlFor="viewport-height-input">Height</label>
				<input placeholder="value" type="text" id="viewport-height-input" />
				<span scomponent="label">Px</span>
			</div>
			<div scomponent="input-container">
				<label htmlFor="viewport-height-input">Background</label>
				<input type="color" id="viewport-height-input" />
			</div>
		</div>
	);
};

const newProject = props => {

	const [selectedViewport, setSelectedViewport] = useState(null);

	const defaultVp = {
		token: uuid(),
		width: 1280,
		height: 720,
		background: "#fff"
	};

	const [viewports, setViewports] = useState([defaultVp]);

	const [vSection, setVSection] = useState("desktop")

	// useEffect(() => {
	// 	console.log(viewports.length)
	// }, [viewports]);

	return (
		<form component="form" form="newProject">
			<Header title="New Project">
				{
					["desktop", "mobile", "tablet"].map((device, deviceKey) => (
						<button type="button" key={deviceKey}>
							<p>{device}</p>
						</button>
					))
				}
			</Header>
			<div className="models"></div>
			<div className="settings">
				<div scomponent="input-container">
					<label htmlFor="newProject-title-input">Project Title</label>
					<input placeholder="project title.." type="text" id="newProject-title-input" />
				</div>
				<div className="viewports">
					<header>
						<p scomponent="label">Viewports</p>
						<button onClick={() => {
							if(viewports.length > 0) return setViewports(v => [...v, {
								...v[v.Length -1],
								token: uuid()
							}]);
							return setViewports(v => [...v, {
								...defaultVp,
								token: uuid()
							}]);
						}} type="button" scomponent="icon">
							<Icons.Add />
						</button>
					</header>
					<main>
						<div className="wrapper">
							{
								viewports.map((viewport, viewportKey) => (
									<Viewport delete={() => {
										const index = viewports.indexOf(viewport);
										// const v = viewports.splice(index, 1)
										console.log({index})
									}} key={viewportKey} {...{viewport}} />
								))
							}
						</div>
					</main>
				</div>
				<footer>
					<button type="button" scomponent="button">Close</button>
					<button type="submit" scomponent="button">Create</button>
				</footer>
			</div>
		</form>
	);
}

export {
	newProject
};