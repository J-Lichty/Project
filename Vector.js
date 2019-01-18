class Vector {
    constructor(x, y) {
        if (arguments.length == 0) {
            this.x = 0;
            this.y = 0;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    add(vector) {
        if (vector instanceof Vector) {
            this.x += vector.x;
            this.y += vector.y;
        }
        return this;
    }

    subtract(vector) {
        if (vector instanceof Vector) {
            this.x -= vector.x;
            this.y -= vector.y;
            return this;
        }
    }

    div(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    limit(max) {
        var mag = this.magnitude();
        if (mag > max) this.div(mag/max);
        return this;
    }

    angle() {
        var a = Math.atan(this.y/this.x);
        if (this.x < 0) a += Math.PI;
        return a;
    }
    
    angleTo(vector) {
        if (vector instanceof Vector) {
            var a = Math.atan((vector.y - this.y)/(vector.x - this.x));
            if (vector.x < this.x) a += Math.PI;
            return a;
        }
    }

    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    MagnitudeSqrd() {
        return this.x * this.x + this.y * this.y;
    }

    equals(other) {
        if (!(other instanceof Vector)) return false;
        return (this.x == other && this.y == other.y);
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    static random(max) {
        if (max == undefined) max = 1;
        return new Vector((Math.random()*2-1)*max, (Math.random()*2-1)*max);
    }
    
    static zero() {
        return new Vector(0,0);
    }

    static distance(me, other) {
        return Math.sqrt(Math.pow(me.x - other.x, 2) + Math.pow(me.y - other.y, 2));
    }

    static distanceSqrd(me, other) {
        return Math.pow(me.x - other.x, 2) + Math.pow(me.y - other.y, 2);
    }
}