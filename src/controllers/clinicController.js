import clinicService from '../services/clinicService'

let createNewClinic = async (req, res) => {
    try {
        let infor = await clinicService.createNewClinicService(req.body)
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server.'
        })
    }
}

let saveInforClinic = async (req, res) => {
    try {
        let infor = await clinicService.saveInforClinicService(req.body)
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server.'
        })
    }
}

let getAllClinics = async (req, res) => {
    try {
        let Clinics = await clinicService.getAllClinics()
        return res.status(200).json(Clinics)
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server.'
        })
    }
}

let getDetailClinicById = async (req, res) => {
    try {
        let infor = await clinicService.getDetailClinicById(req.query.id)
        return res.status(200).json(infor)
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server.'
        })
    }
}

module.exports = {
    createNewClinic,
    saveInforClinic,
    getAllClinics,
    getDetailClinicById,
}