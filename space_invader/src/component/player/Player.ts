import {PLAYER_START_MARGIN, FULLCHARGE_SCALE, FULLCHARGE_ANIMATION_MS, PLAYER_SPEED} from "../../config";

export default class Player {

    private scene: Phaser.Scene
    private player!: Phaser.Physics.Arcade.Body | Phaser.GameObjects.GameObject | any
    private playerHitTweens!: any;

    constructor(scene: Phaser.Scene) {
        this.scene = scene
        const {width, height} = this.scene.scale
        this.player = this.scene.physics.add.image(width / 2, height - PLAYER_START_MARGIN, 'player')
        this.playerHitTweens = this.scene.tweens.add({
            targets: this.player,
            scale: FULLCHARGE_SCALE,
            duration: FULLCHARGE_ANIMATION_MS,
            ease: 'sine.inout',
            yoyo: true,
            repeat: -1
        })
        this.playerHitTweens.pause()
        this.player.setCollideWorldBounds(true)
    }

    create(): Phaser.Physics.Arcade.Body | Phaser.GameObjects.GameObject | any {

    }

    moveLeft(delta: number): void {
        this.player.x = this.player.x - ((PLAYER_SPEED * delta) / 1000)

    }

    moveRight(delta: number): void {
        this.player.x = this.player.x + ((PLAYER_SPEED * delta) / 1000)
    }

    getLaserLocation(): { x: number, y: number } {
        return {x: this.player.x, y: this.player.y - 20}
    }

    damaged(): void {
        this.playerHitTweens.restart()
        this.playerHitTweens.play()
        this.player.alpha = 0.8;
    }

    recovered(): void {
        this.player.alpha = 1;
        this.playerHitTweens.pause()
    }

    getPlayer(): Phaser.Physics.Arcade.Body | Phaser.GameObjects.GameObject | any {
        return this.player
    }
}