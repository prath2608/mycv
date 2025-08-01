import { Controller ,Post,Body, Get, Param, Query,Delete, Patch,UseInterceptors,UseGuards,NotFoundException,Session} from '@nestjs/common';
import { createUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { Serialize, SerializeInterceptor } from '../interceptor/serialize.interceptor';
import { AuthGuard } from '../guards/auth.gurads';


@Controller('auth')
@Serialize(UserDto)
export class UsersController {


    constructor(private userService : UsersService,  
        private authService: AuthService
    ){}


    @Get('/whoami')
    @UseGuards(AuthGuard)
    getCurrentUser(@CurrentUser() user: User) {
        return user;
    }

@Post('/signup')
async createUser(@Body() body: createUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
}


    @Post('/signin')
   async signin(@Body() body:createUserDto, @Session() session: Record<string, any>){
      const user = await   this.authService.signin(body.email,body.password);
      session.userId = user.id;
        return user;
    }

    @Post('/signout')
    signout(@Session() session: Record<string, any>){
        session.userId = null;
        return {message: 'User signed out successfully'};
    }

    @UseInterceptors(new SerializeInterceptor(UserDto))
    @Get('/:id')
   async findUser(@Param('id') id:string){
        const user = await this.userService.findOne(parseInt(id) );
        if(!user){
            throw new NotFoundException('User not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email:string){
        return this.userService.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id:string){
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id:string,@Body() body:UpdateUserDto){
        return this.userService.update(parseInt(id),body);
    }


}

