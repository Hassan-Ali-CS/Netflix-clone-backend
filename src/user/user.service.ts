import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
// import { Movie } from 'src/movie/entities/movie.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { ResetpassService } from 'src/resetpass/resetpass.service';
import { signupUserDto } from './DTO/signup-user.dto';
// import { loginUserDto } from './DTO/login-user.dto';
// import { AuthService } from 'src/auth/auth.service';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly resetPassService: ResetpassService,
        //@InjectRepository(Movie)
        //private readonly movieRepository: Repository<Movie>,
        //private readonly authService: AuthService
    ){}
    
        async signup(signupDto: signupUserDto): Promise<{message: string; user: User}>{
            console.log(this.userRepository);    //for checking the state of in-memory
            console.log("signup Data:", signupDto);
            const {name, email, password} = signupDto;

            //checks if the email already exists
            const userExists = await this.userRepository.findOne({where: { email } });
            if (userExists){
                console.log("User already exists :", email);
                return { message : 'User with this email already exists', user: null};
            }

            //Create and save the new User
            const newUser = this.userRepository.create ({name, email, password}) ;
            await this.userRepository.save(newUser);

            console.log(this.userRepository);
            console.log("New user added", newUser);
            return{
                message: 'user signuped successfully !',
                user : newUser,
            };
        }

        // async login(loginDto: loginUserDto) {
        //     const { email, password } = loginDto;
        
        //     console.log("Checking user for email:", this.userRepository);
        
        //     const user = await this.userRepository.findOne({ where: { email } });
        
        //     if (!user) {
        //         console.log(" User not found for email:", email);
        //         throw new NotFoundException("Invalid email or password");
        //     }
        
        //     console.log(" User found:", user);
        
        //     // Debug Password Validation
        //     const isPasswordValid = await user.validatePassword(password);
        //     console.log("Password validation result:", isPasswordValid);
        
        //     if (!isPasswordValid) {
        //         console.log(" Incorrect password");
        //         throw new NotFoundException("Invalid email or password");
        //     }
        
        //     console.log("Password is correct. Generating token...");
        
        //     const token = this.authService.generateToken(user); // Ensure generateJwtToken exists
        
        //     return {
        //         message: "Login successful",
        //         userId: user.id,  //  Ensure userId is returned
        //         user,
        //         token,
        //     };
        // }
        

        async forgotPassword(email: string) {
            try {
                const user = await this.userRepository.findOne({ where: { email } });
        
                if (!user) {
                    throw new Error('User with this email does not exist');
                }
        
                const resetToken = uuidv4();
                const hashedToken = await bcrypt.hash(resetToken, 10);
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

            user.password = await bcrypt.hash(newPassword, 10);
            user.resetToken = null;
            user.tokenExpiry = null;
            await this.userRepository.save(user);

            return { message: 'Password reset successfully' };
        }

        // async addToFavourites (userId: number, movieId: number): Promise<{ message: string }> {
        //     const user = await this.userRepository.findOne({ where: { id:userId }, relations: ["favouriteMovies"] });
        //     const movie = await this.movieRepository.findOne({ where: {id:movieId } });

        //     if(!user) throw new NotFoundException("User not Found");
        //     if(!movie) throw new NotFoundException("Movie not Found");

        //     //Prevent Duplicates
        //     if (user.favouriteMovies.some(m => m.id === movie.id)) {
        //         throw new BadRequestException("Movie already in Favourites");
        //     }

        //     user.favouriteMovies.push(movie);
        //     await this.userRepository.save(user);

        //     return { message: "Movie added to favourites" };
        // }

        // async removeFromFavorites(userId: number, movieId: number): Promise<{ message: string }> {
        //     const user = await this.userRepository.findOne({ where: { id: userId }, relations: ["favouriteMovies"] });
    
        //     if (!user) throw new NotFoundException("User not found");
    
        //     user.favouriteMovies = user.favouriteMovies.filter(m => m.id !== movieId);
        //     await this.userRepository.save(user);
    
        //     return { message: "Movie removed from favorites" };
        // }
    
        // async getFavoriteMovies(userId: number): Promise<Movie[]> {
        //     const user = await this.userRepository.findOne({ where: { id: userId }, relations: ["favouriteMovies"] });
    
        //     if (!user) throw new NotFoundException("User not found");
    
        //     return user.favouriteMovies;
        // }
}   
    

    
    
    
