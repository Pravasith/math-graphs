let vector = {
    _x : 1,
    _y : 0,

    create: (x, y) => {
        const obj = Object.create(this)
        obj.setX = x
        obj.setY = y
        return obj
    },

    setX: value => {
        this._x = value
    },

    getX: () => {
        return this._x
    },

    setY: value => {
        this._y = value
    },

    getY: () => {
        return this._y
    },
 
    setAngle: angle => {
        let length = this.getLength()
        this._x = Math.cos(angle) * length
        this._y = Math.cos(angle) * length
    },

    getAngle: () => {
        return Math.atan2(this._y, this._x)
    },

    setLength: (length) => {
        let angle = this.getAngle()
        this._x = Math.cos(angle) * length
        this._y = Math.cos(angle) * length
    },

    getLength: () => {
        return Math.sqrt(this._x * this._x + this._y * this._y)
    },

    add: (v2) => {
        return this.create((this._x + v2.getX, this._y + v2.getY))
    },

    sub: (v2) => {
        return this.create((this._x - v2.getX, this._y - v2.getY))
    },

    mul: (scalar) => {
        return this.create((this._x * scalar, this._y * scalar))
    },

    div: (scalar) => {
        return this.create((this._x / scalar, this._y / scalar))
    },
}
