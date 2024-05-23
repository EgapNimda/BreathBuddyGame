import i18next from "i18next"

export default class editUsernamePopUp {
    private username : string | undefined

    private editNameForm : Phaser.GameObjects.DOMElement | undefined

    private blackWindow : Phaser.GameObjects.Shape | undefined
    private popUpBox : Phaser.GameObjects.Graphics | undefined

    private isPopUp = false

    constructor(scene : Phaser.Scene, username?: string) {
        const { width,height } = scene.scale
        this.username = username === undefined ? 'Player' : username

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
        // Set I18n text
        const editNameText = <Element>this.editNameForm.getChildByID('edit_your_name')
        editNameText.textContent = i18next.t('edit_your_name')

        const cancelText = <Element>this.editNameForm.getChildByID('cancel')
        cancelText.textContent = i18next.t('cancel')

        const submitText = <Element>this.editNameForm.getChildByID('submit')
        submitText.textContent = i18next.t('submit_edit')

        this.editNameForm.addListener('click')
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
        //this.setInteractiveOff()
        this.popUpBox?.clear()
        this.popUpBox?.setVisible(true)
        this.popUpBox?.fillStyle(0xffffff)
        this.popUpBox?.fillRoundedRect(72,345,576,590,48)
        this.editNameForm?.setVisible(true)
        this.blackWindow?.setVisible(true)

        // Set default value
        const namefieldValue = <Element>this.editNameForm?.getChildByName('namefield')
        namefieldValue.value = this.username

        this.isPopUp = true
    }

    closeEditNamePopUp() : void {
        //this.setInteractiveOn()
        this.blackWindow?.setVisible(false)
        this.popUpBox?.clear()
        this.popUpBox?.setVisible(false)

        this.isPopUp = false
    }

    updateUsername(newUsername : string) : void {
        this.username = newUsername
    }

    getUsername() : string {
        return this.username === undefined ? 'Player' : this.username
    }

    getIsPopUp() : boolean {
        return this.isPopUp
    }

    /*setInteractiveOn() : void {
        this.editNameIcon?.setInteractive().on('pointerdown', () => this.popUpEditName())
    }

    setInteractiveOff() : void {
        this.editNameIcon?.setInteractive().off('pointerdown')
    }

    setFont(style : any) : void {
        this.usernameText?.setStyle(style)
    }*/
}