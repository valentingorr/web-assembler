const proxy = new Proxy({
	ji: "huy",
	test: "fff"
}, {
	get(target, prop) {
		console.log(this.get(target, prop));
		return target[prop];
	}
});

proxy.ji