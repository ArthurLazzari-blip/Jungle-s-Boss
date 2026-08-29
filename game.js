class MenuScene extends Phaser.Scene{
    constructor(){ super("MenuScene"); }
    create(){ }
}

class GameScene extends Phaser.Scene{

    constructor(){
        super("GameScene");
    }

    init(data){
        this.isFreeMode = data.isFreeMode || false;

        if (this.isFreeMode) {
            this.lives = 1;
            this.levelData = FREE_MODE_LEVEL;
        } else {
            this.levelIndex = data.levelIndex || 0;
            this.levelData = LEVELS[this.levelIndex];
            this.lives = (this.levelIndex === 0 || data.lives === undefined) ? 5 : data.lives;
        }
    }

    preload(){
        this.load.image("pedra","Plataformas.jpg");
        this.load.image("fundo1","Fundo1.jpg");
        this.load.image("fundo2","Fundo2.jpg");
        this.load.image("monkeyko", "MONKEYKO.png");
        this.load.image("monkeykobrabo", "MONKEYKObrabo.png");
        this.load.image("monkeykodormindo", "MONKEYKOdormindo.png");
        this.load.image("banana", "Banana.png");
        this.load.image("bananadescascada", "Bananadescascada.png");
        this.load.image("chave", "Chave.png");
        
        //EFEITOS SONOROS
        this.load.audio("bananasound", "Bananasound.mp3");
        this.load.audio("keysound", "Keysound.mp3");
        this.load.audio("bossfall", "Bossfallsound.mp3");
        this.load.audio("bossshot", "Bossshotsound.mp3");
        this.load.audio("win", "Winsound.mp3");
        this.load.audio("gameoversound", "Gameoversound.mp3");

        //FOGO
        this.load.spritesheet("fogoanimado", "Fogoanimado.png", {
            frameWidth: 240,
            frameHeight: 320
        });
        
        //PLAYER
        this.load.spritesheet("playerSprite", "Player.png", {
            frameWidth: 123.3,
            frameHeight: 230
        });
    }   

