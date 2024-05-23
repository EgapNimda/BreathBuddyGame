import Phaser from "phaser";
import { MARGIN } from 'config';
// TODO Import Webfontloader
import WebFont from 'webfontloader'
import editUsernamePopUp from "component/setting/editUsernamePopUp";
import editAirflowPopUp from "component/setting/editAirflowPopUp";
import characterSelectUi from "component/setting/characterSelectUi"
import difficultySelectUi from "component/setting/difficultySelectUi";
import I18nSingleton from "i18n/I18nSingleton";

export default class SettingScene extends Phaser.Scene {
    // Heading
    private headingText : Phaser.GameObjects.Text | undefined

    // Username Box
    private editUsernamePopUp : editUsernamePopUp | undefined
    private usernameBox : Phaser.GameObjects.Graphics | undefined
    private usernameText : Phaser.GameObjects.Text | undefined
    private editNameIcon : Phaser.GameObjects.Image | undefined

    // Character Select
    private characterSelectUi : characterSelectUi | undefined

    private airflowEditText: Phaser.GameObjects.Text | undefined
    private medicalAdviceText : Phaser.GameObjects.Text | undefined

    // Airflow Box
    private airflowBox : Phaser.GameObjects.Graphics | undefined
    private airflowText : Phaser.GameObjects.Text | undefined
    private editAirflowPopUp : editAirflowPopUp | undefined

    private editAirflowIcon : Phaser.GameObjects.Image | undefined

    //Difficulty
    private difficultyText : Phaser.GameObjects.Text | undefined
    private difficultySelectUi : difficultySelectUi | undefined

    // from database
    private airflow : number | undefined

    private blackWindow : Phaser.GameObjects.Shape | undefined
    private popUpBox : Phaser.GameObjects.Graphics | undefined

    constructor() {
        super('setting')
    }

    preload(){
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
        this.load.atlas('sheet','assets/setting/setting_spritesheet.png','assets/setting/setting_spritesheet.json');

        this.load.image('bg','assets/setting/setting_bg.png')

        this.load.svg('editAirflow', 'assets/setting/logo_modal_edit airflow.svg')
        this.load.svg('editName', 'assets/setting/logo_modal_edit name.svg')

        this.load.html('editnameForm', 'html/setting/editname.html')
        this.load.html('editairflowForm1', 'html/setting/editairflow1.html')
        this.load.html('editairflowForm2', 'html/setting/editairflow2.html')
        this.load.html('editairflowForm3', 'html/setting/editairflow3.html')
        this.load.html('editairflowForm4', 'html/setting/editairflow4.html')
        this.load.html('editairflowForm5', 'html/setting/editairflow5.html')
    }

