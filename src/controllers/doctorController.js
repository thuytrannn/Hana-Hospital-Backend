import doctorService from '../services/doctorService'

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit
    if (!limit) limit = 5
    try {
        let response = await doctorService.getTopDoctorHome(+limit)
        return res.status(200).json(response)
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server.'
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors()
        return res.status(200).json(doctors)
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server.'
        })
    }
}

let postInforDoctors = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server.'
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctorByIdService(req.query.id)
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

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateScheduleService(req.body)
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

let getScheduleDoctorByDate = async (req, res) => {
    try {
        let infor = await doctorService.getScheduleDoctorByDateService(req.query.doctorId, req.query.date)
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

let getExtraInforDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getExtraInforDoctorByIdService(req.query.doctorId)
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

let getProfileDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getProfileDoctorByIdService(req.query.doctorId)
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

let getListPatientForDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getListPatientForDoctorService(req.query.doctorId, req.query.date)
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

let sendRemedy = async (req, res) => {
    try {
        let infor = await doctorService.sendRemedyService(req.body)
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
    getTopDoctorHome,
    getAllDoctors,
    postInforDoctors,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleDoctorByDate,
    getExtraInforDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy,
}