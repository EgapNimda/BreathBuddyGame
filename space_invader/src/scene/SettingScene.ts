import Phaser from "phaser";
import { MARGIN, MEDIUM_FONT_SIZE, LARGE_FONT_SIZE } from 'config';
// TODO Import Webfontloader
import WebFont from 'webfontloader'

export default class SettingScene extends Phaser.Scene {
    // Username Box
    private usernameBox : Phaser.GameObjects.Graphics | undefined
    private editNameForm : Phaser.GameObjects.DOMElement | undefined

    // Characters
    /*private charactersFrames = ["logo_setting_mc1.png", "logo_setting_mc2.png", "logo_setting_mc3.png"]
    private characterNames = ["นักผจญภัย","นักเวทย์","จอมโจร"]*/
    private unlockedCharacters = [0, 1] // from database
    private charactersJSON = '{ "0" : {"name" : "นักผจญภัย", "frame" : "logo_setting_mc1.png"},"1" : {"name" : "นักเวทย์", "frame" : "logo_setting_mc2.png"},"2" : {"name" : "จอมโจร", "frame" : "logo_setting_mc3.png"}}'
    private characters = JSON.parse(this.charactersJSON)
    private charactersCount : number = Object.keys(this.characters).length

    private showingCharIndex = 0
    private showingChar= this.characters[this.showingCharIndex]['frame']
    private showingCharImg : Phaser.GameObjects.Image | undefined
    private showingCharText : Phaser.GameObjects.Text | undefined

    private usingCharIndex = 0 // from database

    private characterBox: Phaser.GameObjects.Graphics | undefined

    private usingButton : Phaser.GameObjects.Graphics | undefined
    private useButton : Phaser.GameObjects.NineSlice | undefined
    private useText : Phaser.GameObjects.Text | undefined
    private showUseButton : boolean | undefined

    // Airflow Box
    private airflowBox : Phaser.GameObjects.Graphics | undefined

    //Difficulty
    private difficulty = 0 // from database

    private easyButton : Phaser.GameObjects.NineSlice | undefined
    private mediumButton : Phaser.GameObjects.NineSlice | undefined
    private hardButton : Phaser.GameObjects.NineSlice | undefined

    private disableEasyButton : Phaser.GameObjects.Graphics | undefined
    private disableMediumButton : Phaser.GameObjects.Graphics| undefined
    private disableHardButton : Phaser.GameObjects.Graphics | undefined

    private easyText : Phaser.GameObjects.Text | undefined
    private mediumText : Phaser.GameObjects.Text | undefined
    private hardText : Phaser.GameObjects.Text | undefined

    // from database
    private username : string | undefined
    private airflow : number | undefined

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

