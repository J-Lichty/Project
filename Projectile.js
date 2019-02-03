class Projectile extends Entity {
    constructor(position, sprite, velocity, color, type) {
        super(position, sprite);
        this.acceleration = new Vector();
        this.color = color;
        this.velocity = velocity;
        this.type = type;
    }

    hit(mode, other) {
        // var explosion = new Effect(this.position, assetMgr.getSprite("mushroom"));
        // game.addEntity(explosion);
        var tempPos = this.position.clone();
        // tempPos.x -= 8;
        // tempPos.y -= 8;
        if (other != undefined) {
            tempPos.average(other, 2);
        }
        var that = this;
        mode.forEach( function(i) {
            var p = new Particles(tempPos, new Vector(that.velocity.x, that.velocity.y, -that.velocity.z));
            switch (i) {
                case "blood":
                    p.velocity.div(3);
                    // p.velocity.z *= .125;
                    p.preset("blood");
                    break;
                case "feathers":
                    p.velocity.div(2);
                    p.velocity.z *= 2;
                    p.preset("feathers");
                    break;
                case "fire":
                    p.preset("fire");
                    break;
                case "energy":
                    p.velocity.div(3);
                    p.velocity.z *= 10;
                    p.preset("energy");
                    break;
                default:
                    p.velocity.div(2);
                    p.velocity.z *= 5;
                    p.preset("ground");
                    break;
            }
            p.init();
        });
        game.remove(this);
    }

    update(dt) {
        this.elapsedTime += dt;
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.div(1.01);
        this.acceleration.subtract(this.acceleration);
        this.acceleration.z -= .125;

        if (this.position.z < 0) {
            this.hit(["energy", "ground"]);
        }
    }

    draw(ctx) {
        ctx.globalAlpha = 1;
        ctx.setTransform(1,0,0,1,0,0);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.position.z/16+1;
        ctx.beginPath();
        ctx.moveTo(this.position.x - this.velocity.x*this.position.z/6, this.position.y - this.velocity.y*this.position.z/6 - this.position.z);
        ctx.lineTo(this.position.x, this.position.y-this.position.z);
        ctx.stroke();


        ctx.globalAlpha = .5;
        ctx.strokeStyle = "#333";
        ctx.lineWidth = this.position.z/12;
        ctx.beginPath();
        ctx.moveTo(this.position.x - this.velocity.x, this.position.y - this.velocity.y);
        ctx.lineTo(this.position.x, this.position.y);
        ctx.stroke();
    }

}