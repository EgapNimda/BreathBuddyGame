import Phaser from "phaser";
import { MARGIN, MEDIUM_FONT_SIZE, LARGE_FONT_SIZE } from 'config';
// TODO Import Webfontloader
import WebFont from 'webfontloader'

export default class SettingScene extends Phaser.Scene {
    // Characters
    private charactersFrames = ["logo_setting_mc1.png", "logo_setting_mc2.png", "logo_setting_mc3.png"]
    private characterNames = ["นักผจญภัย","นักเวทย์","จอมโจร"]
    private unlockedCharacters = [0,1] // from database

    private showingCharIndex = 0
    private showingChar= this.charactersFrames[this.showingCharIndex]
    private showingCharImg : Phaser.GameObjects.Image | undefined
    private showingCharText : Phaser.GameObjects.Text | undefined

    private usingCharIndex = 0 // from database

    private characterBox: Phaser.GameObjects.Shape | undefined

    private useButton : Phaser.GameObjects.Shape | undefined
    private useText : Phaser.GameObjects.Text | undefined

    //Difficulty
    private difficulty = 0 // from database

    private easyButton : Phaser.GameObjects.Image | undefined
    private mediumButton : Phaser.GameObjects.Image | undefined
    private hardButton : Phaser.GameObjects.Image | undefined

    private disableEasyButton : Phaser.GameObjects.Shape | undefined
    private disableMediumButton : Phaser.GameObjects.Shape | undefined
    private disableHardButton : Phaser.GameObjects.Shape | undefined

    constructor() {
        super('setting')
    }

    preload(){
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.atlas('sheet','assets/setting/setting_spritesheet.png','assets/setting/setting_spritesheet.json');

        this.load.image('bg','assets/setting/setting_bg.png')

        this.load.svg('alertGreen', 'assets/setting/logo_modal_alert_green.svg')
        this.load.svg('alertOrange', 'assets/setting/logo_modal_alert_orange.svg')
        this.load.svg('checked', 'assets/setting/logo_modal_checked.svg')
        this.load.svg('cliniflo', 'assets/setting/logo_modal_cliniflo.svg')
        this.load.svg('editAirflow', 'assets/setting/logo_modal_edit airflow.svg')
        this.load.svg('editName', 'assets/setting/logo_modal_edit name.svg')
    }

    create(){
        const { width, height } = this.scale
        
        this.add.tileSprite(0,0,width,height,'bg').setOrigin(0).setScrollFactor(0,0)
  

        // Headings
        this.add.image( width/2 , MARGIN, 'sheet', "logo_heading_setting.png" ).setOrigin(0.5,0)
        this.add.image( width/2, 169, 'sheet', 'heading_setting.png' ).setOrigin(0.5,0)
        // TODO Set Font
        this.add.text( width/2, 169, 'ตั้งค่าเกม' )
            .setFontSize(LARGE_FONT_SIZE)
            .setColor("orange")
            .setOrigin(0.5,0)

        // Username Box
        // TODO Rounded Rectangle
        this.add.rectangle( width/2, 320, 336, 56, 0xffffff ).setOrigin(0.5,0) 

        // Character Select Box
        this.characterBox = this.add.rectangle( width/2, 504, 336, 120, 0x43A99E ).setOrigin(0.5,0) 
        // Arrows
        this.useText?.setText("ใช้อยู่").setColor("#9E461B")
        this.add.image( 200, 564, 'sheet', "logo_setting_next.png" ).setOrigin(0,0.5)
        this.add.image( 520, 564, 'sheet', "logo_setting_next.png" ).setFlipX(true).setOrigin(1,0.5)
        const prevButton = this.add.rectangle(192, 564, 50, 120,0xffffff,0).setOrigin(0,0.5)
        const nextButton = this.add.rectangle(528, 564, 50, 120,0xffffff,0).setOrigin(1,0.5)
        prevButton.setInteractive().on('pointerdown', () => this.charShift(-1)) // Make the functional button larger than arrow sprite
        nextButton.setInteractive().on('pointerdown', () => this.charShift(1))
        // showing Character
        this.showingCharImg = this.add.image( width/2, 504, 'sheet', this.charactersFrames[this.showingCharIndex]).setOrigin(0.5,0.5)
        this.showingCharText = this.add.text( width/2, 604 , this.characterNames[this.showingCharIndex])
            .setFontSize(MEDIUM_FONT_SIZE)
            .setColor("#9E461B")
            .setOrigin(0.5)


        // Using, Used Button
        this.useButton = this.add.rectangle( width/2, 640, 336, 80, 0x9E461B ).setOrigin(0.5,0) 
        this.useButton.setInteractive().on('pointerdown', () => this.useChar())
        this.useText = this.add.text(width/2, 680, this.usingCharIndex == this.showingCharIndex ? "ใช้อยู่" : "ใช้")
            .setFontSize(MEDIUM_FONT_SIZE)
            .setColor("#9E461B")
            .setOrigin(0.5,0.5)
        

        // Airflow and Difficulty Box
        // TODO Fix Color
        this.add.rectangle( width/2, height - 512, 576, 448, 0xf5f4c6 ).setOrigin(0.5,0)

        // TODO Add Airflow Logo
        // Airflow Text
        this.add.text( width/2, 816, "ปริมาณอากาศ" )
            .setFontSize(MEDIUM_FONT_SIZE)
            .setColor("#57453B") 
            .setOrigin(0.5,0)

        this.add.text( width/2, 872, "*ปรับตามคำแนะนำของแพทย์เท่านั้น*" )
            .setColor("#D35E24")
            .setOrigin(0.5,0)

        // Airflow Box
        this.add.rectangle( width/2, 920, 328, 56, 0xffffff ).setOrigin(0.5,0)

        // Difficulty
        // TODO Add Difficulty Logo
        this.add.text( width/2, 1024, "ระดับความยาก")
            .setFont( MEDIUM_FONT_SIZE )
            .setColor("#57453B") 
            .setOrigin(0.5,0)

        // Difficulty Boxes
        // TODO Scale with nine slices
        this.easyButton = this.add.image(width/2 - 96, 1088, 'sheet', 'button_easy.png')
            .setScale(144/80,1)
            .setOrigin(1,0)
        this.mediumButton = this.add.image(width/2, 1088, 'sheet', 'button_medium.png')
            .setScale(144/80,1)
            .setOrigin(0.5,0)
        this.hardButton = this.add.image(width/2 + 96, 1088, 'sheet', 'button_hard.png')
            .setScale(144/80,1)
            .setOrigin(0,0)
        
        // Gray boxes
        this.disableEasyButton = this.add.rectangle(width/2 - 96, 1088, 144, 80, 0xC7BEB0).setOrigin(1,0)
        this.disableMediumButton = this.add.rectangle(width/2, 1088, 144, 80, 0xC7BEB0).setOrigin(0.5,0)
        this.disableHardButton = this.add.rectangle(width/2 + 96, 1088, 144, 80, 0xC7BEB0).setOrigin(0,0)
        // Set button in these gray boxes
        this.disableEasyButton.setInteractive().on('pointerdown', () => this.changeDifficulty(0))
        this.disableMediumButton.setInteractive().on('pointerdown', () => this.changeDifficulty(1))
        this.disableHardButton.setInteractive().on('pointerdown', () => this.changeDifficulty(2))
    }

