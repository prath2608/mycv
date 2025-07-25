import { Entity,ManyToOne,Column,PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";


@Entity()
export class Report{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    make:string;

    @Column({default: false})
    approved:boolean;

    @Column()
    model:string;

    @Column()
    year:number;

    @Column()
    price:number;

    @Column()
    lng:number;

    @Column()
    lat:number;

    @Column()
    mileage:number;

    @ManyToOne(()=>User,(user)=>user.reports)
    user:User;

  


}