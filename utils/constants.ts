export const protocol = process.env.NODE_ENV === 'production' ? 'https': 'http';
export const publicUrl = `${protocol}://${process.env.NEXT_PUBLIC_HOST}`
