import React, {
	useState,
	useEffect
} from "react";

import {
	useDispatch
} from "react-redux";
import * as ACTIONS from "../redux/actions.js";

import { v4 as uuid } from "uuid";
import $ from "jquery";

import * as Icons from "./Icons.jsx";
import * as Inputs from "./Inputs.jsx";

import * as Viewports from "./Viewports.jsx";

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

// const Viewport = props => {

// 	const dispatch = useDispatch();

// 	return (
// 		<div cmenu="true" className="viewport" onContextMenu={event => {
// 			dispatch(ACTIONS.contextMenu.set({
// 				pos: [event.pageX, event.pageY],
// 				items: [
// 					{
// 						title: "Delete",
// 						icon: "delete",
// 						click: props.delete
// 					}
// 				]
// 			}));
// 		}}>
// 			<div scomponent="input-container">
// 				<label htmlFor="viewport-width-input">Width</label>
// 				<input placeholder="value" type="text" id="viewport-width-input" />
// 				<span scomponent="label">Px</span>
// 			</div>
// 			<div scomponent="input-container">
// 				<label htmlFor="viewport-height-input">Height</label>
// 				<input placeholder="value" type="text" id="viewport-height-input" />
// 				<span scomponent="label">Px</span>
// 			</div>
// 			<div scomponent="input-container">
// 				<label htmlFor="viewport-height-input">Background</label>
// 				<input type="color" id="viewport-height-input" />
// 			</div>
// 		</div>
// 	);
// };

const newProject = props => {

	const dispatch = useDispatch();

	const [selectedViewport, setSelectedViewport] = useState(null);

	const defaultVp = {
		token: uuid(),
		width: 1280,
		height: 720,
		background: "#fff",
		title: ""
	};

	const [title, setTitle] = useState("");
	const [viewports, setViewports] = useState([defaultVp]);
	const [vSection, setVSection] = useState("desktop")

	// useEffect(() => {
	// 	console.log(viewports)
	// }, [viewports]);

	useEffect(() => {
		document.querySelectorAll(".mockup[aspect]").forEach(el => {
			const maxPercent = .8;
			const size = el.getAttribute("aspect").split(":").map((axe, i) => {
				if(i === 0) return { axe: "width", value: parseInt(axe) };
				return { axe: "height", value: parseInt(axe) };
			}).sort((a, b) => b.value - a.value);
			const length = (el.parentElement[(size[0].axe === "height" ? "offsetHeight" : "offsetWidth")] * maxPercent);
			el.style[size[0].axe] = length + "px";
			el.style[size[1].axe] = (length * (size[1].value / size[0].value)) + "px";
		});
	}, [vSection]);

	return (
		<form component="form" form="newProject">
			<Header title="New Project">
				{
					Object.keys(Viewports.models).map((device, deviceKey) => (
						<button onClick={() => setVSection(device)} type="button" key={deviceKey} className={device === vSection ? "selected" : null}>
							<p>{device}</p>
						</button>
					))
				}
			</Header>
			<main>
				<aside className="models">
					<div className="wrapper">
						{
							Viewports.models[vSection].map((model, modelKey) => (
								<div onClick={() => {
									if(selectedViewport !== null) {
										return setViewports(v => v.map(vp => {
											if(vp.token !== selectedViewport) return vp;
											return {
												...vp,
												width: model.size[0],
												height: model.size[1]
											};
										}))
									} else {
										setViewports(v => [...v, {
											...defaultVp,
											width: model.size[0],
											height: model.size[1]
										}]);
									}
								}} className="model" key={modelKey}>
									<main>
										<div className="mockup" aspect={`${model.size[0]}:${model.size[1]}`}></div>
									</main>
									<footer>
										<p className="title">{model.name}</p>
										<p scomponent="label">{model.size[0]} x {model.size[1]}</p>
									</footer>
								</div>
							))
						}
					</div>
				</aside>
				<main>
					<main>
						<div scomponent="input-container">
							<label htmlFor="newProject-title-input">Project Title</label>
							<input value={title} onChange={event => setTitle(event.target.value)} placeholder="project title.." type="text" id="newProject-title-input" />
						</div>
						<div className="viewports">
							<header>
								<p scomponent="label">Viewports {viewports.length}</p>
								<button onClick={() => {
									if(viewports.length > 0) return setViewports(v => [...v, {
										...v[v.length - 1],
										token: uuid()
									}]);
									setViewports(v => [{
										...defaultVp,
										token: uuid()
									}])
								}} type="button" scomponent="icon">
									<Icons.Add />
								</button>
							</header>
							<main>
								<div className="wrapper">
									{
										viewports.map((viewport, viewportKey) => (
											<div
											cmenu="true"
											onContextMenu={event => {
												dispatch(ACTIONS.contextMenu.set({
													pos: [event.pageX, event.pageY],
													items: [
														{
															title: "Duplicate",
															icon: Icons.Duplicate,
															click: () => setViewports(v => [...v, {
																...viewport,
																token: uuid()
															}])
														},
														{
															title: "Delete",
															icon: Icons.Delete,
															click: () => setViewports(v => v.filter(vp => vp.token !== viewport.token))
														}
													]
												}));
											}}
											onClick={event => {
												if(
													!["svg", "input", "button"]
													.map(tag => event.target.tagName.toLowerCase() !== tag)
													.reduce((c, a) => c && a)
												) return;
												if(selectedViewport === viewport.token) return setSelectedViewport(null);
												setSelectedViewport(viewport.token);
											}} className={"viewport" + `${viewport.token === selectedViewport ? " selected" : ""}`} key={viewport.token}>
												<section>
													<Inputs.Text default={viewport.title === "" ? `viewport ${viewportKey}` : viewport.title} />
												</section>
												<Inputs.Value onChange={value => {
													setViewports(v => v.map(vp => {
														if(vp.token !== viewport.token) return vp;
														return {
															...vp,
															width: value
														};
													}))
												}} default={viewport.width} label="width" units={["px"]} />
												<Inputs.Value onChange={value => {
													setViewports(v => v.map(vp => {
														if(vp.token !== viewport.token) return vp;
														return {
															...vp,
															height: value
														};
													}))
												}} default={viewport.height} label="height" units={["px"]} />
												<Inputs.Color onChange={value => {
													setViewports(v => v.map(vp => {
														if(vp.token !== viewport.token) return vp;
														return {
															...vp,
															background: value
														};
													}))
												}} default={viewport.background} label="background" />
											</div>
										))
									}
								</div>
							</main>
						</div>
					</main>
					<footer>
						<button type="button" scomponent="button">Close</button>
						<button type="submit" scomponent="button">Create</button>
					</footer>
				</main>
			</main>
		</form>
	);
}

export {
	newProject
};