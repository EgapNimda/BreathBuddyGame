import Phaser from "phaser";
import { MARGIN } from 'config';
// TODO Import Webfontloader
import WebFont from 'webfontloader'
import usernameBox from "component/setting/usernameBox";
import characterSelectUi from "component/setting/characterSelectUi"
import difficultySelectUi from "component/setting/difficultySelectUi";
import I18nSingleton from "i18n/I18nSingleton";

export default class SettingScene extends Phaser.Scene {
    // Heading
    private headingText : Phaser.GameObjects.Text | undefined

    // Username Box
    private usernameBox : usernameBox | undefined
    private editNameIcon : Phaser.GameObjects.Image | undefined

    // Character Select
    private characterSelectUi : characterSelectUi | undefined

    private airflowEditText: Phaser.GameObjects.Text | undefined
    private medicalAdviceText : Phaser.GameObjects.Text | undefined

    // Airflow Box
    private airflowBox : Phaser.GameObjects.Graphics | undefined
    private airflowText : Phaser.GameObjects.Text | undefined
    private editAirflowForm1 : Phaser.GameObjects.DOMElement | undefined
    private editAirflowForm2 : Phaser.GameObjects.DOMElement | undefined
    private editAirflowForm3 : Phaser.GameObjects.DOMElement | undefined
    private editAirflowForm4 : Phaser.GameObjects.DOMElement | undefined
    private editAirflowForm5 : Phaser.GameObjects.DOMElement | undefined
    private airflowInput : number | undefined

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
            .setInteractive().on('pointerdown', () => this.popUpEditAirflow1())
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

