import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/modules/user/entities/user.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let mockUserRepo;

  beforeAll(async () => {
    // Mock the user repository
    mockUserRepo = {
      findOne: jest.fn(),
    };

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepo)
      .compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
  
  // Test for current user endpoint - would need a valid JWT token
  it('/api/current-user (GET) - unauthorized without token', () => {
    return request(app.getHttpServer())
      .get('/api/current-user')
      .expect(401);
  });

  it('/api/current-user (GET) - authorized with token', async () => {
    // Set up mock user
    const testUser = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      user_role: 'customer',
    };
    
    // Mock the findOne method to return our test user
    mockUserRepo.findOne.mockResolvedValue(testUser);
    
    // Generate a real token
    const token = jwtService.sign({ 
      sub: testUser.id, 
      email: testUser.email,
      user_role: testUser.user_role
    });

    // Test with the token
    return request(app.getHttpServer())
      .get('/api/current-user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.id).toEqual(testUser.id);
      });
  });
});
