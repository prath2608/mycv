
import { Entity,Column,OneToMany,PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove } from "typeorm";

import { Report } from "../reports/report.entity";


@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email:string;

    
    @Column()
    password:string;

    @OneToMany(()=> Report, (report) => report.user)
    reports:Report[];

    @AfterInsert()
    logInsert(){
        console.log('inserted user with id ',this.id);
        
    }

    @Column({default:true})
    admin:boolean;

    @AfterUpdate()
    logUpdate(){
        console.log('Updated user with id ',this.id);
        
    }

    @AfterRemove()
    logRemove(){
        console.log('Removed user with id ',this.id);
    }
}


