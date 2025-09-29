import {Types} from "mongoose";

export type KeychipType = {
    // Identificador del keychip
    serial: string;

    // Fecha de registro
    registerDate: Date;

    // Fecha del último inicio de sesión
    lastLoginDate: Date | null;

    // Usuario MarbleBlue asociado
    userId: Types.ObjectId | null;

    // Estado del keychip
    status: "good"|"banned"
}