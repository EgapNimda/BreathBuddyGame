import i18next from "i18next"

export default class editAirflowPopUp {
    private editAirflowForm1 : Phaser.GameObjects.DOMElement | undefined
    private editAirflowForm2 : Phaser.GameObjects.DOMElement | undefined
    private editAirflowForm3 : Phaser.GameObjects.DOMElement | undefined
    private editAirflowForm4 : Phaser.GameObjects.DOMElement | undefined
    private editAirflowForm5 : Phaser.GameObjects.DOMElement | undefined
    private airflowInput : number | undefined

    private airflow : number | undefined

    private blackWindow : Phaser.GameObjects.Shape | undefined
    private popUpBox : Phaser.GameObjects.Graphics | undefined

    constructor(scene: Phaser.Scene, airflow?: number) {
        const{ width,height } = scene.scale

        const self = this

        this.airflow = airflow === undefined ? 100 : airflow

        // Black Screen When Pop Up
        this.blackWindow = scene.add.rectangle(0, 0, width, height, 0, 0.5).setOrigin(0, 0).setVisible(false)

        // Pop Up Box
        this.popUpBox = scene.add.graphics()
            .fillStyle(0xffffff)
            .setVisible(false)

        // Edit Airflow1
        this.editAirflowForm1 = scene.add.dom( 72 + 48, 345 + 48 - 250 )
            .setOrigin(0,0)
            .createFromCache('editairflowForm1')
        this.editAirflowForm1.addListener('click')
        this.editAirflowForm1.on('click', function(event : any) { 
            if(event.target.name === 'cancel') {
                self.closeEditAirflowPopUp1()
                self.editAirflowForm1?.setVisible(false)
            }
            if(event.target.name === 'submit') {
                self.closeEditAirflowPopUp1()
                self.editAirflowForm1?.setVisible(false)
                self.popUpEditAirflow2()
            }
            
        })
        this.editAirflowForm1.setVisible(false)

        // Edit Airflow2
        this.editAirflowForm2 = scene.add.dom( 72 + 48, 345 + 48 - 250 )
            .createFromCache('editairflowForm2')
            .setOrigin(0,0)

        const warning = <Element>this.editAirflowForm2.getChildByID('warning')
        warning.textContent = i18next.t('warning')

        const doctorInstructed = <Element>this.editAirflowForm2.getChildByID('doctor_instructed_confirm')
        doctorInstructed.textContent = i18next.t('airflow_doctor_instructed_confirm')

        const cancel2 = <Element>this.editAirflowForm2.getChildByID('cancel')
        cancel2.textContent = i18next.t('cancel')

        const submit2 = <Element>this.editAirflowForm2.getChildByID('submit')
        submit2.textContent = i18next.t('submit_edit')

        this.editAirflowForm2.addListener('click')
        this.editAirflowForm2.on('click', function (event : any) {
            const inputCheck = this.getChildByName('checkbox').checked
            if(event.target.name === 'cancel') {
                self.closeEditAirflowPopUp2()
                self.editAirflowForm2?.setVisible(false)
            }
            if(event.target.name === 'submit') {
                if(inputCheck){
                    self.closeEditAirflowPopUp2()
                    self.editAirflowForm2?.setVisible(false)
                    self.popUpEditAirflow3()
                }
            }
        })
        this.editAirflowForm2.setVisible(false)

        

        // Edit Airflow3
        this.editAirflowForm3 = scene.add.dom( 72 + 48, 345 + 48 - 250 )
            .createFromCache('editairflowForm3')
            .setOrigin(0,0)

        const editAirflow = <Element>this.editAirflowForm3.getChildByID("edit_airflow")
        editAirflow.textContent = i18next.t('edit_airflow')

        const cancel3 = <Element>this.editAirflowForm3.getChildByID('cancel')
        cancel3.textContent = i18next.t('cancel')

        const submit3 = <Element>this.editAirflowForm3.getChildByID('submit')
        submit3.textContent = i18next.t('submit_edit')

        this.editAirflowForm3.addListener('click')
        this.editAirflowForm3.on('click', function (event : any) {
            const airflowInput = this.getChildByName('select').value
            if(event.target.name === 'cancel') {
                self.closeEditAirflowPopUp3()
                self.editAirflowForm3?.setVisible(false)
            }
            if(event.target.name === 'submit') {
                self.closeEditAirflowPopUp3()
                self.editAirflowForm3?.setVisible(false)
                self.airflowInput = Number(airflowInput)
                self.popUpEditAirflow4()
            }
        })
        this.editAirflowForm3.setVisible(false)

        // Edit Airflow 4
        this.editAirflowForm4 = scene.add.dom( 72 + 48, 345 + 48 - 250 )
            .createFromCache('editairflowForm4')
            .setOrigin(0,0)

        const confirmation = <Element> this.editAirflowForm4.getChildByID('confirmation')
        confirmation.textContent = i18next.t('confirmation')

        const changeAirflowConfirm = <Element> this.editAirflowForm4.getChildByID('change_airflow_confirm')
        changeAirflowConfirm.textContent = i18next.t('airflow_confirm')

        const cancel4 = <Element> this.editAirflowForm4.getChildByID('cancel')
        cancel4.textContent = i18next.t('cancel')

        const submit4 = <Element> this.editAirflowForm4.getChildByID('submit')
        submit4.textContent = i18next.t('submit_edit')

        this.editAirflowForm4.addListener('click')
        this.editAirflowForm4.on('click', function (event : any) {
            if(event.target.name === 'cancel') {
                self.closeEditAirflowPopUp4()
                self.editAirflowForm4?.setVisible(false)
            }
            if(event.target.name === 'submit') {
                self.closeEditAirflowPopUp4()
                self.editAirflowForm4?.setVisible(false)
                self.updateAirflow(self.airflowInput === undefined ? 100 : self.airflowInput)
                self.popUpEditAirflow5()
            }
        })
        this.editAirflowForm4.setVisible(false)

        // Edit Airflow 5
        this.editAirflowForm5 = scene.add.dom( 72 + 48, 345 + 48 - 250 )
            .createFromCache('editairflowForm5')
            .setOrigin(0,0)
        this.editAirflowForm5.addListener('click')
        this.editAirflowForm5.on('click', function (event : any) {
            if(event.target.name === 'submit') {
                self.closeEditAirflowPopUp5()
                self.editAirflowForm5?.setVisible(false)
            }
        })
        this.editAirflowForm5.setVisible(false)
    }

    closeEditNamePopUp() : void {
        this.blackWindow?.setVisible(false)
        this.popUpBox?.clear()
        this.popUpBox?.setVisible(false)
        // this.setInteractiveOn()
    }

    popUpEditAirflow1() : void {
        // this.setInteractiveOff()
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
        // this.setInteractiveOn()
    }

    popUpEditAirflow2() : void {
        // this.setInteractiveOff()
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
        // this.setInteractiveOn()
    }

    popUpEditAirflow3() : void {
        // this.setInteractiveOff()
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
        // this.setInteractiveOn()
    }

    popUpEditAirflow4() : void {
        // this.setInteractiveOff()
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
        // this.setInteractiveOn()
    }

    popUpEditAirflow5() : void {
        // this.setInteractiveOff()
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
        // this.setInteractiveOn()
    }

    updateAirflow(airflow : number) : void {
        this.airflow = airflow
        // this.airflowText?.setText(this.airflow.toString())
    }

    getAirflow() : number {
        return this.airflow === undefined ? 100 : this.airflow
    }
    
}