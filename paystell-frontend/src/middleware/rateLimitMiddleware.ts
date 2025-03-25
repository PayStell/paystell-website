import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for rate limiting
// In production, you would use Redis or another distributed store
const ipRequestMap = new Map<string, { count: number, resetTime: number }>();

/**
 * Rate limiting middleware to prevent brute force attacks
 * 
 * This middleware limits the number of requests from a single IP address
 * within a specific time window.
 * 
 * @param request The incoming request
 * @param maxRequests Maximum number of requests allowed in the time window
 * @param windowMs Time window in milliseconds
 * @returns Either the response object with an error or undefined to continue
 */
export async function rateLimitMiddleware(
  request: NextRequest,
  maxRequests = 5,
  windowMs = 60 * 1000 // 1 minute
) {
  // Get the IP address from the request
  const ip = request.ip || 'unknown';
  const now = Date.now();
  
  // Get current request count for this IP
  const ipData = ipRequestMap.get(ip) || { count: 0, resetTime: now + windowMs };
  
  // If the reset time has passed, reset the counter
  if (now > ipData.resetTime) {
    ipData.count = 0;
    ipData.resetTime = now + windowMs;
  }
  
  // Increment the request count
  ipData.count += 1;
  ipRequestMap.set(ip, ipData);
  
  // If the request count exceeds the maximum, reject the request
  if (ipData.count > maxRequests) {
    const secondsToReset = Math.ceil((ipData.resetTime - now) / 1000);
    
    return NextResponse.json(
      { 
        success: false, 
        message: `Too many requests. Please try again in ${secondsToReset} seconds.` 
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(ipData.resetTime / 1000).toString(),
          'Retry-After': secondsToReset.toString()
        }
      }
    );
  }
  
  // If rate limit is not exceeded, continue to the API route
  return undefined;
} 