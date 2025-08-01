import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";
 
describe("AuthService", () => {
 
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;
 
    beforeEach(async () => {


 
 
        const users: User[] = [];
        // Create a fake version of UsersService
      fakeUsersService = {
       
 
          find: (email:string) => {
            const filteredUsers = users.filter((user: User) => user.email === email);
            return Promise.resolve(filteredUsers);
          },
          create: (email: string, password: string) => {
            const user ={ id: Math.floor(Math.random() * 999999), email, password } as User;
            users.push(user );
            return Promise.resolve(user);
          }  
         };
 
         const module =await Test.createTestingModule({
         providers: [AuthService,{
            provide: UsersService,
            useValue: fakeUsersService
        }],
      }).compile();
 
     service = module.get(AuthService);
 
    });
 
 
    it('can create an instance of AuthService', async () => {
 
    expect(service).toBeDefined();
    });
 
    it('creates a new user with a salted and hashed password', async () => {
 
        const user = await service.signup('asdf@asdf.com', 'asdf');
 
        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });
 
    it('throws an error if user signs up with email that is in use', async () => {
 
        fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
        await expect(service.signup('prathmesh@gmail.com', '12345678')).rejects.
        toThrow(
            BadRequestException
        );
   
 
    });
 
    it('throws if signin is called with an unused email', async () => {
 
        await expect(service.signin('aaa123@gmail.com', '12345678')).rejects.toThrow(
            NotFoundException
        );
    });
 
    it('throws if an invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { email: 'asdf@asdf.com', password: 'laskdjf' } as User,
      ]);
    await expect(
      service.signin('laskdjf@alskdfj.com', 'passowrd'),
    ).rejects.toThrow(BadRequestException);
  });
 
  it('returns a user if correct password is provided', async () => {
      await service.signup('asdf@asdf.com', 'myPassword');
        const user = await service.signin('asdf@asdf.com', 'myPassword');
        expect(user).toBeDefined();
 
   
    });
 
});
 