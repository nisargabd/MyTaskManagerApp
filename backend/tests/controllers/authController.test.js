
const {register} = require('../../controllers/authController');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../models');
const { DESCRIBE } = require('sequelize/lib/query-types');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../models');

describe('Auth Controller', () => {
  let res;

  beforeEach(() => {
    res = {status : jest.fn().mockReturnThis(), json: jest.fn() }; 
    
    jest.clearAllMocks();
  });

  describe('register', ()=>{
   it('should register a new user', async ()=>{
    const req = {
        body:{
            username: 'testuser',
            email: 'test@gmail.com',
            password: 'password123',
            role: 'user'
        }
    };
    db.User.findOne.mockResolvedValue(null);
    Bcrypt.hash.mockResolvedValue('hashedpassword');
    db.User.create.mockResolvedValue({id:1, ...req.body, password: 'hashedpassword'});

    await register (req, res);

    expect(db.User.findOne).toHaveBeenCalledWith({where: {email: 'test@gmail.com'}});
    expect(Bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    expect(db.User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({message: 'User registered successfully'});
   });

   it('should not register and return 401 if user exists', async ()=>{
    const req = {
        body:{
            username: 'testuser',
            email: 'test@gmail.com',
            password: 'password123'
        }
    };
    db.User.findOne.mockResolvedValue({id:1});

    await register(req, res);

    expect(res.json).toHaveBeenCalledWith({message: 'User already exists'});
    expect(res.status).toHaveBeenCalledWith(409);
});

  });


});

