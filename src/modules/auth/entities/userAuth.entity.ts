import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_auth' })
export class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  auth_type: string; // 'google', 'email', etc.

  @Column({ nullable: true, default: '' })
  google_id: string;

  @Column({ nullable: true, default: '' })
  password_hash: string;

  @Column()
  user_id: number;
}
