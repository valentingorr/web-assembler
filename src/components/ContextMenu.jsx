import React, {
	useEffect,
	useRef
} from "react";

import {
	useDispatch
} from "react-redux";
import * as ACTIONS from "../redux/actions.js";

import gsap from "gsap";
import $ from "jquery";

import DeleteIconUrl, {
	ReactComponent as DeleteIconIcon
} from "../assets/icons/delete.svg";

export default props => {

	const dispatch = useDispatch();
	const menuRef = useRef();

	useEffect(() => {
		$(menuRef.current).css({
			left: props.menu.pos[0],
			top: props.menu.pos[1]
		});
		$(window).on("click contextmenu", event => {
			switch(event.type) {
				case "click":
					if(!$(menuRef.current).has(event.target).length) return dispatch(ACTIONS.contextMenu.hide());
					break;
				case "contextmenu":
					if($("[cmenu]").has(event.target).length || JSON.parse($(event.target).attr("cmenu"))) {
						$(menuRef.current).css({
							left: event.pageX,
							top: event.pageY
						});
					} else {
						return dispatch(ACTIONS.contextMenu.hide());
					}
					break;
			}
		});
	}, []);

	return (
		<div ref={menuRef} id="ContextMenu" >
			{
				props.menu.items.map((menuItem, menuItemKey) => (
					<div
						onClick={menuItem.click}
						key={menuItemKey}
						className={`item${menuItem.hasOwnProperty("icon") ? " icon" : null}`}
					>
						{
							menuItem.hasOwnProperty("icon") ?
								{
									"delete": <DeleteIconIcon />
								}[menuItem.icon]
							: null
						}
						<p>{menuItem.title}</p>
					</div>
				))
			}
		</div>
	);
};