import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import User from '@/models/User.model';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, role } = await request.json();

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // HR users must have a password
    if (role === 'hr' && !password) {
      return NextResponse.json({ error: 'Password is required for HR users' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    let hashedPassword = undefined;
    if (role === 'hr' && password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
    });

    // Create token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
