import { v4 } from "uuid"
import { validate } from "validate.js";
import constraints from "./constraints.js"
import bcrypt from "bcrypt"
export async function createUser({ username, email, password }) {
    let user = {}

    /* --------------------*/

    if (username) {
        username = username.trim().replace(/ +/g, ' ');
    }
    let msg1 = validate.single(username, constraints.name())
    if (msg1) {
        return { errMsg: msg1 }
    } else {
        user.username = username
    }

    /* --------------------*/

    user.id = v4()

    /* --------------------*/

    let msg2 = validate.single(email, constraints.email())
    if (msg2) {
        return { errMsg: msg2 }
    } else {
        user.email = email
    }


    /* --------------------*/

    let msg3 = validate.single(password, constraints.password())
    if (msg3) {
        return { errMsg: msg3 }
    } else {
        user.passwordHash = await bcrypt.hash(password, 10)
    }


    return user

}
