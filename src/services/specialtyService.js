const db = require("../models")


let createNewSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.',
                })
            }
            else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
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

let saveInforSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.descriptionHTML || !data.descriptionMarkdown || !data.specialtyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.',
                })
            }
            else {
                let inforSpecialty = await db.Specialty.findOne({
                    where: { id: data.specialtyId },
                    raw: false,
                })
                if (inforSpecialty) {
                    inforSpecialty.descriptionMarkdown = data.descriptionMarkdown
                    inforSpecialty.descriptionHTML = data.descriptionHTML
                    // inforSpecialty.image = data.imageBase64
                    inforSpecialty.updatedAt = new Date()
                    await inforSpecialty.save()
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

let getAllSpecialties = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                order: [['createdAt', 'ASC']],
            })
            if (data && data.length > 0) {
                data.map(item => {
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

let getDetailSpecialtyByIdService = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.',
                })
            }
            else {

                let data = await db.Specialty.findOne({
                    where: { id: inputId },
                    attributes: ['descriptionMarkdown', 'descriptionHTML']
                })

                if (data) {
                    let doctorSpecialty = []
                    if (location === 'All') {
                        doctorSpecialty = await db.Doctor_info.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    else {
                        doctorSpecialty = await db.Doctor_info.findAll({
                            where: { specialtyId: inputId, provinceId: location },
                            attributes: ['doctorId', 'provinceId']
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty
                }
                else {
                    data = {}
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
    createNewSpecialtyService,
    getAllSpecialties,
    getDetailSpecialtyByIdService,
    saveInforSpecialtyService,
}