        this.load.html('editnameForm', 'html/setting/editname.html')
        this.load.html('editairflowForm', 'html/setting/editairflow.html')
    }

    create(){
        const { width, height } = this.scale
        this.username = "น้องออนิว" // change later
        this.airflow = 100 // change later
        
        this.add.tileSprite(0,0,width,height,'bg').setOrigin(0).setScrollFactor(0,0)
  

        // Headings
        this.add.image( width/2 , MARGIN, 'sheet', "logo_heading_setting.png" ).setOrigin(0.5,0)
        this.add.image( width/2, 169, 'sheet', 'heading_setting.png' ).setOrigin(0.5,0)
        this.add.text( width/2, 190, 'ตั้งค่าเกม' )
            .setFontSize(42)
            .setColor("#FFFFFF")
            .setStroke("#9E461B", 3)
            .setOrigin(0.5,0)

        // Username Box
        this.usernameBox = this.add.graphics()
        this.usernameBox.fillStyle(0xFFFFFF)
        this.usernameBox.fillRoundedRect( width/2 - 168, 320, 336, 56, 14 )
        this.usernameBox.lineStyle(1, 0x727272)
        this.usernameBox.strokeRoundedRect( width/2 - 168, 320, 336, 56, 14 )
        
        

        // Edit Name Icon
        this.add.image(width - 192 - 20 , 320 + 28, 'sheet', "logo_setting_edit name.png")
            .setInteractive().on('pointerdown', () => this.popUpEditName())
            .setOrigin(1,0.5) // Guessed the coordinate
        // Pop Up Form
        this.editNameForm = this.add.dom( width/2, 345 + 295 ).createFromCache('editnameForm')
        let element = this.editNameForm
        element.addListener('click');

        this.editNameForm.setVisible(false)

        // Username Text
        this.add.text(width/2, 320+28,this.username)
            .setColor("#57453B")
            .setFontSize(32)
            .setOrigin(0.5,0.5)

        // Character Select Box
        //this.characterBox = this.add.rectangle( width/2, 504, 336, 120, 0x43A99E ).setOrigin(0.5,0) 
        this.characterBox = this.add.graphics()
        this.characterBox.fillStyle(0x43A99E)
        this.characterBox.fillRoundedRect( width/2 -168, 504, 336, 120, 14 )
        // Arrows
        this.add.image( 200, 564, 'sheet', "logo_setting_next.png" ).setOrigin(0,0.5)
        this.add.image( 520, 564, 'sheet', "logo_setting_next.png" ).setFlipX(true).setOrigin(1,0.5)
        const prevButton = this.add.rectangle(192, 564, 50, 120,0xFFFFFF,0).setOrigin(0,0.5)
        const nextButton = this.add.rectangle(528, 564, 50, 120,0xFFFFFF,0).setOrigin(1,0.5)
        prevButton.setInteractive().on('pointerdown', () => this.charShift(-1)) // Make the functional button larger than arrow sprite
        nextButton.setInteractive().on('pointerdown', () => this.charShift(1))
        // Showing Character
        this.showingCharImg = this.add.image( width/2, 504, 'sheet', this.characters[this.showingCharIndex]['frame']).setOrigin(0.5,0.5)
        // Character Text (Name)
        this.showingCharText = this.add.text( width/2, 604 , this.characters[this.showingCharIndex]['name'])
            .setColor("#FFFFFF")
            .setStroke("#9E461B", 6)
            .setFontSize(32)
            .setOrigin(0.5)


        // Using Button
        this.usingButton = this.add.graphics()
        this.usingButton.fillStyle(0xFFB996)
        this.usingButton.fillRoundedRect( width/2 - 168, 640, 336, 80, 14 )
        this.usingButton.lineStyle(3, 0xD35E24)
        this.usingButton.strokeRoundedRect( width/2 - 168, 640, 336, 80, 14 )

        // Use Button
        this.useButton = this.add.nineslice( width/2 - 168, 640, "sheet", "button_hard.png", 336, 80 ).setOrigin(0,0)

        // set Button
        this.useButton.setInteractive().on('pointerdown', () => this.useChar())
        this.useText = this.add.text(width/2, 680, this.usingCharIndex == this.showingCharIndex ? "ใช้อยู่" : "ใช้")
            .setFontSize(MEDIUM_FONT_SIZE)
            .setStroke("#9E461B",3)
            .setColor("#FFFFFF")
            .setOrigin(0.5,0.5)
        

        // Airflow and Difficulty Box
        // this.add.rectangle( width/2, height - 512, 576, 448, 0xFFF6E5 ).setOrigin(0.5,0)
        const bigBox = this.add.graphics()
        bigBox.fillStyle(0xFFF6E5)
        bigBox.fillRoundedRect( width/2 - 288, height - 512, 576, 448, 40 )
        bigBox.lineStyle(5,0xD35E24)
        bigBox.strokeRoundedRect( width/2 - 288, height - 512, 576, 448, 40 )

        // Airflow Text
        this.add.image(216, 816, 'sheet', 'logo_setting_airflow.png').setOrigin(0,0) // Icon
        this.add.text( 216 + 59 + 13, 816, "ปริมาณอากาศ" )
            .setFontSize(MEDIUM_FONT_SIZE)
            .setColor("#57453B") 
            .setOrigin(0,0)

        this.add.text( width/2, 872, "*ปรับตามคำแนะนำของแพทย์เท่านั้น*" )
            .setColor("#D35E24")
            .setOrigin(0.5,0)

        // Airflow Box
        //this.add.rectangle( width/2, 920, 328, 56, 0xFFFFFF ).setOrigin(0.5,0)
        this.airflowBox = this.add.graphics()
        this.airflowBox.fillStyle(0xFFFFFF)
        this.airflowBox.fillRoundedRect( width/2 - 164, 920, 328, 56 )
        this.airflowBox.lineStyle(1, 0x727272)
        this.airflowBox.strokeRoundedRect( width/2 - 164, 920, 328, 56 )
        this.add.image(width/2 + 164 - 20, 920 + 28, "sheet", "logo_setting_edit airflow.png").setOrigin(1,0.5) // Guessed the coordinate

        // Airflow Number
        this.add.text(width/2, 920 + 28, this.airflow.toString())
            .setFontSize(32)
            .setColor("#57453B")
            .setOrigin(0.5,0.5)

        // Difficulty
        // TODO Add Difficulty Logo
        this.add.image( 216, 1024, 'sheet', 'logo_setting_difficulty.png').setOrigin(0,0)
        this.add.text( 216+59+13, 1024, "ระดับความยาก")
            .setFont( MEDIUM_FONT_SIZE )
            .setColor("#57453B") 
            .setOrigin(0,0)

        // Difficulty Boxes
        this.easyButton = this.add.nineslice(width/2 - 96, 1088, 'sheet', 'button_easy.png',144,80).setOrigin(1,0)
        this.mediumButton = this.add.nineslice(width/2, 1088, 'sheet', 'button_medium.png',144,80).setOrigin(0.5,0)
        this.hardButton = this.add.nineslice(width/2 + 96, 1088, 'sheet', 'button_hard.png',144,80).setOrigin(0,0)
        
        // Gray boxes
        // Easy
        this.disableEasyButton = this.add.graphics()
        this.disableEasyButton.fillStyle(0xC7BEB0)
        this.disableEasyButton.fillRoundedRect(120, 1088, 144, 80, 14)

        // Medium
        this.disableMediumButton = this.add.graphics()
        this.disableMediumButton.fillStyle(0xC7BEB0)
        this.disableMediumButton.fillRoundedRect(288, 1088, 144, 80, 14)

        // Hard
        this.disableHardButton = this.add.graphics()
        this.disableHardButton.fillStyle(0xC7BEB0)
        this.disableHardButton.fillRoundedRect(456, 1088, 144, 80, 14)

        // Set button in these gray boxes
        this.disableEasyButton.setInteractive( new Phaser.Geom.Rectangle(120, 1088, 144, 80), Phaser.Geom.Rectangle.Contains )
            .on('pointerdown', () => this.changeDifficulty(0))
        this.disableMediumButton.setInteractive( new Phaser.Geom.Rectangle(288, 1088, 144, 80), Phaser.Geom.Rectangle.Contains )
            .on('pointerdown', () => this.changeDifficulty(1))
        this.disableHardButton.setInteractive( new Phaser.Geom.Rectangle(456, 1088, 144, 80), Phaser.Geom.Rectangle.Contains )
            .on('pointerdown', () => this.changeDifficulty(2))

        // Difficulty Texts
        this.easyText = this.add.text( width/2 - 168, 1088 + 40, "ง่าย")
            .setFontSize(28)
            .setOrigin(0.5,0.5)
        this.mediumText = this.add.text( width/2, 1088 + 40, "ปานกลาง")
            .setFontSize(28)
            .setOrigin(0.5,0.5)
        this.hardText = this.add.text( width/2 + 168, 1088 + 40, "ยาก")
            .setFontSize(28)
            .setOrigin(0.5,0.5)

        // Set font for all texts
        const self = this
        WebFont.load({
            google: {
              families: ['Mali']
            },
            active: function() {
              const menuUiStyle = {
                fontFamily: 'Mali-bold'
              }
              self.showingCharText?.setStyle(menuUiStyle)
            }
          });
    }

    update() {
        const { width,height } = this.scale

        // Set Showing Character
        if (this.unlockedCharacters.includes(this.showingCharIndex)) { // Unlocked Character
            // Character Text (Name)
            this.showingCharText?.setText(this.characters[this.showingCharIndex]['name'])
                .setStroke("#9E461B", 6)
                .setFontSize(32)

            // Character Img
            this.showingChar = this.characters[this.showingCharIndex]['frame']
            this.showingCharImg?.setTexture("sheet", this.showingChar).clearTint()
            // Character Box
            this.characterBox?.fillStyle(0x43A99E) // Green Box
            this.characterBox?.fillRoundedRect( width/2 -168, 504, 336, 120, 14 )

            // Set Use Button
            this.useText?.setVisible(true)
                .on('pointerdown', () => this.useChar())
            if (this.showingCharIndex === this.usingCharIndex) { // Currently Using Character
                this.usingButton?.setVisible(true)
                this.useButton?.setVisible(false)
                this.useText?.setText("ใช้อยู่")
            }
            else { // Other Characters
                this.usingButton?.setVisible(false)
                this.useButton?.setVisible(true)
                this.useButton?.setInteractive().on('pointerdown', () => this.useChar())
                this.useText?.setText("ใช้")

            }
        }
        else { // Locked Character
            // Character Text (Name)
            this.showingCharText?.setText("ยังไม่ปลดล็อค")
                .setStroke("#58595B", 6)
                .setFontSize(32)
            // Character Img
            this.showingChar = this.characters[this.showingCharIndex]['frame']
            this.showingCharImg?.setTexture("sheet", this.showingChar).setTintFill(0x000000)
            // Character Box
            this.characterBox?.fillStyle(0xACACAC) // Gray Box 
            this.characterBox?.fillRoundedRect( width/2 -168, 504, 336, 120, 14 )

            // Set Use Button
            this.useButton?.setInteractive().off('pointerdown')
            this.usingButton?.setVisible(false)
            this.useText?.setVisible(false)
            this.useButton?.setVisible(false)
        }
        


        // Set Difficulty
        if (this.difficulty === 0) { // Easy
            // Set Button
            this.disableEasyButton?.setVisible(false)
            this.disableMediumButton?.setVisible(true)
            this.disableHardButton?.setVisible(true)

            // Set Text
            this.easyText?.setStroke("#327F76", 3)
            this.mediumText?.setStroke("#BF7F03", 0)
            this.hardText?.setStroke("#9E461B", 0)
        }
        if (this.difficulty === 1) { // Medium
            this.disableEasyButton?.setVisible(true)
            this.disableMediumButton?.setVisible(false)
            this.disableHardButton?.setVisible(true)

            // Set Text
            this.easyText?.setStroke("#327F76", 0)
            this.mediumText?.setStroke("#BF7F03", 3)
            this.hardText?.setStroke("#9E461B", 0)
        }
        if (this.difficulty === 2) { // Hard
            this.disableEasyButton?.setVisible(true)
            this.disableMediumButton?.setVisible(true)
            this.disableHardButton?.setVisible(false)

            // Set Text
            this.easyText?.setStroke("#327F76", 0)
            this.mediumText?.setStroke("#BF7F03", 0)
            this.hardText?.setStroke("#9E461B", 3)
        }
    }
    
    charShift(i : number){
        this.showingCharIndex = (this.showingCharIndex + i + this.charactersCount ) % this.charactersCount // prevent negative number
    
    }

    useChar(){
        this.usingCharIndex = this.showingCharIndex
    }

    changeDifficulty(x : number) {
        this.difficulty = x
    }

    popUpEditName() {
        this.editNameForm?.setVisible(true)
    }
}