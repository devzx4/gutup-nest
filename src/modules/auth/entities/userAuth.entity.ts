import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_auth' })
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  auth_type: string;

  @Column()
  google_id: string;

  @Column()
  password_hash: string;

  @Column()
  user_id: number;
}
