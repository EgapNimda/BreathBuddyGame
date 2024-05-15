import Phaser from "phaser";
import { MARGIN, MEDIUM_FONT_SIZE, LARGE_FONT_SIZE } from 'config';
// TODO Import Webfontloader
import WebFont from 'webfontloader'

export default class SettingScene extends Phaser.Scene {
    private characters = ["logo_setting_mc1.png", "logo_setting_mc2.png", "logo_setting_mc3.png"]
    private characterNames = ["นักผจญภัย","นักเวทย์","จอมโจร"]

    private showingCharIndex = 0
    private showingChar= this.characters[this.showingCharIndex]
    private showingCharImg : Phaser.GameObjects.Image | undefined

    private usingCharIndex = 0 //GET from database

    private useButton : Phaser.GameObjects.Shape | undefined

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
  

        this.add.image( width/2 , MARGIN, 'sheet', "logo_heading_setting.png" ).setOrigin(0.5,0)

        this.add.image( width/2, 169, 'sheet', 'heading_setting.png' ).setOrigin(0.5,0)

        // TODO Set Font
        this.add.text( width/2, 169, 'ตั้งค่าเกม' )
            .setFontSize(LARGE_FONT_SIZE)
            .setOrigin(0.5,0)

        // TODO Rounded Rectangle
        this.add.rectangle( width/2, 320, 336, 56, 0xffffff ).setOrigin(0.5,0) // Username

        // Character Select Box
        this.add.rectangle( width/2, 504, 336, 120, 0x43A99E ).setOrigin(0.5,0) 
        // Arrows
        const prevButton = this.add.image( 200, 564, 'sheet', "logo_setting_next.png" ).setOrigin(0,0.5)
        const nextButton = this.add.image( 520, 564, 'sheet', "logo_setting_next.png" ).setFlipX(true).setOrigin(1,0.5)
        prevButton.setInteractive().on('pointerdown', () => this.charShift(-1))
        nextButton.setInteractive().on('pointerdown', () => this.charShift(1))
        // showing Character
        this.showingCharImg = this.add.image( width/2, 504, 'sheet', 'logo_setting_mc1.png').setOrigin(0.5,0.5)


        // Using, Used Button
        this.useButton = this.add.rectangle( width/2, 640, 336, 80, 0x9E461B ).setOrigin(0.5,0) 

        // TODO Fix Color
        this.add.rectangle( width/2, height - 512, 576, 448, 0xf5f4c6 ).setOrigin(0.5,0)

        // TODO Add Airflow Logo
        this.add.text( width/2, 816, "ปริมาณอากาศ" )
            .setFontSize(MEDIUM_FONT_SIZE)
            .setColor("orange") //change later
            .setOrigin(0.5,0)

        this.add.text( width/2, 872, "*ปรับตามคำแนะนำของแพทย์เท่านั้น*" ).setOrigin(0.5,0)

        this.add.rectangle( width/2, 920, 328, 56, 0xffffff ).setOrigin(0.5,0)

        // TODO Add Difficulty Logo
        this.add.text( width/2, 1024, "ระดับความยาก").setOrigin(0.5,0)

    }

    update() {
        this.showingChar = this.characters[this.showingCharIndex]
        this.showingCharImg?.setTexture("sheet", this.showingChar)

    }
    
    charShift(i : number){
        this.showingCharIndex = (this.showingCharIndex + i) % this.characters.length
    }
}