    create(){
        if (!this.textures.exists("bananaFallback")) {
            let g = this.make.graphics({x: 0, y: 0, add: false});
            g.fillStyle(0xffd700, 1);
            g.fillCircle(15, 15, 12);
            g.generateTexture("bananaFallback", 30, 30);
        }

        if(this.levelData.backgroundKey && this.textures.exists(this.levelData.backgroundKey)){
            let bg = this.add.image(400, 300, this.levelData.backgroundKey);
            bg.setDepth(-1);
            let scale = Math.max(800 / bg.width, 600 / bg.height);
            bg.setScale(scale);
        } else {
            this.cameras.main.setBackgroundColor(this.levelData.background || "#2d3748");
        }

        this.score = 0;
        this.hasKey = false;
        this.levelComplete = false;

        this.spawnPoint = [this.levelData.playerStart[0], this.levelData.playerStart[1] - 20];

        this.scoreText = this.add.text(20, 20, "Bananas: 0", { fontSize:"24px", color:"#ffffff", stroke: '#000', strokeThickness: 4 });
        this.livesText = this.add.text(20, 50, "Vidas: " + this.lives, { fontSize:"24px", color:"#ff3333", stroke: '#000', strokeThickness: 4 });
        
        if (this.isFreeMode) {
            this.add.text(620, 20, "MODO LIVRE", { fontSize:"24px", color:"#ff9900", stroke: '#000', strokeThickness: 4 });
        } else {
            this.add.text(660, 20, "Fase "+(this.levelIndex+1), { fontSize:"22px", color:"#ffffff", stroke: '#000', strokeThickness: 4 });
        }

        this.platforms = this.physics.add.staticGroup();
        this.movingPlatforms = this.physics.add.group();
        let texPlat = this.textures.exists("pedra") ? "pedra" : "bananaFallback";

        this.levelData.platforms.forEach((p)=>{
            let plat = this.add.tileSprite(p.x, p.y, p.w, p.h, texPlat);
            if(texPlat === "pedra"){
                let escalaDesejada = 2 / plat.height; 
                plat.setTileScale(escalaDesejada, escalaDesejada);
            }
            if(p.move){
                this.physics.add.existing(plat);
                this.movingPlatforms.add(plat);
                plat.body.setImmovable(true);
                plat.body.allowGravity = false;
                plat.moveAxis = p.move.axis || "y";
                plat.moveSpeed = p.move.speed || 60;
                plat.moveDir = 1;
                let range = p.move.range || 60;
                if(plat.moveAxis === "y"){
                    plat.moveMin = p.y - range;
                    plat.moveMax = p.y + range;
                } else{
                    plat.moveMin = p.x - range;
                    plat.moveMax = p.x + range;
                }
            } else {
                this.platforms.add(plat);
            }
        });

        this.wall = null;
        if(this.levelData.box){
            let box = this.levelData.box;
            let ceiling = this.add.tileSprite(box.ceiling.x, box.ceiling.y, box.ceiling.w, box.ceiling.h, texPlat);
            this.platforms.add(ceiling);
            let wall = this.add.tileSprite(box.wall.x, box.wall.y, box.wall.w, box.wall.h, texPlat);
            this.platforms.add(wall);
            this.wall = this.add.tileSprite(box.wallKey.x, box.wallKey.y, box.wallKey.w, box.wallKey.h, texPlat);
            this.platforms.add(this.wall);
        }

        //OBSTÁCULO
        this.obstacles = this.physics.add.staticGroup();
        if (this.levelData.obstacles) {
            this.levelData.obstacles.forEach((o)=>{
                let fogo;
                if(this.textures.exists("fogoanimado")){
                    if(!this.anims.exists("queimar")){
                        this.anims.create({ 
                            key: "queimar", 
                            frames: this.anims.generateFrameNumbers("fogoanimado", { start: 0, end: 7 }), 
                            frameRate: 12, 
                            repeat: -1 
                        });
                    }
                    fogo = this.obstacles.create(o.x, o.y, "fogoanimado");
                    fogo.anims.play("queimar", true);

                    let width = o.w || 50;
                    let height = o.h || 50;
                    fogo.setDisplaySize(width, height);

                    fogo.body.setSize(width * 0.7, height * 0.8);
                    fogo.body.setOffset((fogo.width - (width * 0.7)) / 2, fogo.height - (height * 0.8));

                } else {
                    fogo = this.add.rectangle(o.x, o.y, o.w || 30, o.h || 30, 0xff0000);
                    this.physics.add.existing(fogo, true);
                    this.obstacles.add(fogo);
                }
                
                if(fogo.refreshBody) fogo.refreshBody();
            });
        }

        this.boss = null;
        this.bossProjectiles = null;
        this.bossTimer = null;
        this.bossPatternIndex = 0;

        if(this.levelData.boss){
            let b = this.levelData.boss;
            let desiredTex = b.texture || "monkeyko";
            let bossTex = this.textures.exists(desiredTex) ? desiredTex : "bananaFallback";
            
            this.boss = this.physics.add.sprite(b.x, b.y, bossTex);
            this.boss.setDisplaySize(b.w, b.h);
            this.bossDisplayW = b.w;
            this.bossDisplayH = b.h;
            this.boss.setImmovable(true);
            this.boss.body.allowGravity = false;

            if(b.move){
                this.boss.moveAxis = b.move.axis || "y";
                this.boss.moveDir = 1;
                this.boss.moveSpeedDown = b.move.speedDown || b.move.speed || 150;
                this.boss.moveSpeedUp = b.move.speedUp || b.move.speed || 150;
                let range = b.move.range || 100;
                if(this.boss.moveAxis === "y"){
                    this.boss.moveMin = b.y - range;
                    this.boss.moveMax = b.y + range;
                } else{
                    this.boss.moveMin = b.x - range;
                    this.boss.moveMax = b.x + range;
                }
            }

            this.bossMaxHealth = b.health || (this.levelData.parts ? this.levelData.parts.length : 5);
            this.bossHealth = this.bossMaxHealth;
            this.createBossHealthBar();
            this.bossProjectiles = this.physics.add.group();
            this.bossTimer = this.time.addEvent({ delay: b.fireInterval || 1500, loop: true, callback: ()=>{ this.bossFire(b); }, callbackScope: this });
        }

        //PLAYER SPRITE
        if (!this.anims.exists("andar")) {
            this.anims.create({
                key: "andar",
                frames: this.anims.generateFrameNumbers("playerSprite", { start: 0, end: 5 }),
                frameRate: 10,
                repeat: -1
            });
        }

        if (!this.anims.exists("pular")) {
            this.anims.create({
                key: "pular",
                frames: this.anims.generateFrameNumbers("playerSprite", { start: 12, end: 17 }),
                frameRate: 10,
                repeat: 0
            });
        }

        //PLAYER SPRITE
        this.player = this.physics.add.sprite(this.spawnPoint[0], this.spawnPoint[1], "playerSprite", 5);
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setDisplaySize(45, 60);

        // HITBOX
        this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.8);
        this.player.body.setOffset(this.player.width * 0.25, this.player.height * 0.2);

