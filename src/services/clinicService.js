const db = require("../models")


let createNewClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('data:', data)
            if (!data.name || !data.descriptionHTML
                || !data.descriptionMarkdown || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.',
                })
            }
            else {
                await db.Clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                    address: data.address,
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Save information success.',
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let saveInforClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.descriptionHTML || !data.descriptionMarkdown || !data.clinicId || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.',
                })
            }
            else {
                let inforClinic = await db.Clinic.findOne({
                    where: { id: data.clinicId },
                    raw: false,
                })
                if (inforClinic) {
                    inforClinic.descriptionMarkdown = data.descriptionMarkdown
                    inforClinic.descriptionHTML = data.descriptionHTML
                    inforClinic.address = data.address
                    // inforClinic.image = data.imageBase64
                    inforClinic.updatedAt = new Date()
                    await inforClinic.save()
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save information success.',
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let getAllClinics = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll()
            if (data && data.length > 0) {
                data.map(item => {
                    let array = []
                    console.log('item:', item)
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data,
            })
        }
        catch (e) {
            reject(e)
        }
    })
}

let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.',
                })
            }
            else {

                let data = await db.Clinic.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionMarkdown', 'descriptionHTML', 'address', 'image']
                })
                if (data) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                    let doctorClinic = []
                    doctorClinic = await db.Doctor_info.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId']
                    })

                    data.doctorClinic = doctorClinic
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data,
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createNewClinicService,
    saveInforClinicService,
    getAllClinics,
    getDetailClinicById,
}