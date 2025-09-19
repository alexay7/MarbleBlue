import {Types} from "mongoose";

export type CardType = {
    // Identificador de la tarjeta
    extId:string;

    // Código de acceso
    accessCode: string;

    // Fecha de registro
    registerDate: Date;

    // Fecha del último inicio de sesión
    lastLoginDate: Date | null;

    // Usuario MarbleBlue asociado
    userId: Types.ObjectId | null;

    // Estado de la tarjeta
    status: "good"|"banned"
}