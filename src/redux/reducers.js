import {
	combineReducers
} from "redux";

export default combineReducers({
	form: (state = "", action) => {
		return action.type;
	},
	contextMenu: (state = { pos: [0, 0], items: [] }, action) => {
		switch(action.type) {
			case "set":
				return action.menu;
				break;
			case "hide":
				return { pos: [0, 0], items: [] };
				break;
		};
		return state;
	},
	notifications: (state = [], action) => {
		switch(action.type) {
			case "add":
				return [...state, action.item];
				break;
			case "remove":
				const index = state.indexOf(state.find(({ token }) => token === action.token));
				state = state.splice(index, 1);
				return state;
				break;
		};
		return state;
	},
	menu: (state = [
		{
			title: "File",
			subMenu: [
				{
					title: "New",
					subMenu: [
						{
							title: "New Project",
							command: {
								alias: "newProject",
								name: "form",
								args: ["newProject"]
							}
						}
					]
				}
			]
		},
		{
			title: "Edit",
			subMenu: [
				{
					title: "Settings",
					command: {
						name: "form",
						args: ["settings"]
					}
				}
			]
		}
	], action) => {
		return state;
	}
});