    update() {
        console.log(this.usingCharIndex)
        

        // Set Showing Character
        if (this.unlockedCharacters.includes(this.showingCharIndex)) {
            // Unlocked Character
            this.showingCharText?.setText(this.characterNames[this.showingCharIndex])
            this.showingChar = this.charactersFrames[this.showingCharIndex]
            this.showingCharImg?.setTexture("sheet", this.showingChar).clearTint()
            this.characterBox?.setFillStyle(0x43A99E) // Green Box

            // Set Use Button
            this.useButton?.setVisible(true)
            this.useText?.setVisible(true)
            if (this.showingCharIndex === this.usingCharIndex) {
                this.useButton?.setFillStyle(0xFFB996)
                this.useText?.setText("ใช้อยู่").setColor("#9E461B")
            }
            else {
            this.useButton?.setFillStyle(0x9E461B)
            this.useText?.setText("ใช้").setColor("white")

        }
        }
        else {
            // Locked Character
            this.showingCharText?.setText("ยังไม่ปลดล็อค")
            this.showingChar = this.charactersFrames[this.showingCharIndex]
            this.showingCharImg?.setTexture("sheet", this.showingChar).setTintFill(0x000000)
            this.characterBox?.setFillStyle(0xACACAC) // Gray Box 

            // Set Use Button
            this.useButton?.setInteractive().off('pointerdown')
            this.useButton?.setVisible(false)
            this.useText?.setVisible(false)
        }
        


        // Set Difficulty
        if (this.difficulty === 0) {
            this.disableEasyButton?.setVisible(false)
            this.disableMediumButton?.setVisible(true)
            this.disableHardButton?.setVisible(true)
        }
        if (this.difficulty === 1) {
            this.disableEasyButton?.setVisible(true)
            this.disableMediumButton?.setVisible(false)
            this.disableHardButton?.setVisible(true)
        }
        if (this.difficulty === 2) {
            this.disableEasyButton?.setVisible(true)
            this.disableMediumButton?.setVisible(true)
            this.disableHardButton?.setVisible(false)
        }
    }
    
    charShift(i : number){
        this.showingCharIndex = (this.showingCharIndex + i + this.charactersFrames.length ) % this.charactersFrames.length // prevent negative number
    
    }

    useChar(){
        this.usingCharIndex = this.showingCharIndex
    
    }

    changeDifficulty(x : number) {
        this.difficulty = x
    }
}