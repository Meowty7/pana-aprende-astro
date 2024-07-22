// src/pages/prerender.ts
import type { APIRoute } from 'astro';

export const prerender: APIRoute = async ({ locals }) => {
  console.log('Locals:', locals); // Log locals to ensure it's populated correctly
  const userData = locals.user; // Access the user data from locals

  if (!userData) {
    console.error('User data is null or undefined');
  } else {
    console.log('User data:', userData); // Log userData to check its content
  }

  return new Response(JSON.stringify(userData || {}), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
