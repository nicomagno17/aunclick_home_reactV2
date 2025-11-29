import { NextRequest, NextResponse } from 'next/server';
import { executeQuerySingle } from '@/lib/database';

/**
 * API endpoint to check the status of OAuth providers
 * Returns availability status for each OAuth provider based on recent success rates
 */
export async function GET(request: NextRequest) {
  try {
    // Check if oauth_provider_status table exists and has data
    let providerStatus;
    
    try {
      // Try to get status from database
      const googleStatus = await executeQuerySingle<{is_available: boolean}>(
        'SELECT is_available FROM oauth_provider_status WHERE provider = ?',
        ['google']
      );
      
      const facebookStatus = await executeQuerySingle<{is_available: boolean}>(
        'SELECT is_available FROM oauth_provider_status WHERE provider = ?',
        ['facebook']
      );
      
      providerStatus = {
        google: googleStatus?.is_available ?? true, // Default to true if no record
        facebook: facebookStatus?.is_available ?? true, // Default to true if no record
      };
    } catch (error) {
      // Table doesn't exist or other database error, default to available
      console.warn('OAuth provider status table not found, defaulting to available:', error);
      providerStatus = {
        google: true,
        facebook: true,
      };
    }

    return NextResponse.json(providerStatus);
  } catch (error) {
    console.error('Error checking OAuth provider status:', error);
    
    // Default to available on error to avoid blocking users
    return NextResponse.json({
      google: true,
      facebook: true,
    });
  }
}