import gameSettings from "../models/gameSettings.js";

export default async function(req , res , next){
    const gameSetting = await  gameSettings.findById('685469d874509929e57f323c');

    req.gameSetting = gameSetting;

    next();
}