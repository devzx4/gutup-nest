import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserAuth } from '@modules/auth/entities/userAuth.entity';
import { Password } from '@utils/password';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserAuth) private userAuthRepo: Repository<UserAuth>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user with email: ${createUserDto.email}`);

    // Set default values if not provided, but keep birth_date as null if not provided
    const userToCreate: CreateUserDto = {
      ...createUserDto,
      birth_date: createUserDto.birth_date || null, // Keep null if not provided
      created_at: createUserDto.created_at || new Date(),
      user_role: createUserDto.user_role || 'customer',
      daily_score: createUserDto.daily_score || 0,
      current_diet: createUserDto.current_diet || 'unspecified',
      rhythm_of_life: createUserDto.rhythm_of_life || 'unspecified',
      gender: createUserDto.gender || 'unspecified',
    };

    // Check if survey data is complete or not
    const surveyComplete = this.isSurveyDataComplete(userToCreate);
    userToCreate.survey_data = surveyComplete;

    this.logger.log(`Creating user with data: ${JSON.stringify(userToCreate)}`);

    // Check if user already exists
    const existing = await this.userRepo.findOne({ where: { email: userToCreate.email } });
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    // Create a new user entity
    const user = this.userRepo.create(userToCreate);

    try {
      // Save the user and ensure we get a single User entity back
      const savedUser = await this.userRepo.save(user);

      // Create user_auth record with hashed password if password is provided
      if ((createUserDto as any).password) {
        const passwordHash = await Password.toHash((createUserDto as any).password);
        const userAuth = this.userAuthRepo.create({
          user_id: savedUser.id,
          auth_type: 'email',
          password_hash: passwordHash,
          google_id: '',
        });
        await this.userAuthRepo.save(userAuth);
      }

      return Array.isArray(savedUser) ? savedUser[0] : savedUser;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Check if the user has completed their survey data
   * Returns true if all survey fields have valid values, false otherwise
   */
  private isSurveyDataComplete(userData: CreateUserDto): boolean {
    // Check if gender is missing or empty
    if (!userData.gender || userData.gender === '' || userData.gender === 'unspecified') {
      return false;
    }

    // Check birth_date - must be provided and not null
    if (!userData.birth_date) {
      return false;
    }

    // Check current_diet
    if (!userData.current_diet || userData.current_diet === '' || userData.current_diet === 'unspecified') {
      return false;
    }

    // Check rhythm_of_life
    if (!userData.rhythm_of_life || userData.rhythm_of_life === '' || userData.rhythm_of_life === 'unspecified') {
      return false;
    }

    // Check daily_score - consider 0 as a valid value if that's appropriate for your app
    if (userData.daily_score === null || userData.daily_score === undefined) {
      return false;
    }
    // All survey data is complete
    return true;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
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
