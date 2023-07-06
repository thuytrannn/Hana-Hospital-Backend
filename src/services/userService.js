import db from '../models/index'
import bcrypt from 'bcryptjs'

var salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt)
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password', 'firstName', 'lastName', 'id'], //define colums that you want to show
                    where: { email: email },
                    raw: true,
                })
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password)
                    if (check) {
                        userData.errCode = 0
                        userData.errMessage = "OK"
                        delete user.password
                        userData.user = user
                    }
                    else {
                        userData.errCode = 3
                        userData.errMessage = "Wrong password."
                    }
                }
                else {
                    userData.errCode = 2
                    userData.errMessage = "User's not found!"
                }
            }
            else {
                userData.errCode = 1
                userData.errMessage = "Your email isn't exists in system. Please try other email!"
            }
            resolve(userData)
        }
        catch (e) {
            reject(e)
        }
    })
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email }
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            if (userId === 'All') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if (userId && userId !== 'All') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        }
        catch (e) {
            reject(e)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('===data===: ', data)
            let check = await checkUserEmail(data.email)
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email is already in used.'
                })
            }
            else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.avatar,
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.destroy({
            where: { id: id }
        })
        if (!user) {
            resolve({
                errCode: 2,
                message: "The user isn'n exist."
            })
        }
        resolve({
            errCode: 0,
            message: "The user is deleted."
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    message: 'Missing required parameters.'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            })
            if (user) {
                user.firstName = data.firstName
                user.lastName = data.lastName
                user.address = data.address
                user.phonenumber = data.phonenumber
                user.gender = data.gender
                await user.save()
                resolve({
                    errCode: 0,
                    message: 'Update the user success.'
                })
            }
            else {
                resolve({
                    errCode: 1,
                    message: "User's not found."
                })
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

let GetAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters.'
                })
            }
            else {
                let res = {}
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                })
                res.errCode = 0
                res.data = allcode
                resolve(res)
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    handleUserLogin,
    checkUserEmail,
    getAllUsers,
    createNewUser,
    hashUserPassword,
    deleteUser,
    updateUserData,
    GetAllCodeService,
}