        // Black Screen When Pop Up
        this.blackWindow = this.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0).setVisible(false)

        // Pop Up Box
        this.popUpBox = this.add.graphics()
            .fillStyle(0xffffff)
            .setVisible(false)

        // Pop Up Form
        const self = this

        // Edit Airflow1
        this.editAirflowForm1 = this.add.dom( 72 + 48, 345 + 48 - 250 )
            .setOrigin(0,0)
            .createFromCache('editairflowForm1')
        let editAirflowDom1 = this.editAirflowForm1
        editAirflowDom1.addListener('click')
        editAirflowDom1.on('click', function(event : any) { 
            if(event.target.name === 'cancel') {
                self.closeEditAirflowPopUp1()
                editAirflowDom1.setVisible(false)
            }
            if(event.target.name === 'submit') {
                self.closeEditAirflowPopUp1()
                editAirflowDom1.setVisible(false)
                self.popUpEditAirflow2()
            }
            
        })
        this.editAirflowForm1.setVisible(false)

        // Edit Airflow2
        this.editAirflowForm2 = this.add.dom( 72 + 48, 345 + 48 - 250 )
            .createFromCache('editairflowForm2')
            .setOrigin(0,0)
        let editAirflowDom2 = this.editAirflowForm2
        editAirflowDom2.addListener('click')
        editAirflowDom2.on('click', function (event : any) {
            const inputCheck = this.getChildByName('checkbox').checked
            if(event.target.name === 'cancel') {
                self.closeEditAirflowPopUp2()
                editAirflowDom2.setVisible(false)
            }
            if(event.target.name === 'submit') {
                if(inputCheck){
                    self.closeEditAirflowPopUp2()
                    editAirflowDom2.setVisible(false)
                    self.popUpEditAirflow3()
                }
            }
        })
        this.editAirflowForm2.setVisible(false)

        // Edit Airflow3
        this.editAirflowForm3 = this.add.dom( 72 + 48, 345 + 48 - 250 )
            .createFromCache('editairflowForm3')
            .setOrigin(0,0)
        let editAirflowDom3 = this.editAirflowForm3
        editAirflowDom3.addListener('click')
        editAirflowDom3.on('click', function (event : any) {
            const airflowInput = this.getChildByName('select').value
            if(event.target.name === 'cancel') {
                self.closeEditAirflowPopUp3()
                editAirflowDom3.setVisible(false)
            }
            if(event.target.name === 'submit') {
                self.closeEditAirflowPopUp3()
                editAirflowDom3.setVisible(false)
                self.airflowInput = Number(airflowInput)
                self.popUpEditAirflow4()
            }
        })
        this.editAirflowForm3.setVisible(false)

        // Edit Airflow 4
        this.editAirflowForm4 = this.add.dom( 72 + 48, 345 + 48 - 250 )
            .createFromCache('editairflowForm4')
            .setOrigin(0,0)
        let editAirflowDom4 = this.editAirflowForm4
        editAirflowDom4.addListener('click')
        editAirflowDom4.on('click', function (event : any) {
            if(event.target.name === 'cancel') {
                self.closeEditAirflowPopUp4()
                editAirflowDom4.setVisible(false)
            }
            if(event.target.name === 'submit') {
                self.closeEditAirflowPopUp4()
                editAirflowDom4.setVisible(false)
                self.updateAirflow(self.airflowInput === undefined ? 100 : self.airflowInput)
                self.popUpEditAirflow5()
            }
        })
        this.editAirflowForm4.setVisible(false)

        // Edit Airflow 5
        this.editAirflowForm5 = this.add.dom( 72 + 48, 345 + 48 - 250 )
            .createFromCache('editairflowForm5')
            .setOrigin(0,0)
        let editAirflowDom5 = this.editAirflowForm5
        editAirflowDom5.addListener('click')
        editAirflowDom5.on('click', function (event : any) {
            if(event.target.name === 'submit') {
                self.closeEditAirflowPopUp5()
                editAirflowDom5.setVisible(false)
            }
        })
        this.editAirflowForm5.setVisible(false)

        // Edit Name Icon
        this.editNameIcon = this.add.image(width - 192 - 20 , 320 + 28, 'sheet', "logo_setting_edit name.png")
            //.setInteractive().on('pointerdown', () => this.popUpEditName())
            .setOrigin(1,0.5) // Guessed the coordinate

        // Username Box
        this.usernameBox = new usernameBox(this,this.editNameIcon,"น้องบุนออเรนจ์")

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

        // this.popUpEditAirflow3()
    }

    update() {
        console.log(this.characterSelectUi?.getUsingCharIndex())
    }

    setAllText(style : any) : void {
        // this.usernameText?.setStyle(style)

        this.characterSelectUi?.setFont(style)

        this.difficultySelectUi?.setFont(style)

        this.headingText?.setStyle(style)

        this.airflowEditText?.setStyle(style)
        this.medicalAdviceText?.setStyle(style)
        this.difficultyText?.setStyle(style)
    }

    // Don't forget to set Interactive

    closeEditNamePopUp() : void {
        this.blackWindow?.setVisible(false)
        this.popUpBox?.clear()
        this.popUpBox?.setVisible(false)
        this.setInteractiveOn()
    }

    popUpEditAirflow1() : void {
        this.setInteractiveOff()
        this.popUpBox?.setVisible(true)
        this.popUpBox?.fillStyle(0xffffff)
        this.popUpBox?.fillRoundedRect(72, 345 - 250, 576, 590 + 500, 48) // TODO size vary, change later
        this.editAirflowForm1?.setVisible(true)
        this.blackWindow?.setVisible(true)
    }

    closeEditAirflowPopUp1() : void {
        this.blackWindow?.setVisible(false)
        this.popUpBox?.clear()
        this.popUpBox?.setVisible(false)
        this.setInteractiveOn()
    }

    popUpEditAirflow2() : void {
        this.setInteractiveOff()
        this.popUpBox?.setVisible(true)
        this.popUpBox?.fillStyle(0xffffff)
        this.popUpBox?.fillRoundedRect(72, 345 - 250, 576, 590 + 500, 48) // TODO size vary, change later
        this.editAirflowForm2?.setVisible(true)
        this.blackWindow?.setVisible(true)
    }

    closeEditAirflowPopUp2() : void {
        this.blackWindow?.setVisible(false)
        this.popUpBox?.clear()
        this.popUpBox?.setVisible(false)
        this.setInteractiveOn()
    }

    popUpEditAirflow3() : void {
        this.setInteractiveOff()
        this.popUpBox?.setVisible(true)
        this.popUpBox?.fillStyle(0xffffff)
        this.popUpBox?.fillRoundedRect(72, 345 - 250, 576, 590 + 500, 48) // TODO size vary, change later
        this.editAirflowForm3?.setVisible(true)
        this.blackWindow?.setVisible(true)
    }

    closeEditAirflowPopUp3() : void {
        this.blackWindow?.setVisible(false)
        this.popUpBox?.clear()
        this.popUpBox?.setVisible(false)
        this.setInteractiveOn()
    }

    popUpEditAirflow4() : void {
        this.setInteractiveOff()
        this.popUpBox?.setVisible(true)
        this.popUpBox?.fillStyle(0xffffff)
        this.popUpBox?.fillRoundedRect(72, 345 - 250, 576, 590 + 500, 48) // TODO size vary, change later
        this.editAirflowForm4?.setVisible(true)
        this.blackWindow?.setVisible(true)

        const currentAirflow = <Element>this.editAirflowForm4?.getChildByID('currentAirflow');
        currentAirflow.textContent = this.airflow === undefined ? 'xxx' : this.airflow.toString()

        const newAirflow = <Element>this.editAirflowForm4?.getChildByID('newAirflow');
        newAirflow.textContent = this.airflowInput === undefined ? 'xxx' : this.airflowInput.toString()

    }

    closeEditAirflowPopUp4() : void {
        this.blackWindow?.setVisible(false)
        this.popUpBox?.clear()
        this.popUpBox?.setVisible(false)
        this.setInteractiveOn()
    }

    popUpEditAirflow5() : void {
        this.setInteractiveOff()
        this.popUpBox?.setVisible(true)
        this.popUpBox?.fillStyle(0xffffff)
        this.popUpBox?.fillRoundedRect(72, 345 - 250, 576, 590 + 500, 48) // TODO size vary, change later
        this.editAirflowForm5?.setVisible(true)
        this.blackWindow?.setVisible(true)

        const changedAirflow = <Element>this.editAirflowForm5?.getChildByID('changedAirflow');
        changedAirflow.textContent = this.airflow === undefined ? 'xxx' : this.airflow.toString()
    }

    closeEditAirflowPopUp5() : void {
        this.blackWindow?.setVisible(false)
        this.popUpBox?.clear()
        this.popUpBox?.setVisible(false)
        this.setInteractiveOn()
    }

    updateAirflow(airflow : number) : void {
        this.airflow = airflow
        this.airflowText?.setText(this.airflow.toString())
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

        // this.editNameIcon?.setInteractive().on('pointerdown', () => this.popUpEditName())
        this.editAirflowIcon?.setInteractive().on('pointerdown', () => this.popUpEditAirflow1())
    }
}