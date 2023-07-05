import specialtyService from '../services/specialtyService'

let createNewSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.createNewSpecialtyService(req.body)
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

let saveInforSpecialty = async (req, res) => {
    try {
        let infor = await specialtyService.saveInforSpecialtyService(req.body)
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

let getAllSpecialties = async (req, res) => {
    try {
        let Specialties = await specialtyService.getAllSpecialties()
        return res.status(200).json(Specialties)
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server.'
        })
    }
}

let getDetailSpecialtyById = async (req, res) => {
    try {
        let infor = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location)
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
    createNewSpecialty,
    getAllSpecialties,
    getDetailSpecialtyById,
    saveInforSpecialty,
}