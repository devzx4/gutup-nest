import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);
    
    // Set default values if not provided
    const userToCreate: CreateUserDto = {
      ...createUserDto,
      created_at: createUserDto.created_at || new Date(),
      user_role: createUserDto.user_role || 'trainee',
      daily_score: createUserDto.daily_score || 0,
      current_diet: createUserDto.current_diet || 'unspecified',
      rhythm_of_life: createUserDto.rhythm_of_life || 'unspecified',
      gender: createUserDto.gender || 'unspecified', // Ensure gender always has a value
    };

    this.logger.log(`Creating user with data: ${JSON.stringify(userToCreate)}`);

    // Create a new user entity
    const user = this.userRepo.create(userToCreate);
    
    try {
      // Save the user and ensure we get a single User entity back
      const savedUser = await this.userRepo.save(user);
      
      // TypeORM's save can return an array, but in this case we know it's a single entity
      return Array.isArray(savedUser) ? savedUser[0] : savedUser;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
