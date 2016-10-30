var x = exports;
var doc = document;

x.cls = function (sel, ctx) {
	return this.slice((ctx || doc).getElementsByClassName(sel));
};

x.on = function (el, events, cb) {
	events.split(' ').forEach(function (e) {
		el.addEventListener(e, cb);
	});
};

x.gen = function (num) {
	var data = [];
	for (var i = num; i; i--) {
		data.push({
			bin: new Date(Date.now() - (i * 3600000)),
			value: Math.random() * 5 | 0
		});
	}
	return data;
};

x.slice = function (list) {
	return [].slice.call(list);
}
