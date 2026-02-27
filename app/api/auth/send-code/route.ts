import { NextResponse } from "next/server";
import { createTransport } from "nodemailer";
import { getDataSource } from "../../connection";
import { UsersService } from "../../services/user.service";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const ds = await getDataSource();
    const userService = new UsersService(ds);

    const otp = await userService.generateAndSaveOtp(email);

    const transporter = createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_SERVER_FROM,
      subject: "Your login code",
      html: `<h3>Code: <b>${otp}</b></h3><p>Expires in 10 minutes.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Send code error" }, { status: 500 });
  }
}
