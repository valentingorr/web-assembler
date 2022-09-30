import {
	combineReducers
} from "redux";

export default combineReducers({
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
				console.log({ index });
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
								name: "newProject",
								args: []
							}
						},
						{
							title: "New Viewport",
							command: {
								name: "newViewport",
								args: []
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
					title: "Undo",
					command: {
						name: "undo",
						args: []
					}
				},
				{
					title: "Redo",
					command: {
						name: "redo",
						args: []
					}
				}
			]
		}
	], action) => {
		return state;
	}
});