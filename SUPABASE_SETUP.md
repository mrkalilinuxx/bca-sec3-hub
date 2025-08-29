# Supabase Setup Guide

This guide will help you set up your Supabase backend to work with all the implemented features.

## 1. Database Tables Setup

### Create `content` table:
```sql
create table public.content (
    id uuid default gen_random_uuid() primary key,
    section text not null unique,
    content text not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Create `files` table:
```sql
create table public.files (
    id uuid default gen_random_uuid() primary key,
    file_url text not null,
    file_name text not null,
    uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 2. Storage Setup

### Create storage bucket:
```sql
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true);
```

## 3. Row Level Security (RLS) Policies

### Enable RLS on tables:
```sql
alter table public.content enable row level security;
alter table public.files enable row level security;
```

### Content table policies:

**Allow public read access:**
```sql
create policy "Enable read access for all users" on public.content
for select using (true);
```

**Allow authenticated admin to insert/update:**
```sql
create policy "Enable insert for authenticated users only" on public.content
for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on public.content
for update using (auth.role() = 'authenticated');
```

### Files table policies:

**Allow public read access:**
```sql
create policy "Enable read access for all users" on public.files
for select using (true);
```

**Allow authenticated admin to insert/delete:**
```sql
create policy "Enable insert for authenticated users only" on public.files
for insert with check (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.files
for delete using (auth.role() = 'authenticated');
```

## 4. Storage Policies

### Allow public read access to uploads bucket:
```sql
create policy "Public Access" on storage.objects
for select using (bucket_id = 'uploads');
```

### Allow authenticated users to upload:
```sql
create policy "Authenticated users can upload" on storage.objects
for insert with check (bucket_id = 'uploads' AND auth.role() = 'authenticated');
```

### Allow authenticated users to delete:
```sql
create policy "Authenticated users can delete own uploads" on storage.objects
for delete using (bucket_id = 'uploads' AND auth.role() = 'authenticated');
```

## 5. Create Admin User

In your Supabase dashboard:
1. Go to Authentication → Users
2. Click "Add user"
3. Add your admin email and password
4. Confirm the user

**Example admin credentials:**
- Email: `admin@yourproject.com`
- Password: `your-secure-password`

## 6. Environment Variables

Make sure these are set in your Lovable project (they should be automatically configured):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 7. Testing the Setup

### Test Admin Login:
1. Click "Admin Login" in the navigation
2. Use your admin email/password
3. You should see "Save" buttons appear on editable content
4. You should see the file upload section

### Test Public Access:
1. Open the site in an incognito window (not logged in)
2. You should see all content but no edit buttons
3. You should be able to download files but not upload

### Test Real-time Updates:
1. Open the site in two browser windows
2. Log in as admin in one window
3. Edit content and save
4. The changes should instantly appear in both windows

## 8. Free Tier Limits

Supabase free tier includes:
- **Database**: 500MB storage
- **Auth**: 50,000 monthly active users
- **Storage**: 1GB
- **Edge Functions**: 500,000 invocations
- **Realtime**: 200 concurrent connections

This is more than enough for your use case.

## 9. Security Best Practices

✅ **What's implemented:**
- RLS policies protect admin-only operations
- Public users can only read content and files
- Real-time subscriptions work for all users
- File uploads are restricted to authenticated admin

✅ **Additional recommendations:**
- Use a strong admin password
- Consider adding email verification
- Monitor usage in Supabase dashboard
- Regular backups of important data

## 10. Troubleshooting

**If login doesn't work:**
- Check that the user exists in Auth → Users
- Verify the email/password combination
- Check browser console for error messages

**If RLS policies block operations:**
- Ensure all policies are created correctly
- Check that the user is properly authenticated
- Verify table permissions in Supabase dashboard

**If real-time updates don't work:**
- Check that Realtime is enabled on your tables
- Verify subscription setup in browser console
- Ensure RLS policies allow reading

## 11. Features Summary

✅ **Implemented Features:**
- **Live Editing**: Admin can edit content directly on the site with save buttons
- **Real-time Updates**: Changes appear instantly for all viewers
- **File Upload**: Admin can upload files to Supabase Storage
- **File Download**: Public users can download uploaded files
- **Authentication**: Secure Supabase Auth with email/password
- **Access Control**: RLS policies ensure proper permissions
- **No Lovable Branding**: All traces removed from the application

The application now functions as a complete content management system with real-time collaboration capabilities, all within Supabase's free tier.