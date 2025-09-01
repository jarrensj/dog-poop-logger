import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export interface Dog {
  id: string;
  user_id: string;
  name: string;
  picture_url?: string;
  created_at: string;
  updated_at: string;
}

// GET /api/dogs - Get all dogs for the authenticated user
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: dogs, error } = await supabase
      .from('dogs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching dogs:', error);
      return NextResponse.json({ error: 'Failed to fetch dogs' }, { status: 500 });
    }

    return NextResponse.json({ dogs: dogs || [] });
  } catch (error) {
    console.error('Error in GET /api/dogs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/dogs - Create a new dog
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, picture_url } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Dog name is required' }, { status: 400 });
    }

    if (name.trim().length > 50) {
      return NextResponse.json({ error: 'Dog name must be 50 characters or less' }, { status: 400 });
    }

    // Optional picture_url validation
    if (picture_url && (typeof picture_url !== 'string' || picture_url.length > 500)) {
      return NextResponse.json({ error: 'Invalid picture URL' }, { status: 400 });
    }

    const dogData = {
      user_id: userId,
      name: name.trim(),
      ...(picture_url && { picture_url: picture_url.trim() })
    };

    const { data: dog, error } = await supabase
      .from('dogs')
      .insert([dogData])
      .select()
      .single();

    if (error) {
      console.error('Error creating dog:', error);
      return NextResponse.json({ error: 'Failed to create dog' }, { status: 500 });
    }

    return NextResponse.json({ dog }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/dogs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
