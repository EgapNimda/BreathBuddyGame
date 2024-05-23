import I18nSingleton from "i18n/I18nSingleton"

export default class characterSelectUi {
    private scene : Phaser.Scene | undefined
    // Characters
    // from database
    private charactersJSON = '{ "0" : {"name" : "นักผจญภัย", "frame" : "logo_setting_mc1.png", "unlocked" : true},"1" : {"name" : "นักเวทย์", "frame" : "logo_setting_mc2.png", "unlocked" : true },"2" : {"name" : "จอมโจร", "frame" : "logo_setting_mc3.png", "unlocked" : true}}'
    private characters = JSON.parse(this.charactersJSON)
    private charactersCount : number = Object.keys(this.characters).length

    private prevButton : Phaser.GameObjects.Shape | undefined
    private nextButton : Phaser.GameObjects.Shape | undefined
    
    private showingCharIndex = 0
    // private showingChar= this.characters[this.showingCharIndex]['frame']
    private showingCharImg : Phaser.GameObjects.Image | undefined
    private showingCharText : Phaser.GameObjects.Text | undefined

    private usingCharIndex : number | undefined // from database

    private characterBox: Phaser.GameObjects.Graphics | undefined

    private usingButton : Phaser.GameObjects.Graphics | undefined
    private useButton : Phaser.GameObjects.NineSlice | undefined
    private useText : Phaser.GameObjects.Text | undefined
    private usingText : Phaser.GameObjects.Text | undefined

    constructor(scene : Phaser.Scene, usingCharIndex?: number) {
        this.scene = scene
        this.usingCharIndex = usingCharIndex === undefined ? 0 : usingCharIndex
        const { width,height } = scene.scale

        const i18n = I18nSingleton.getInstance()

        // Character Select Box
        //this.characterBox = this.scene.add.rectangle( width/2, 504, 336, 120, 0x43A99E ).setOrigin(0.5,0) 
        this.characterBox = this.scene.add.graphics()
        this.characterBox.fillStyle(0x43A99E)
        this.characterBox.fillRoundedRect( width/2 -168, 504, 336, 120, 14 )

        // Arrows
        this.scene.add.image( 200, 564, 'sheet', "logo_setting_next.png" ).setOrigin(0,0.5)
        this.scene.add.image( 520, 564, 'sheet', "logo_setting_next.png" ).setFlipX(true).setOrigin(1,0.5)
        this.prevButton = this.scene.add.rectangle(192, 564, 50, 120,0xFFFFFF,0).setOrigin(0,0.5)
        this.nextButton = this.scene.add.rectangle(528, 564, 50, 120,0xFFFFFF,0).setOrigin(1,0.5)
        this.prevButton.setInteractive().on('pointerdown', () => this.charShift(-1)) // Make the functional button larger than arrow sprite
        this.nextButton.setInteractive().on('pointerdown', () => this.charShift(1))
        // Showing Character
        this.showingCharImg = this.scene.add.image( width/2, 504, 'sheet', this.characters[this.showingCharIndex]['frame']).setOrigin(0.5,0.5)
        // Character Text (Name)
        this.showingCharText = this.scene.add.text( width/2, 594 , this.characters[this.showingCharIndex]['name'])
            .setColor("#FFFFFF")
            .setStroke("#D35E24", 12)
            .setFontSize(32)
            .setPadding(0,20,0,10)
            .setOrigin(0.5)


        // Using Button
        this.usingButton = this.scene.add.graphics()
        this.usingButton.fillStyle(0xFFB996)
        this.usingButton.fillRoundedRect( width/2 - 168, 640, 336, 80, 14 )
        this.usingButton.lineStyle(3, 0xD35E24)
        this.usingButton.strokeRoundedRect( width/2 - 168, 640, 336, 80, 14 )

        // Use Button
        this.useButton = this.scene.add.nineslice( width/2 - 168, 640, "sheet", "button_hard.png", 336, 80 ).setOrigin(0,0)

        // set Button
        this.useButton.setInteractive().on('pointerdown', () => this.useChar())
        this.useText = i18n.createTranslatedText( scene, width/2, 680 -3, "use_button" )
            .setFontSize(32)
            .setPadding(0,20,0,10)
            .setStroke("#9E461B",6)
            .setColor("#FFFFFF")
            .setOrigin(0.5,0.5)

        this.usingText = i18n.createTranslatedText( scene, width/2, 680 -3, "using_button" )
            .setFontSize(32)
            .setPadding(0,20,0,10)
            .setStroke("#D35E24",6)
            .setColor("#FFFFFF")
            .setOrigin(0.5,0.5)
        // Initiate First Character
        this.charShift(0)
    }

