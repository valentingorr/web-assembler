import React, {
	createContext
} from "react";

export const commands = createContext();
export const style = createContext();
export default props => {
	return (
		<commands.Provider value={props.commands}>
		<style.Provider value={props.STYLE}>
			{props.children}
		</style.Provider>
		</commands.Provider>
	);
};