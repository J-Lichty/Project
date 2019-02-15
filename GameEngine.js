class GameEngine {
    constructor(ctx, worldWidth, worldHeight) {
        this.entities = [];
        this.ctx = ctx;
        this.lastFrame = 0;
        this.dt = 0;
        this.step = 1/60;
        this.viewWidth = ctx.canvas.width;
        this.viewHeight = ctx.canvas.height;
        this.player;
        this.viewAngle = 1;
        this.bounds = new Vector(worldWidth, worldHeight);
        this.view = new Vector();
        this.tree;
        this.toRemove = [];
        this.paused = false;
    }
    init() {
        console.log("Initialized");
        this.tree = new Quadtree(1, 0, 0, this.bounds.x, this.bounds.y, null);
        this.tree.init();
        // var ship = new Ship(assetMgr.getSprite("ship"), assetMgr.getAsset("shipShadow"));
        // this.addEntity(ship);
        
        this.player = new Player(new Vector(200,200,0), new Vector(), assetMgr.getSprite("scientist"),this.bounds);
        this.player.gun = new Weapon(game.player.position.clone());
        this.player.gun.preset("plasmaPistol");
        this.addEntity(this.player);
        this.addEntity(this.player.gun);

        window.requestAnimationFrame(game.gameLoop);
    }

    gameLoop() {
        if (!game.paused) { 
            var current = performance.now();
            game.dt += Math.min(.02, (current - game.lastFrame) / 1000);   // duration capped at 20ms
            while(game.dt > game.step) {
                game.dt -= game.step;
                game.update(game.step);
                game.draw(game.step);
            }
            game.lastFrame = current;
            window.requestAnimationFrame(game.gameLoop);
        }
    }

    update(dt) {
        controls.actions();
        this.tree.clear();
        terrain.update();
        var entitiesCount = this.entities.length;
        for (var i = entitiesCount-1; i >= 0; i--) {
            this.tree.insert(this.entities[i]);
        }
        for (var i = entitiesCount-1; i >= 0; i--) {
            this.entities[i].update(dt);    
        }
        while (this.toRemove.length > 0) {
            this.entities.splice(this.entities.indexOf(this.toRemove.pop()),1);
        }
    }

    draw(dt) {
        this.ctx.canvas.width = this.ctx.canvas.width;
        // terrain.draw(this.ctx);
        this.entities.sort(function(a,b) {return a.position.y-b.position.y});
        for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx, dt);
        }
        this.ctx.setTransform(1,0,0,1,0,0);
    }

    updateView() {
        this.view.x = (this.player.position.x - this.viewWidth*.5);
        this.view.y = (this.player.position.y - this.viewHeight*.5);
        var vx = -this.view.x;
        var vy = -this.view.y;
        if (vx < 0) vx += worldSize;
        if (vy < 0) vy += worldSize;
        this.ctx.canvas.style.backgroundPosition = vx + "px " + vy + "px";
    }

    pause() {
        this.paused = true;
        this.ctx.setTransform(1,0,0,1,0,0);
        this.ctx.globalAlpha = .5;
        this.ctx.fillStyle = "#333";
        this.ctx.fillRect(0,0, this.viewWidth, this.viewHeight);
        this.ctx.fillStyle = "#FFF";
        var text = this.ctx.measureText("PAUSED");
        this.ctx.fillText("PAUSED", (this.viewWidth - text.width)*.5 | 0, (this.viewHeight)*.33);
        text = this.ctx.measureText("- click to continue -");
        this.ctx.fillText("- click to continue -", (this.viewWidth - text.width)*.5 | 0, (this.viewHeight)*.33 + 15);
    }

    resume() {
        this.paused = false;
        this.ctx.globalAlpha = 1;
        window.requestAnimationFrame(game.gameLoop);
    }
 
    addEntity(entity) {
        console.log('added entity');
        this.entities.push(entity);
    }

    remove(entity) {
        this.toRemove.push(entity);
    }
}