import{
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserDto } from 'src/users/dtos/user.dto';

interface ClassConstructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto)); 
}

export class SerializeInterceptor implements NestInterceptor {

  constructor(private dto: any) {}
  intercept(context:ExecutionContext,handler:CallHandler):Observable<any>{
    

    return handler.handle().pipe(
      map((data:any)=>{
       return plainToInstance (this.dto,data,{
        excludeExtraneousValues:true, // Exclude properties not decorated with @Expose
       })
      })
    );
    
  }

}