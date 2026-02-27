import { User } from "@/app/api/entities/user.entity";
import { CreateUser } from "@/lib/types/user";
import { DataSource, Repository } from "typeorm";

export class UsersService {
  constructor(private dataSource: DataSource) {}

  private get repo(): Repository<User> {
    return this.dataSource.getRepository(User);
  }

  async findOrCreateByEmail(userData: CreateUser) {
    let user = await this.repo.findOne({
      where: { email: userData.email },
    });

    if (!user) {
      user = this.repo.create({
        name: userData.name,
        email: userData.email,
        emailVerified: new Date(),
      });
      await this.repo.save(user);
    }

    return user;
  }

  async generateAndSaveOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    let user = await this.repo.findOneBy({ email });
    if (!user) {
      user = this.repo.create({
        email: email,
        otpCode: otp,
        otpExpires: expires,
      });
    } else {
      user.otpCode = otp;
      user.otpExpires = expires;
    }

    await this.repo.save(user);
    return otp;
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.repo.findOneBy({ email, otpCode: otp });

    if (!user || !user.otpExpires || user.otpExpires < new Date()) {
      return null;
    }

    if (!user.emailVerified) {
      user.emailVerified = new Date();
    }

    await this.repo.save(user);

    return user;
  }
}
