import React, {
	useState,
	useEffect,
	useRef,
	useContext
} from "react";

import * as CONTEXT from "../context/index.jsx";

import {
	useSelector
} from "react-redux";

import $ from "jquery";

import Icon from "../assets/images/icon.png";
import foldArrowUrl, {
	ReactComponent as FoldArrowIcon
} from "../assets/icons/fold-arrow.svg";

const SubMenu = props => {

	const commands = useContext(CONTEXT.commands);
	// console.log({commands, subMenu: props.subMenu});

	const [selectedItem, setSelectedItem] = useState(null);

	return (
		<div className="submenu">
			{
				props.subMenu.map(subMenuItem => (
					<div
						onClick={() => {
							if(subMenuItem.hasOwnProperty("command")) window.bridge.command(subMenuItem.command.name)(...subMenuItem.command.args);
						}}
						onMouseEnter={() => setSelectedItem(subMenuItem.title)}
						className="item"
						key={subMenuItem.title}
					>
						<p>{subMenuItem.title}</p>
						{
							subMenuItem.hasOwnProperty("subMenu") ?
								<>
									<FoldArrowIcon />
									{ selectedItem === subMenuItem.title ? <SubMenu subMenu={subMenuItem.subMenu} /> : null }
								</>
							:
								<div className="binds-wrapper">
									{
										commands.find(({ name }) => name === subMenuItem.command.name) ?
											commands.find(({ name }) => name === subMenuItem.command.name).binds.map((bind, bindKey) => (
												<span key={bindKey} className="bind">{bind.replace(/CommandOrControl/, "ctrl")}</span>
											))
										: null
									}
								</div>
						}
					</div>
				))
			}
		</div>
	);
};

export default props => {

	const menuRef = useRef();
	const menu = useSelector(state => state.menu);

	const [selectedItem, setSelectedItem] = useState(null);

	useEffect(() => {
		$(window).on("click", event => {
			const selected = $(menuRef.current).find("> .item.selected");
			if(selected.length) {
				if($(selected.get(0)).has(event.target).length) return event.preventDefault();
				if($(menuRef.current).find(".item").has(event.target).length) return setSelectedItem($(event.target).parent(".item").attr("menutitle"));
				return setSelectedItem(null);
			} else {
				if($(menuRef.current).find(".item").has(event.target).length) return setSelectedItem($(event.target).parent(".item").attr("menutitle"));
			}
		});
	}, []);

	return (
		<div id="TopBar">
			<div className="frame">
				<img src={Icon} />
				<p className="title">
					web assembler
				</p>
			</div>
			<div className="menu" ref={menuRef}>
				{
					menu.map(menuItem => (
						<div key={menuItem.title} menutitle={menuItem.title} className={selectedItem === menuItem.title ? "item selected" : "item"}>
							<p>{menuItem.title}</p>
							{
								selectedItem === menuItem.title ?
									<SubMenu subMenu={menuItem.subMenu} />
								: null
							}
						</div>
					))
				}
			</div>
		</div>
	);
};