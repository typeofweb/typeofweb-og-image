export const protocol = process.env.VERCEL ? 'https': 'http';
export const publicUrl = `${protocol}://${process.env.NEXT_PUBLIC_HOST}`