    create(){
        const { width, height } = this.scale

        const i18n = I18nSingleton.getInstance()
        
        this.airflow = 100 // change later
        
        this.add.tileSprite(0,0,width,height,'bg').setOrigin(0).setScrollFactor(0,0)

        // Headings
        this.add.image( width/2 , MARGIN, 'sheet', "logo_heading_setting.png" ).setOrigin(0.5,0)
        this.add.image( width/2, 169, 'sheet', 'heading_setting.png' ).setOrigin(0.5,0)
        this.headingText = i18n.createTranslatedText( this, width/2, 190 -20, 'setting_title' )
            .setFontSize(42)
            .setColor("#FFFFFF")
            .setStroke("#9E461B", 6)
            .setPadding(0,20,0,10)
            //.setLineSpacing(200)
            .setOrigin(0.5,0)

        // Character Select
        this.characterSelectUi = new characterSelectUi(this)

        // Username Box
        this.usernameBox = this.add.graphics()
        this.usernameBox.fillStyle(0xFFFFFF)
        this.usernameBox.fillRoundedRect( width/2 - 168, 320, 336, 56, 14 )
        this.usernameBox.lineStyle(1, 0x727272)
        this.usernameBox.strokeRoundedRect( width/2 - 168, 320, 336, 56, 14 )

        // Username Text
        this.usernameText = this.add.text(width/2, 320+28 , "")
            .setColor("#57453B")
            .setPadding(0,20,0,10)
            .setFontSize(32)
            .setOrigin(0.5,0.5)
        
        // Edit Name Icon
        this.editNameIcon = this.add.image(width - 192 - 20 , 320 + 28, 'sheet', "logo_setting_edit name.png")
            .setInteractive().on('pointerdown', () => this.popUpEditName())
            .setOrigin(1,0.5) // Guessed the coordinate


        // Airflow and Difficulty Box
        // this.add.rectangle( width/2, height - 512, 576, 448, 0xFFF6E5 ).setOrigin(0.5,0)
        const bigBox = this.add.graphics()
        bigBox.fillStyle(0xFFF6E5)
        bigBox.fillRoundedRect( width/2 - 288, height - 512, 576, 448, 40 )
        bigBox.lineStyle(5,0xD35E24)
        bigBox.strokeRoundedRect( width/2 - 288, height - 512, 576, 448, 40 )

        // Airflow Text
        this.add.image(216, 816, 'sheet', 'logo_setting_airflow.png').setOrigin(0,0) // Icon
        this.airflowEditText = i18n.createTranslatedText( this, 216 + 59 + 13, 816 -13, "airflow_volume" )
            .setFontSize(32)
            .setPadding(0,20,0,10)
            .setColor("#57453B") 
            .setOrigin(0,0)

        this.medicalAdviceText = i18n.createTranslatedText( this, width/2, 872 - 20, "doctor_advice_airflow" )
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

        // Edit Airflow Icon
        this.editAirflowIcon = this.add.image(width/2 + 164 - 20, 920 + 28, "sheet", "logo_setting_edit airflow.png")
            .setInteractive().on('pointerdown', () => this.popUpEditAirflow())
            .setOrigin(1,0.5) // Guessed the coordinate

        // Airflow Number
        this.airflowText = this.add.text(width/2, 920 + 28, this.airflow.toString())
            .setFontSize(32)
            .setColor("#57453B")
            .setOrigin(0.5,0.5)

        // Difficulty
        this.add.image( 216, 1024, 'sheet', 'logo_setting_difficulty.png').setOrigin(0,0)
        this.difficultyText = i18n.createTranslatedText( this, 216+59+13, 1024 - 13, "difficulty_title")
            .setPadding(0,20,0,10)
            .setFontSize( 32 )
            .setColor("#57453B") 
            .setOrigin(0,0)

        this.difficultySelectUi = new difficultySelectUi(this)

        // Pop Up Form
        this.editUsernamePopUp = new editUsernamePopUp(this,"น้องราคูนี่")
        this.editAirflowPopUp = new editAirflowPopUp(this, 100)

        // Set font for all texts
        const self = this
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

        // this.popUpEditAirflow3()
    }

    update() {
        this.usernameText?.setText(this.editUsernamePopUp!.getUsername())
        this.airflowText?.setText(this.editAirflowPopUp!.getAirflow().toString())
    }

    setAllText(style : any) : void {
        // this.usernameText?.setStyle(style)

        this.characterSelectUi?.setFont(style)

        this.difficultySelectUi?.setFont(style)

        this.usernameText?.setStyle(style)

        this.headingText?.setStyle(style)

        this.airflowEditText?.setStyle(style)
        this.medicalAdviceText?.setStyle(style)
        this.difficultyText?.setStyle(style)
        this.airflowText?.setStyle(style)
    }

    popUpEditName() : void {
        this.editUsernamePopUp!.popUpEditName()
    }

    popUpEditAirflow() : void {
        this.editAirflowPopUp?.popUpEditAirflow1()
    }

    setInteractiveOff() : void {
        this.characterSelectUi?.setInteractiveOff()
        this.difficultySelectUi?.setInteractiveOff()
        
        this.editNameIcon?.setInteractive().off('pointerdown')
        this.editAirflowIcon?.setInteractive().off('pointerdown')
    }

    setInteractiveOn() : void {
        this.characterSelectUi?.setInteractiveOn()
        this.difficultySelectUi?.setInteractiveOn()

        this.editNameIcon?.setInteractive().on( 'pointerdown', () => this.popUpEditName() )
        this.editAirflowIcon?.setInteractive().on( 'pointerdown', () => this.popUpEditAirflow() )
    }
}