        this.parts = this.physics.add.group();
        
        if (this.isFreeMode) {
            this.spawnFreeModeBanana();
        } else if (this.levelData.boss) {
            this.bossPartIndex = 0;
            this.spawnBossPart(this.bossPartIndex);
        } else if (this.levelData.parts) {
            let bananaTex = this.textures.exists("banana") ? "banana" : "bananaFallback";
            this.levelData.parts.forEach((position)=>{
                let part = this.parts.create(position[0], position[1], bananaTex);
                part.setDisplaySize(30, 30);
                part.body.allowGravity = false;
            });
        }

        this.key = null;
        if(this.levelData.key){
            let keyTex = this.textures.exists("chave") ? "chave" : "bananaFallback";
            this.key = this.physics.add.sprite(this.levelData.key[0], this.levelData.key[1], keyTex);
            this.key.setDisplaySize(75, 75);
            this.key.body.allowGravity = false;
        }

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.movingPlatforms);
        this.physics.add.overlap(this.player, this.parts, this.collectPart, null, this);
        this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);

        if(this.key){ this.physics.add.overlap(this.player, this.key, this.collectKey, null, this); }
        if(this.bossProjectiles){ this.physics.add.overlap(this.player, this.bossProjectiles, this.hitBossProjectile, null, this); }
        if(this.boss){ this.physics.add.overlap(this.player, this.boss, this.hitObstacle, null, this); }

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    spawnFreeModeBanana() {
        if(!this.levelData.parts || this.levelData.parts.length === 0) return;
        
        let positions = this.levelData.parts;
        let randomIndex = Phaser.Math.Between(0, positions.length - 1);
        let chosenPos = positions[randomIndex];

        let bananaTex = this.textures.exists("banana") ? "banana" : "bananaFallback";
        let part = this.parts.create(chosenPos[0], chosenPos[1], bananaTex);
        part.setDisplaySize(30, 30);
        part.body.allowGravity = false;
    }

    spawnBossPart(index){
        if(!this.levelData.parts || index >= this.levelData.parts.length){ return; }
        let position = this.levelData.parts[index];
        let bananaTex = this.textures.exists("banana") ? "banana" : "bananaFallback";
        let part = this.parts.create(position[0], position[1], bananaTex);
        part.setDisplaySize(30, 30);
        part.body.allowGravity = false;
    }

    collectPart(player, part){
        part.destroy();
        this.score++;
        this.scoreText.setText("Bananas: " + this.score);

        if (this.cache.audio.exists("bananasound")) {
            this.sound.play("bananasound");
        }

        if (this.isFreeMode) {
            this.spawnFreeModeBanana();
            return;
        }

        if(this.levelData.boss){
            this.damageBoss();
            this.bossPartIndex++;
            if(this.levelData.parts && this.bossPartIndex < this.levelData.parts.length){
                this.spawnBossPart(this.bossPartIndex);
            }
            return;
        }

        if(this.levelData.parts && this.score == this.levelData.parts.length){
            this.add.text(250, 200, "VÁ PARA A DIREITA DA TELA!", { fontSize:"24px", color:"#00ff00", stroke: '#000', strokeThickness: 4 });
        }
    }

    collectKey(player, key){
        key.destroy();
        this.hasKey = true;

        if (this.cache.audio.exists("keysound")) {
            this.sound.play("keysound");
        }

        if(this.wall){ this.wall.destroy(); }
        this.add.text(250, 60, "PORTA DA CAIXA ABERTA!", { fontSize:"24px", color:"#00ffff", stroke: '#000', strokeThickness: 4 });
    }

    hitObstacle(player, obstacle){
        this.lives--;
        this.livesText.setText("Vidas: " + this.lives);

        if(this.lives <= 0){
            if (this.cache.audio.exists("gameoversound")) {
                this.sound.play("gameoversound");
            }

            if (this.isFreeMode) {
                if (typeof showGameOverScreen === 'function') {
                    showGameOverScreen(this.score);
                }
            } else {
                if (typeof showGameOverScreen === 'function') {
                    showGameOverScreen();
                }
            }
            this.scene.pause();
        } else {
            player.setVelocity(0,0);
            player.setPosition(this.spawnPoint[0], this.spawnPoint[1]);
        }
    }

    createBossHealthBar(){
        this.bossHealthBarWidth = 90;
        let barX = this.boss.x - this.bossHealthBarWidth / 2;
        let barY = this.boss.y - this.boss.displayHeight / 2 - 18;
        this.bossHealthBarLabel = this.add.text(barX, barY - 16, "MONKEYKO", { fontSize:"14px", color:"#ffffff" });
        this.bossHealthBarBg = this.add.rectangle(barX, barY, this.bossHealthBarWidth, 12, 0x333333).setOrigin(0,0.5);
        this.bossHealthBarFill = this.add.rectangle(barX, barY, this.bossHealthBarWidth, 12, 0xff3333).setOrigin(0,0.5);
    }

    updateBossHealthBarPosition(){
        if(!this.boss || !this.bossHealthBarBg){ return; }
        let barX = this.boss.x - this.bossHealthBarWidth / 2;
        let barY = this.boss.y - this.boss.displayHeight / 2 - 18;
        this.bossHealthBarBg.setPosition(barX,barY);
        this.bossHealthBarFill.setPosition(barX,barY);
        this.bossHealthBarLabel.setPosition(barX,barY - 16);
    }

    updateBossHealthBar(){
        if(!this.bossHealthBarFill){ return; }
        let pct = Math.max(this.bossHealth,0) / this.bossMaxHealth;
        this.bossHealthBarFill.setSize(this.bossHealthBarWidth * pct, this.bossHealthBarFill.height);
    }

    damageBoss(){
        if(!this.boss || !this.boss.active || this.levelComplete){ return; }
        this.bossHealth--;
        this.updateBossHealthBar();
        if(this.bossHealth <= 0){ this.defeatBoss(); }
    }

    defeatBoss(){
        if(this.bossTimer){ this.bossTimer.remove(); this.bossTimer = null; }
        if(this.bossProjectiles){ this.bossProjectiles.clear(true,true); }
        if(this.boss){ this.boss.destroy(); this.boss = null; }
        if(this.bossHealthBarBg){ this.bossHealthBarBg.destroy(); }
        if(this.bossHealthBarFill){ this.bossHealthBarFill.destroy(); }
        if(this.bossHealthBarLabel){ this.bossHealthBarLabel.destroy(); }
        this.add.text(220, 250, "MONKEYKO DERROTADO!", { fontSize:"32px", color:"#00ff00", stroke: '#000', strokeThickness: 5 });
        this.levelComplete = true;
        this.time.delayedCall(1200,()=>{ this.goToNextLevel(); });
    }

    bossGroundSlam(){
        if(this.player.body.touching.down){ this.player.setVelocityY(-220); }
        this.cameras.main.shake(200,0.006);

        if (this.cache.audio.exists("bossfall")) {
            this.sound.play("bossfall");
        }
    }

    setBossTexture(key){
        if(!this.boss || !this.textures.exists(key) || this.boss.texture.key === key){ return; }
        this.boss.setTexture(key);
        this.boss.setDisplaySize(this.bossDisplayW,this.bossDisplayH);
    }

    bossFire(bossData){
        if(!this.boss || !this.boss.active){ return; }
        let directions;
        if(bossData.patterns && bossData.patterns.length > 0){
            directions = bossData.patterns[this.bossPatternIndex % bossData.patterns.length];
            this.bossPatternIndex++;
        } else{
            directions = bossData.directions || [0,45,90,135,180,225,270,315];
        }
        let speed = bossData.projectileSpeed || 150;
        let size = bossData.projectileSize || 30;
        let projTex = this.textures.exists("bananadescascada") ? "bananadescascada" : "bananaFallback";
        
        if (this.cache.audio.exists("bossshot")) {
            this.sound.play("bossshot");
        }

        directions.forEach((angle)=>{
            let rad = Phaser.Math.DegToRad(angle);
            let proj = this.bossProjectiles.create(this.boss.x, this.boss.y, projTex);
            proj.setDisplaySize(size, size);
            proj.body.allowGravity = false;
            proj.setVelocity(Math.cos(rad) * speed, Math.sin(rad) * speed);
            this.time.delayedCall(4000,()=>{ if(proj && proj.active){ proj.destroy(); } });
        });
    }

    hitBossProjectile(player, projectile){
        projectile.destroy();
        this.hitObstacle(player, projectile);
    }

    goToNextLevel(){
        if (this.cache.audio.exists("win")) {
            this.sound.play("win");
        }

        let nextIndex = this.levelIndex + 1;
        if(LEVELS[nextIndex]){
            this.scene.start("GameScene",{ levelIndex: nextIndex, lives: this.lives });
        } else{
            if (typeof showVictoryScreen === 'function') { showVictoryScreen(); }
        }
    }

    update(){
        this.movingPlatforms.children.iterate((plat)=>{
            if(!plat){ return; }
            if(plat.moveAxis === "y"){
                plat.body.setVelocityY(plat.moveSpeed * plat.moveDir);
                if(plat.y <= plat.moveMin){ plat.moveDir = 1; }
                else if(plat.y >= plat.moveMax){ plat.moveDir = -1; }
            } else{
                plat.body.setVelocityX(plat.moveSpeed * plat.moveDir);
                if(plat.x <= plat.moveMin){ plat.moveDir = 1; }
                else if(plat.x >= plat.moveMax){ plat.moveDir = -1; }
            }
        });

        if(this.boss && this.boss.active && this.boss.moveAxis){
            if(this.boss.moveAxis === "y"){
                let speed = this.boss.moveDir === 1 ? this.boss.moveSpeedDown : this.boss.moveSpeedUp;
                this.boss.body.setVelocityY(speed * this.boss.moveDir);

                if(!this.isFreeMode) {
                    if(this.boss.moveDir === 1){ this.setBossTexture("monkeykobrabo"); } else{ this.setBossTexture("monkeyko"); }
                }

                if(this.boss.y <= this.boss.moveMin){ this.boss.moveDir = 1; }
                else if(this.boss.y >= this.boss.moveMax){
                    if(this.boss.moveDir === 1){ this.bossGroundSlam(); }
                    this.boss.moveDir = -1;
                }
            } else{
                let speed = this.boss.moveDir === 1 ? this.boss.moveSpeedDown : this.boss.moveSpeedUp;
                this.boss.body.setVelocityX(speed * this.boss.moveDir);

                if(this.boss.x <= this.boss.moveMin){ 
                    this.bossGroundSlam(); 
                    this.boss.moveDir = 1; 
                } else if(this.boss.x >= this.boss.moveMax){ 
                    this.bossGroundSlam(); 
                    this.boss.moveDir = -1; 
                }
            }
            this.updateBossHealthBarPosition();
        }

        //CONTROLE PLAYER SPRITE
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-180);
            this.player.setFlipX(true);

            if (this.player.body.touching.down) {
                this.player.anims.play("andar", true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(180);
            this.player.setFlipX(false);

            if (this.player.body.touching.down) {
                this.player.anims.play("andar", true);
            }
        } else {
            this.player.setVelocityX(0);

            if (this.player.body.touching.down) {
                this.player.anims.stop();
                this.player.setFrame(5);
            }
        }

        // 🦘 Pulo do Player
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-500);
            this.player.anims.play("pular", true);
        }

        if(!this.isFreeMode && !this.levelData.boss && this.levelData.parts && this.score == this.levelData.parts.length && !this.levelComplete){
            let winXThreshold = this.levelData.winX || 775;
            if(this.player.x >= winXThreshold){
                this.levelComplete = true;
                this.goToNextLevel();
            }
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width:800,
    height:600,
    parent: "game-container",
    physics:{
        default:"arcade",
        arcade:{ gravity:{y:800}, debug:false }
    },
    scene:[ MenuScene, GameScene ]
};

window.phaserGame = new Phaser.Game(config);