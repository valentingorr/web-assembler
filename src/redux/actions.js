export const menu = state => {
	return { type: state };
};

export const notifications = {
	add: item => {
		return { type: "add", item };
	},
	remove: token => {
		return { type: "remove", token };
	}
};

export const contextMenu = {
	set: menu => {
		return { type: "set", menu };
	},
	hide: () => {
		return { type: "hide" };
	}
};