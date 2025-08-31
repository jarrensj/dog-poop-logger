import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabase, Poop } from '@/lib/supabase'

// GET /api/poops - Get user's poop logs with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const dogName = searchParams.get('dog_name')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    // Build query - filter directly by Clerk user ID
    let query = supabase
      .from('poops')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (dogName) {
      query = query.eq('dog_name', dogName)
    }
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data: poops, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ poops: poops || [] })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/poops - Create a new poop log
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { dog_name, location, notes, photo_url, poop_time } = body

    // Validate required fields
    if (!dog_name) {
      return NextResponse.json({ error: 'Dog name is required' }, { status: 400 })
    }

    const poopData = {
      user_id: userId, // Use Clerk user ID directly
      dog_name,
      location: location || null,
      notes: notes || null,
      photo_url: photo_url || null,
      // If poop_time is provided, use it; otherwise let DB handle with NOW()
      ...(poop_time && { created_at: new Date(poop_time).toISOString() })
    }

    const { data: poop, error } = await supabase
      .from('poops')
      .insert([poopData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ poop }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
