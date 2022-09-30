import React, {
	useEffect,
	useRef
} from "react";

import {
	useDispatch
} from "react-redux";
import * as ACTIONS from "../redux/actions.js";

import gsap from "gsap";

import * as Icons from "./Icons.jsx";

export default props => {

	const dispatch = useDispatch();

	const notificationRef = useRef();

	useEffect(() => {
		gsap.fromTo(notificationRef.current, {
			yPercent: 100,
			opacity: 0,
		}, {
			yPercent: 0,
			opacity: 1,
			duration: .1
		});
		setTimeout(() => {
			gsap.fromTo(notificationRef.current, {
				scale: 1,
				opacity: 1,
			}, {
				scale: .9,
				opacity: 0,
				duration: .3,
				onComplete: () => dispatch(ACTIONS.notifications.remove(props.token))
			});
		}, 2000);
	}, []);

	return (
		<div ref={notificationRef} type={props.type || "message"} component="notification">
			{
				{
					"message": <MessageNotificationIcon />,
					"error": <ErrorNotificationIcon />
				}[props.type || "message"]
			}
			<p>{props.message}</p>
		</div>
	);
};