import React, {
	useState,
	useEffect
} from "react";

import {
	render
} from "react-dom";

import {
	createRoot
} from "react-dom/client";

import {
	HashRouter,
	Routes,
	Route
} from "react-router-dom";

import * as CONTEXT from "./context/index.jsx";
import { createStore } from "redux";
import {
	Provider,
	useSelector,
	useDispatch
} from "react-redux";

import reducers from "./redux/reducers.js";
import * as ACTIONS from "./redux/actions.js";

import * as STYLE from "./style/_config.scss";
import "./style/style.scss";

import { v4 as uuid } from "uuid";

//importing routes
import Home from "./routes/Home.jsx";
import Project from "./routes/Project.jsx";

//import Components
import TopBar from "./components/TopBar.jsx";
import ContextMenu from "./components/ContextMenu.jsx";
import * as FORMS from "./components/Forms.jsx";
import Notification from "./components/Notification.jsx";

const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const App = () => {

	const dispatch = useDispatch();

	const notifications = useSelector(state => state.notifications);
	const contextMenu = useSelector(state => state.contextMenu);

	const [newProjectForm, setNewProjectForm] = useState(!false);
	const [commands, setCommands] = useState([]);

	useEffect(() => {
		window.bridge.api.on("notification", (event, receive) => dispatch(ACTIONS.notifications.add({...receive, token: uuid()})));
		window.bridge.api.on("commands", (event, receive) => setCommands(receive));
		window.bridge.api.on("newProject", () => setNewProjectForm(true));
		(async () => {
			setCommands(await window.bridge.api.invoke("commands"));
		})();
	}, []);

	return (
		<CONTEXT.default {...{STYLE, commands}} >
			<TopBar />
			{
				contextMenu.items.length > 0 ?
					<ContextMenu menu={contextMenu} />
				: null
			}
			{
				notifications.length > 0 ?
					<div id="Notifications-container">
						{
							notifications.map((notification, notificationKey) => (
								<Notification key={notificationKey} {...{...notification}} />
							))
						}
					</div>
				: null
			}
			{
				newProjectForm ?
					<FORMS.newProject setNewProjectForm={setNewProjectForm} />
				: null
			}
			<Routes>
				<Route exact path="/" element={<Home />} />
				<Route path="/" element={<Project />} />
			</Routes>
		</CONTEXT.default>
	);
};

export default App;

createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<HashRouter>
			<App />
		</HashRouter>
	</Provider>
);