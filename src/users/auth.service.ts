import { Injectable , BadRequestException} from "@nestjs/common";
import { UsersService } from "./users.service";
 import { randomBytes,scrypt as _scrypt} from "crypto";
 import { promisify } from "util";
 import { NotFoundException } from "@nestjs/common";

 const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
 
    constructor(private usersService: UsersService) {}
 
    async signup(email: string, password: string) {
        // check if email is already in use
        const users = await this.usersService.find(email);
        if (users.length) {
            throw new BadRequestException('Email in use');
        }
 
        // hash the password
        //generate a salt
        const salt = randomBytes(8).toString('hex');

        //hash the salt with the password
        const hash = await scrypt(password,salt,32) as Buffer;
        

        //join the hashed password and salt
        const result = salt + '.' + hash.toString('hex');
 
        // save a new user in the database
        const user = await this.usersService.create(email, result);

 
        // return the user
        return user;
    }
 

    async signin(email: string, password: string) {
        const [user] = await this.usersService.find(email);

        if (!user) {
            throw new NotFoundException('user not found');
        }

        const [salt, storedhash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedhash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }
        return user;
       
    }
 
}
 
 
 