    charShift(i : number) : void {
        this.showingCharIndex = (this.showingCharIndex + i + this.charactersCount ) % this.charactersCount // prevent negative number
        const { width,height } = this.scene!.scale

        // Set Showing Character
        if (this.characters[this.showingCharIndex]["unlocked"]) { // Unlocked Character
            // Character Text (Name)
            this.showingCharText?.setText(this.characters[this.showingCharIndex]['name'])
                .setStroke("#D35E24", 12)
                .setFontSize(32)

            // Character Img
            this.showingCharImg?.setTexture("sheet", this.characters[this.showingCharIndex]['frame']).clearTint()
            // Character Box
            this.characterBox?.fillStyle(0x43A99E) // Green Box
            this.characterBox?.fillRoundedRect( width/2 -168, 504, 336, 120, 14 )

            // Set Use Button
            this.useText?.setVisible(true)
                .on('pointerdown', () => this.useChar())
            if (this.showingCharIndex === this.usingCharIndex) { // Currently Using Character
                this.usingButton?.setVisible(true)
                this.useButton?.setVisible(false)
                this.useText?.setVisible(false)
                this.usingText?.setVisible(true)
            }
            else { // Other Characters
                this.usingButton?.setVisible(false)
                this.useButton?.setVisible(true)
                this.useButton?.setInteractive().on('pointerdown', () => this.useChar())
                this.useText?.setVisible(true)
                this.usingText?.setVisible(false)

            }
        }
        else { // Locked Character
            // Character Text (Name)
            this.showingCharText?.setText("ยังไม่ปลดล็อค")
                .setStroke("#58595B", 12)
                .setFontSize(32)
            // Character Img
            this.showingCharImg?.setTexture("sheet", this.characters[this.showingCharIndex]['frame']).setTintFill(0x000000)
            // Character Box
            this.characterBox?.fillStyle(0xACACAC) // Gray Box 
            this.characterBox?.fillRoundedRect( width/2 -168, 504, 336, 120, 14 )

            // Set Use Button
            this.useButton?.setInteractive().off('pointerdown')
            this.usingButton?.setVisible(false)
            this.useText?.setVisible(false)
            this.usingText?.setVisible(false)
            this.useButton?.setVisible(false)
        }
    
    }

    useChar() : void {
        this.usingCharIndex = this.showingCharIndex
        this.usingButton?.setVisible(true)
        this.useButton?.setVisible(false)
        this.useText?.setText("ใช้อยู่").setStroke('#D35E24', 6)
    }

    getUsingCharIndex() : number {
        return this.usingCharIndex === undefined ? -1 : this.usingCharIndex
    }

    setFont(style : any) : void {
        this.showingCharText?.setStyle(style)
        this.useText?.setStyle(style)
        this.usingText?.setStyle(style)
    }

    setInteractiveOff() : void {
        this.useButton?.setInteractive().off('pointerdown')
        this.prevButton?.setInteractive().off('pointerdown')
        this.nextButton?.setInteractive().off('pointerdown')
    }

    setInteractiveOn() : void {
        this.prevButton?.setInteractive().on( 'pointerdown', () => this.charShift(-1) )
        this.nextButton?.setInteractive().on( 'pointerdown', () => this.charShift(1) )
        if (this.characters[this.showingCharIndex]["unlocked"] && this.showingCharIndex != this.usingCharIndex) {
            this.useButton?.setInteractive().on( 'pointerdown', () => this.useChar() )
        }
    }
}