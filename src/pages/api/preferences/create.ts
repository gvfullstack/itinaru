import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from "cookie";
const mongoose = require('mongoose');

import User from "../../../models/user"

async function upsertPreferences(
    req: NextApiRequest,
    res: NextApiResponse
) {
    //validate user input
    if (!req.body || !req.body.email) {
        // bad request error code
        return res.status(400).send("missing email");
    }

    const preferences = req.body
    const cookie = serialize("email", preferences.email, {
        httpOnly: true,
        path: "/",
    });

    try {

        // connect to NOSQL database
        await mongoose.connect(process.env.MONGO_URL);

        const user = await User.findOne({ email: preferences.email });

        // update existing user account
        if (user.email === preferences.email) {
            res.setHeader("Set-Cookie", cookie);
            //updated success code
            res.status(200).json({ user });
            return;
        }

        // insert a new user account
        const newUser = await User.create(preferences);
        res.setHeader("Set-Cookie", cookie);
        //created success code
        res.status(201).json({ newUser });
        return;
    } catch (error: unknown) {
        console.log(error)
        //server error code
        res.status(501).send("error");

    }
}


export default upsertPreferences
