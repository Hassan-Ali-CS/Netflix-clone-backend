import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ResetpassService } from 'src/resetpass/resetpass.service';
import { signupUserDto } from './DTO/signup-user.dto';
import { loginUserDto } from './DTO/login-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly resetPassService: ResetpassService,
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
        private readonly authService: AuthService,
        private readonly configService: ConfigService
    ){}

        // Hash password before saving
    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    // Validate password
    private async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        console.log("Validating password...");
        console.log("Entered password:", plainPassword);
        console.log("Stored hashed password:", hashedPassword);

        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error("bcrypt compare error:", error);
            return false;
        }
    }
    
    // Method to generate a 4-digit verification code.
    private generateverficationCode(): string {
        const randomCode = Math.floor(Math.random() * 9000) + 1000;
        return randomCode.toString();
    }
    
        async signup(signupDto: signupUserDto): Promise<{message: string; user: User}>{
            console.log(this.userRepository);    //for checking the state of in-memory
            console.log("signup Data:", signupDto);
            console.log("Signing-up user", signupDto.email)
            const {name, email, password} = signupDto;

            //checks if the email already exists
            const userExists = await this.userRepository.findOne({where: { email } });
            if (userExists){
                console.log("User already exists :", email);
                return { message : 'User with this email already exists', user: null};
            }

            //Password are hashed before saving
            //Ensure password hashing
            const hashedPassword = await this.hashPassword(password);
            console.log("Hashed password:", hashedPassword);

            //Generate and save the verification code
            const verficationCode = this.generateverficationCode();
            //Create and save the new User
            const newUser = this.userRepository.create ({ 
                name, 
                email, 
                password: hashedPassword,
                isActive: false,
                verficationCode, 
            });
            await this.userRepository.save(newUser);

            //send verification email
            const emailBody = `Your verification is ${verficationCode}`;
            await this.resetPassService.sendMail(email, 'Email Verification', emailBody);

            console.log(this.userRepository);
            console.log("New user added", newUser);
            return{
                message: 'user signuped successfully !',
                user : newUser,
            };
        }

        //Method to verify email with code
        async verifyEmail(userId: number, code: string ): Promise<{ message: string }> {
            const user = await this.userRepository.findOne({ where: { id: userId } });

            if (!user) {
                throw new BadRequestException("User nOt Found");
            }

            if (user.verficationCode !== code) {
                throw new BadRequestException('Invalid verification code')
            }

            //If the code is correct then change the value of isActive to true and clear the VerifcationCode
            user.isActive = true;
            user.verficationCode = null;
            await this.userRepository.save(user)

            return { message: 'Email successfully  verified'}
        }

        async login(loginDto: loginUserDto) {
            const { email, password } = loginDto;
        
            console.log("Checking user for email:", this.userRepository);
            console.log("Checking user for email:", email);
        
            const user = await this.userRepository.findOne({ where: { email } });
        
            if (!user) {
                console.log(" User not found for email:", email);
                throw new NotFoundException("Invalid email or password");
            }
        
            console.log(" User found:", user);
        
            // Ensure validate password works-Debug Password Validation
            // const isPasswordValid = await user.validatePassword(password);
            console.log(password, user.password);
            const isPasswordValid = await this.validatePassword(password, user.password);

            console.log("Password validation result:", isPasswordValid);
        
            if (!isPasswordValid) {
                console.log(" Incorrect password");
                throw new NotFoundException("Invalid email or password");
            }
        
            console.log("Password is correct. Generating token...");
        
            const token = this.authService.generateToken({sub: user.id, email:user.email}); // Ensure generateJwtToken exists
        
            return {
                message: "Login successful",
                userId: user.id,  //  Ensure userId is returned
                token,
            };
        }
        

        async forgotPassword(email: string) {
            try {
                const user = await this.userRepository.findOne({ where: { email } });
        
                if (!user) {
                    throw new Error('User with this email does not exist');
                }
        
                const resetToken = uuidv4();
                const hashedToken = await this.hashPassword(resetToken);
                user.resetToken = hashedToken;
                user.tokenExpiry = new Date(Date.now() + 3600000);  // Token valid for 1 hour
                await this.userRepository.save(user);
        
                const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
                const emailBody = `Click here to reset your password: <a href="${resetLink}">${resetLink}</a>`
        
                // Send email using ResetpassService
                await this.resetPassService.sendMail(user.email, 'Password Reset Request', emailBody)
        
                return { message: 'Reset password email sent' };
            } catch (error) {
                console.error("Forgot Password Error:", error);  
                throw new Error(`Failed to process forgot password: ${error.message}`);
            }
        }
        
        

        async resetPassword(token: string, newPassword: string) {
            const user = await this.userRepository.findOne({ where: { resetToken: token } });

            if (!user || user.tokenExpiry < new Date()) {
            return { message: 'Invalid or expired token' };
            }

            user.password = await this.hashPassword(newPassword);
            user.resetToken = null;
            user.tokenExpiry = null;
            await this.userRepository.save(user);

            return { message: 'Password reset successfully' };
        }

        async addToFavourites (userId: number, movieId: number): Promise<{ message: string }> {
            const user = await this.userRepository
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.favouriteMovies", "movie")
                .where("user.id = :id", { id: userId })
                .getOne();

            if(!user) throw new NotFoundException("User not Found");

            const movie = await this.movieRepository.findOne({ where: {id:movieId } });
            if(!movie) throw new NotFoundException("Movie not Found");

            //Prevent Duplicates
            const isMovieAlreadyAdded = await this.userRepository
                .createQueryBuilder("user")
                .leftJoin("user.favouriteMovies", "movie")
                .where("user.id = :userId", { userId})
                .andWhere("movie.id = :movieId", { movieId })
                .getOne();
            if(isMovieAlreadyAdded) {
                throw new BadRequestException("Movie Already in Favourites")
            }

            user.favouriteMovies.push(movie);
            // user.favouriteMovies = [...user.favouriteMovies, movie];
            await this.userRepository.save(user);

            return { message: "Movie added to favourites" };
        }

        async removeFromFavorites(userId: number, movieId: number): Promise<{ message: string }> {
            const user = await this.userRepository.findOne({ where: { id: userId }, relations: ["favouriteMovies"] });
    
            if (!user) throw new NotFoundException("User not found");
    
            user.favouriteMovies = user.favouriteMovies.filter(m => m.id !== movieId);
            await this.userRepository.save(user);
    
            return { message: "Movie removed from favorites" };
        }
    
        async getFavoriteMovies(userId: number): Promise<Movie[]> {
            const user = await this.userRepository.findOne({ where: { id: userId }, relations: ["favouriteMovies"] });
    
            if (!user) throw new NotFoundException("User not found");
    
            return user.favouriteMovies;
        }
}   
    

    
    
    
