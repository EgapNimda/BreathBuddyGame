export default class usernameBox {
    private usernameBox : Phaser.GameObjects.Graphics | undefined
    private editNameForm : Phaser.GameObjects.DOMElement | undefined
    private usernameText : Phaser.GameObjects.Text | undefined
    private editNameIcon : Phaser.GameObjects.Image | undefined
    private username : string | undefined

    private blackWindow : Phaser.GameObjects.Shape | undefined
    private popUpBox : Phaser.GameObjects.Graphics | undefined

    constructor(scene : Phaser.Scene, editNameIcon : Phaser.GameObjects.Image, username?: string) {
        const { width,height } = scene.scale
        this.editNameIcon = editNameIcon
        this.username = username === undefined ? 'Player' : username

        // Username Box
        this.usernameBox = scene.add.graphics()
        this.usernameBox.fillStyle(0xFFFFFF)
        this.usernameBox.fillRoundedRect( width/2 - 168, 320, 336, 56, 14 )
        this.usernameBox.lineStyle(1, 0x727272)
        this.usernameBox.strokeRoundedRect( width/2 - 168, 320, 336, 56, 14 )

        // Edit Name Icon
        this.editNameIcon = scene.add.image(width - 192 - 20 , 320 + 28, 'sheet', "logo_setting_edit name.png")
            .setInteractive().on('pointerdown', () => this.popUpEditName())
            .setOrigin(1,0.5) // Guessed the coordinate

        // Username Text
        this.usernameText = scene.add.text(width/2, 320+28 ,this.username)
            .setColor("#57453B")
            .setPadding(0,20,0,10)
            .setFontSize(32)
            .setOrigin(0.5,0.5)

        // Black Screen When Pop Up
        this.blackWindow = scene.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0).setVisible(false)

        // Pop Up Box
        this.popUpBox = scene.add.graphics()
            .fillStyle(0xffffff)
            .setVisible(false)

        // Pop Up Form
        const self = this
        this.editNameForm = scene.add.dom( 72 + 48, 345 + 48 )
            .setOrigin(0,0)
            .createFromCache('editnameForm')
        this.editNameForm.on('click', function(event : any) {
            if(event.target.name === 'submit') {
                const inputUsername = self.editNameForm?.getChildByName('namefield')?.value
                if (inputUsername != ''){
                    self.updateUsername(inputUsername)
                }
                self.closeEditNamePopUp()
                self.editNameForm?.setVisible(false)
            }
            if(event.target.name === 'cancel'){
                
                self.closeEditNamePopUp()
                self.editNameForm?.setVisible(false)
            }
        })
        this.editNameForm.setVisible(false)
    }


    popUpEditName() : void {
        this.setInteractiveOff()
        this.popUpBox?.clear()
        this.popUpBox?.setVisible(true)
        this.popUpBox?.fillStyle(0xffffff)
        this.popUpBox?.fillRoundedRect(72,345,576,590,48)
        this.editNameForm?.setVisible(true)
        this.blackWindow?.setVisible(true)

        // Set default value
        const namefieldValue = <Element>this.editNameForm?.getChildByName('namefield')
        namefieldValue.value = this.username
    }

    closeEditNamePopUp() : void {
        this.setInteractiveOn()
        this.blackWindow?.setVisible(false)
        this.popUpBox?.clear()
        this.popUpBox?.setVisible(false)
    }

    updateUsername(newUsername : string) : void {
        this.username = newUsername
        this.usernameText?.setText(newUsername)
    }

    setInteractiveOn() : void {
        this.editNameIcon?.setInteractive().on('pointerdown', () => this.popUpEditName())
    }

    setInteractiveOff() : void {
        this.editNameIcon?.setInteractive().off('pointerdown')
    }
}