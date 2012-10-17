window["model.System"] = dojo.declare("model.System", null, {

	T : 0, // ms

	events : [], // {T: time, event}

	balls : [],
	edges : [],

	doStep : function(dT) {
		var iT = this.T + dT;
		var _T;
		var collisions = [];

		balls.every(function(ballA, k) {
			balls.every(function(ballB, l) {
				if ((_T = ballA.intersectWith(ballB)) <= iT) {
					if (_T < jT)
						collisions = [];
					collisions.push([ballA, ballB]);
					iT = _T;
				}
				return l < k;
			});

			edges.every(function(edge) {
				if ((_T = ballA.intersectWith(edge)) < iT) {
					if (_T < jT)
						collisions = [];
					collisions.push([ballA, edge]);
					iT = _T;
				}
				return true;
			});
		});

		dT = iT - this.dT;

		balls.every(function(ball) {
			ball.doStep(dT);
			return true;
		})

		collisions.every(function(collision) {
			collision[0].reflectFrom(collision[1]);
			return true;
		})

		return iT;
	},

	onBallBall : function(callback) {

	},

	onBallEdge : function(callback) {

	}

});

window["model.Edge"] = dojo.declare("model.Edge", null, {

	constructor : function(args) {
		dojo.safeMixin(this, args);
	}

});

window["model.OrderedHash"] = dojo.declare("model.Edge", null, {

	keys : [],
	values : {},

	put : function(key, value) {
		if (keys.length == 0)
			keys[0] = key;
		else
			for ( var i = 0; i < keys.length; i++)
				if (keys[i] < key && typeof key[i + 1] == "undefined" || key[i + 1] > key) {
					keys.splice(i + 1, 0, key);
				}

		values[key] = value;
	},

	get : function(key) {
		if (typeof values[key] != "undefined")
			return values[key];
		else
			for ( var i = 0; i < keys.length; i++)
				if (keys[i] > key && typeof key[i + 1] == "undefined" || key[i + 1] > key)
					return {
						upper : [keys[i + 1], values[keys[i + 1]]],
						lower : [keys[i], values[keys[i]]]
					};

	}

});

window["model.Ball"] = dojo.declare("model.Ball", null, {

	// all position and velocity changes in T
	constructor : function(args) {
		dojo.safeMixin(this, args);
		this._position = new model.OrderedHash();
		this._velocity = new model.OrderedHash();
	},

	updateVelocity : function(T, V) {
		this._velocity.put(T, V);
	},

	updatePosition : function(T, P) {
		this._position.put(T, V);
	},

	getVelocity : function(T) {
		var velocity = this._velocity.get(T);
		// / We do not interpolate velocity (yet)
		// if (!velocity.upper)
		return velocity.lower[1];
		// else {
		// return velocity.lower[1] + (velocity.upper[1] - velocity.lower[1]) *
		// ((T - velocity.lower[0]) / (velocity.upper[0] - velocity.lower[0]))
		// }
	},

	getPosition : function(T) {
		var position = this._position.get(T);
		var velocity = this.getVelocity(T);
		return VMath.add(position[1], VMath.scale(velocity, (T - position[0])))
	}

});