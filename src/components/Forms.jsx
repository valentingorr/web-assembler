import React, {
	useState,
	useEffect,
	useRef
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

const newProject = props => {

	const dispatch = useDispatch();

	const defaultVp = {
		token: uuid(),
		width: 1280,
		height: 720,
		background: "#fff",
		name: "untitled"
	};

	const [selectedViewport, setSelectedViewport] = useState(null);
	const [title, setTitle] = useState("");
	const [viewports, setViewports] = useState([defaultVp]);
	const [vSection, setVSection] = useState("desktop");
	const [customViewports, setCustomViewports] = useState([]);
	const [models, setModels] = useState(Viewports.models);

	const vpActions = {
		delete: viewport => setViewports(v => v.filter(vp => vp.token !== viewport.token)),
		duplicate: viewport => setViewports(v => [...v, {
			...viewport,
			token: uuid()
		}]),
		save: async viewport => {
			await window.bridge.command("viewports")({ action: "save", viewport });
			setCustomViewports(await window.bridge.command("viewports")({ action: "get" }));
		}
	};

	useEffect(() => {
		(async () => {
			setCustomViewports(await window.bridge.command("viewports")({ action: "get" }));
		})();
		$(window).on("click", event => {
			if($(`form[form="newProject"]`).has(event.target).length === 0) {
				event.preventDefault();
			}
		})
	}, []);

	useEffect(() => setModels(m => {
		return { ...m, custom: customViewports };
	}), [customViewports]);

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
	}, [vSection, customViewports]);

	return (
		<form onSubmit={event => {
			event.preventDefault();
			window.bridge.command("projects")("new", { viewports, title });
			props.close();
		}} component="form" form="newProject">
			<Header title="New Project">
				{
					Object.keys(Viewports.models).filter(key => Viewports.models[key].length > 0).map((device, deviceKey) => (
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
							models[vSection].map((model, modelKey) => (
								<div
									cmenu={JSON.stringify(vSection === "custom")}
									onContextMenu={event => {
										if(vSection !== "custom") return;
										dispatch(ACTIONS.contextMenu.set({
											pos: [event.pageX, event.pageY],
											items: [
												{
													title: "Delete",
													icon: Icons.Delete,
													click: async () => {
														await window.bridge.command("viewports")({ action: "remove", id: model._id });
														setCustomViewports(await window.bridge.command("viewports")({ action: "get" }));
													}
												}
											]
										}));
									}}
									onClick={() => {
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
									}}
									className="model"
									key={modelKey}
								>
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
															title: "Save Viewport",
															icon: Icons.Save,
															click: () => vpActions.save(viewport)
														},
														{
															title: "Duplicate",
															icon: Icons.Duplicate,
															click: () => vpActions.duplicate(viewport)
														},
														{
															title: "Delete",
															icon: Icons.Delete,
															click: () => vpActions.delete(viewport)
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
													<Inputs.Text onChange={value => {
														setViewports(v => v.map(vp => {
															if(vp.token !== viewport.token) return vp;
															return {
																...vp,
																name: value
															};
														}))
													}} default={viewport.name === "" ? `untitled` : viewport.name} />
													<aside>
														<button description="save viewport" onClick={() => {
															vpActions.save(viewport);
														}} type="button" scomponent="icon">
															<Icons.Save />
														</button>
														<button description="duplicate viewport" onClick={() => {
															vpActions.duplicate(viewport);
														}} type="button" scomponent="icon">
															<Icons.Duplicate />
														</button>
														<button description="delete viewport" onClick={() => {
															vpActions.delete(viewport);
														}} type="button" scomponent="icon">
															<Icons.Delete />
														</button>
													</aside>
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
						<button onClick={() => props.close()} type="button" scomponent="button">Close</button>
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