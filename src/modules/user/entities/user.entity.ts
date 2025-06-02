import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'app_user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true, default: '' })
  gender: string;

  @Column({ nullable: true })
  birth_date: Date;

  @Column()
  created_at: Date;

  @Column()
  current_diet: string;

  @Column()
  rhythm_of_life: string;

  @Column()
  daily_score: number;

  @Column()
  user_role: string;

  @Column({ default: false })
  survey_data: boolean;
}
