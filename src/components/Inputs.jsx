import React, {
	useState,
	useEffect
} from "react";

import { v4 as uuid } from "uuid";

import * as Icons from "./Icons.jsx";

const isInt = n => Number(n) === n && n % 1 === 0;
const isFloat = n => Number(n) === n && n % 1 !== 0;

const Value = props => {

	const token = uuid();

	const [value, setValue] = useState(props.default || 0);

	useEffect(() => {
		setValue(props.default);
	}, [props.default]);

	useEffect(() => props.onChange(value), [value]);

	return (
		<div scomponent="value-input">
			<label scomponent="label" htmlFor={`${token}-input`}>{props.label}</label>
			<div className="input">
				<input value={value} onChange={event => {
					setValue(event.target.value);
				}} type="number" />
				<section>
					<button onClick={() => {
						setValue(v => parseFloat(v) + 1.0);
					}} type="button" scomponent="icon">
						<Icons.FoldArrow />
					</button>
					<button onClick={() => {
						setValue(v => parseFloat(v) - 1.0);
					}} type="button" scomponent="icon">
						<Icons.FoldArrow />
					</button>
				</section>
			</div>
			{
				props.units.length === 1 ?
					<span scomponent="label" className="unit">{props.units[0]}</span>
				: null
			}
		</div>
	);
};

const Color = props => {

	const token = uuid();
	const [value, setValue] = useState(props.default || "#ffffff");

	useEffect(() => {
		setValue(props.default);
	}, [props.default]);

	return (
		<div scomponent="color-input">
			<label scomponent="label" htmlFor={`${token}-input`}>{props.label}</label>
			<div className="input">
				<input type="text" value={value} onChange={event => {}} />
				<button style={{
					backgroundColor: value
				}} type="button"></button>
			</div>
		</div>
	);
};

const Text = props => {

	const token = uuid();
	const [value, setValue] = useState(props.default || "");

	useEffect(() => {
		setValue(props.default);
	}, [props.default]);

	useEffect(() => props.onChange(value), [value]);

	return (
		<div scomponent="text-input">
			{
				props.label ?
					<label scomponent="label" htmlFor={`${token}-input`}>{props.label}</label>
				: null
			}
			<div className="input-wrapper">
				<input onChange={event => {
					setValue(event.target.value);
				}} value={value} type="text" scomponent="input" />
				<button onClick={() => setValue("")} type="button" scomponent="icon">
					<Icons.Cross />
				</button>
			</div>
		</div>
	);
}

export {
	Value,
	Color,
	Text
};