import TimeService from 'services/timeService'

export default class Heart {
	private heart: Phaser.GameObjects.Image
	private heartCountdown: Phaser.GameObjects.Text
	private isHeartRecharged = true
	private scene: Phaser.Scene
	private playCount!: number

	constructor(scene: Phaser.Scene, x: number, y: number, heartIndex: number) {
		this.scene = scene
		// TODO: get playCount from backend
		this.playCount = Number(localStorage.getItem('playCount') ?? "")

		const timeService = new TimeService()
		const lastPlayTime = new Date(localStorage.getItem(`lastPlayTime${heartIndex}`) ?? '')
		this.isHeartRecharged = timeService.isRecharged(lastPlayTime)
		if (!this.isHeartRecharged) {
			const interval = setInterval(() => {
				const timeCoundown = timeService.getTimeCountdown(lastPlayTime)
				this.heartCountdown.setText(timeCoundown)
				this.isHeartRecharged = timeService.isRecharged(lastPlayTime)
				if (this.isHeartRecharged) {
					this.fillHeart()
					this.heartCountdown.setText("")
					clearInterval(interval)
				}
			})
		}

		this.heart = scene.add
			.image(x, y, 'landing_page', this.isHeartRecharged ? 'heart_full.png' : 'heart_empty.png')
			.setOrigin(0.5, 0)
		this.heartCountdown = scene.add
			.text(x, y + 92, `00:00:00`)
			.setOrigin(0.5, 0)
			.setVisible(!this.isHeartRecharged && this.playCount < 10)
	}

	getBody(): Phaser.GameObjects.Image {
		return this.heart
	}

	getIsRecharged(): boolean {
		return this.isHeartRecharged
	}
	
	initFontStyle() {
		this.heartCountdown
			.setStyle({
				fontFamily: 'Jua',
				color: '#DD2D04',
			})
			.setFontSize('24px')
			.setStroke('white', 3)
		this.heartCountdown
			.setStyle({
				fontFamily: 'Jua',
				color: '#DD2D04',
			})
			.setFontSize('24px')
			.setStroke('white', 3)
	}

	emptyHeart() {
		this.scene.tweens.add({
			targets: this.heart,
			alpha: 0,
			duration: 1000,
			onComplete: (_, targets) => {
				targets[0].setTexture('landing_page', 'heart_empty.png')
				this.scene.tweens.add({
					targets: targets[0],
					alpha: 1,
					duration: 500,
				})
			},
		})
	}

	fillHeart() {
		this.scene.tweens.add({
			targets: this.heart,
			alpha: 0,
			duration: 1000,
			onComplete: (_, targets) => {
				targets[0].setTexture('landing_page', 'heart_full.png')
				this.scene.tweens.add({
					targets: targets[0],
					alpha: 1,
					duration: 500,
				})
			},
		})
	}
}
