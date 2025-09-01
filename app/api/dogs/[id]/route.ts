import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

// GET /api/dogs/[id] - Get a specific dog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data: dog, error } = await supabase
      .from('dogs')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Dog not found' }, { status: 404 });
      }
      console.error('Error fetching dog:', error);
      return NextResponse.json({ error: 'Failed to fetch dog' }, { status: 500 });
    }

    return NextResponse.json({ dog });
  } catch (error) {
    console.error('Error in GET /api/dogs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/dogs/[id] - Update a specific dog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
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

    const updateData = {
      name: name.trim(),
      picture_url: picture_url ? picture_url.trim() : null
    };

    const { data: dog, error } = await supabase
      .from('dogs')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Dog not found' }, { status: 404 });
      }
      console.error('Error updating dog:', error);
      return NextResponse.json({ error: 'Failed to update dog' }, { status: 500 });
    }

    return NextResponse.json({ dog });
  } catch (error) {
    console.error('Error in PUT /api/dogs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/dogs/[id] - Delete a specific dog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { error } = await supabase
      .from('dogs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting dog:', error);
      return NextResponse.json({ error: 'Failed to delete dog' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Dog deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/dogs/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
