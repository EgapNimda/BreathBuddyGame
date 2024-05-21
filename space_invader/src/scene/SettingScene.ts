import Phaser from "phaser";
import { MARGIN } from 'config';
// TODO Import Webfontloader
import WebFont from 'webfontloader'
import characterSelectUi from "component/setting/characterSelectUi";

export default class SettingScene extends Phaser.Scene {
    // Heading
    private headingText : Phaser.GameObjects.Text | undefined
    // Username Box
    private usernameBox : Phaser.GameObjects.Graphics | undefined
    private editNameForm : Phaser.GameObjects.DOMElement | undefined
    private usernameText : Phaser.GameObjects.Text | undefined

    private airflowText: Phaser.GameObjects.Text | undefined
    private medicalAdviceText : Phaser.GameObjects.Text | undefined

    // Character Select
    private characterSelectUi : characterSelectUi | undefined

    // Airflow Box
    private airflowBox : Phaser.GameObjects.Graphics | undefined

    //Difficulty
    private difficulty = 0 // from database

    private difficultyText : Phaser.GameObjects.Text | undefined

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

    private blackWindow : Phaser.GameObjects.Shape | undefined

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
        this.username = "น้องราคูนี่" // change later
        this.airflow = 100 // change later
        
        this.add.tileSprite(0,0,width,height,'bg').setOrigin(0).setScrollFactor(0,0)
  

        // Headings
        this.add.image( width/2 , MARGIN, 'sheet', "logo_heading_setting.png" ).setOrigin(0.5,0)
        this.add.image( width/2, 169, 'sheet', 'heading_setting.png' ).setOrigin(0.5,0)
        this.headingText = this.add.text( width/2, 190 -20, 'ตั้งค่าเกม' )
            .setFontSize(42)
            .setColor("#FFFFFF")
            .setStroke("#9E461B", 6)
            .setPadding(0,20,0,10)
            //.setLineSpacing(200)
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

        // Username Text
        this.usernameText = this.add.text(width/2, 320+28 ,this.username)
            .setColor("#57453B")
            .setPadding(0,20,0,10)
            .setFontSize(32)
            .setOrigin(0.5,0.5)

        // Character Select
        this.characterSelectUi = new characterSelectUi(this)

        // Airflow and Difficulty Box
        // this.add.rectangle( width/2, height - 512, 576, 448, 0xFFF6E5 ).setOrigin(0.5,0)
        const bigBox = this.add.graphics()
        bigBox.fillStyle(0xFFF6E5)
        bigBox.fillRoundedRect( width/2 - 288, height - 512, 576, 448, 40 )
        bigBox.lineStyle(5,0xD35E24)
        bigBox.strokeRoundedRect( width/2 - 288, height - 512, 576, 448, 40 )

        // Airflow Text
        this.add.image(216, 816, 'sheet', 'logo_setting_airflow.png').setOrigin(0,0) // Icon
        this.airflowText = this.add.text( 216 + 59 + 13, 816 -13, "ปริมาณอากาศ" )
            .setFontSize(32)
            .setPadding(0,20,0,10)
            .setColor("#57453B") 
            .setOrigin(0,0)

        this.medicalAdviceText = this.add.text( width/2, 872 - 20, "*ปรับตามคำแนะนำของแพทย์เท่านั้น*" )
            .setFontSize(28)
            .setPadding(0,20,0,10)
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
        this.add.image( 216, 1024, 'sheet', 'logo_setting_difficulty.png').setOrigin(0,0)
        this.difficultyText = this.add.text( 216+59+13, 1024 - 13, "ระดับความยาก")
            .setPadding(0,20,0,10)
            .setFontSize( 32 )
            .setColor("#57453B") 
            .setOrigin(0,0)

        // Difficulty Boxes
        this.easyButton = this.add.nineslice(width/2 - 96, 1088, 'sheet', 'button_medium.png',144,80).setOrigin(1,0)
        this.mediumButton = this.add.nineslice(width/2, 1088, 'sheet', 'button_medium.png',144,80).setOrigin(0.5,0)
        this.hardButton = this.add.nineslice(width/2 + 96, 1088, 'sheet', 'button_medium.png',144,80).setOrigin(0,0)
        
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

        // Initiate Difficulty
        this.changeDifficulty(this.difficulty)

        // Black Screen When Pop Up
        this.blackWindow = this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0).setVisible(false)

        // Pop Up Form
        const self = this
        this.editNameForm = this.add.dom( width/2, 345 + 295 ).createFromCache('editnameForm')
        let element = this.editNameForm
        element.addListener('click')
        element.on('click', function(event : any) {
            if(event.target.name === 'submit') {
                const inputUsername = this.getChildByName('namefield').value
                if (inputUsername != ''){
                    self.updateUsername(inputUsername)
                }
                element.setVisible(false)
                self.blackWindow?.setVisible(false)
            }
            if(event.target.name === 'cancel'){
                element.setVisible(false)
                self.blackWindow?.setVisible(false)
            }
        })
        this.editNameForm.setVisible(false)

        // Set font for all texts
        WebFont.load({
            google: {
              families: ['Mali:Bold 700']
            },
            active: function() {
              const menuUiStyle = {
                fontFamily: 'Mali'
              }
              self.setAllText(menuUiStyle)
            }
          });
    }

    update() {
        
    }

    changeDifficulty(difficulty : number) : void {
        this.difficulty = difficulty
        // Set Difficulty
        if (this.difficulty === 0) { // Easy
            // Set Button
            this.disableEasyButton?.setVisible(false)
            this.disableMediumButton?.setVisible(true)
            this.disableHardButton?.setVisible(true)

            // Set Text
            this.easyText?.setStroke("#327F76", 6)
            this.mediumText?.setStroke("#BF7F03", 0)
            this.hardText?.setStroke("#9E461B", 0)
        }
        if (this.difficulty === 1) { // Medium
            this.disableEasyButton?.setVisible(true)
            this.disableMediumButton?.setVisible(false)
            this.disableHardButton?.setVisible(true)

            // Set Text
            this.easyText?.setStroke("#327F76", 0)
            this.mediumText?.setStroke("#BF7F03", 6)
            this.hardText?.setStroke("#9E461B", 0)
        }
        if (this.difficulty === 2) { // Hard
            this.disableEasyButton?.setVisible(true)
            this.disableMediumButton?.setVisible(true)
            this.disableHardButton?.setVisible(false)

            // Set Text
            this.easyText?.setStroke("#327F76", 0)
            this.mediumText?.setStroke("#BF7F03", 0)
            this.hardText?.setStroke("#9E461B", 6)
        }
    }

    popUpEditName() : void {
        this.editNameForm?.setVisible(true)
        this.blackWindow?.setVisible(true)
    }

    setAllText(style : any) : void {
        this.usernameText?.setStyle(style)

        this.characterSelectUi?.setFont(style)

        this.easyText?.setStyle(style)
        this.mediumText?.setStyle(style)
        this.hardText?.setStyle(style)
        
        this.headingText?.setStyle(style)

        this.airflowText?.setStyle(style)
        this.medicalAdviceText?.setStyle(style)
        this.difficultyText?.setStyle(style)
    }

    updateUsername(newUsername : string) : void {
        this.username = newUsername
        this.usernameText?.setText(newUsername)
    }
}