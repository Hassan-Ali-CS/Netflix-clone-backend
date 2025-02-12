import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ResetpassService {
    private transporter: nodemailer.Transporter;

    constructor (private readonly configservice: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configservice.get<string>('EMAIL_HOST'),
            port:this.configservice.get<number>('EMAIL_PORT'),
            secure:false,
            auth:{
                user:this.configservice.get<string>('EMAIL_USER'),
                pass:this.configservice.get<string>('EMAIL_PASSWORD'),
            },
        })
    }

    async sendMail(to: string, subject: string, html: string): Promise<void> {
        try{
            await this.transporter.sendMail({
                from: this.configservice.get<string>('EMAIL_USER'),
                to,
                subject,
                html,
            });
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }
}

