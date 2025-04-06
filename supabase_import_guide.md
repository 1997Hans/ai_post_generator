# Supabase CSV Import Guide

This guide explains how to create tables and import the provided CSV files into your Supabase database.

## Option 1: Use the SQL Editor (Recommended)

1. In your Supabase dashboard, navigate to the **SQL Editor** in the left sidebar
2. Create a new query and paste the contents of the `supabase_table_creation.sql` file
3. Run the query to create all tables with proper relationships and RLS policies

After creating the tables, you can import the sample data.

## Option 2: Create Tables Manually and Import CSV

If you prefer creating tables manually through the UI:

### Step 1: Create Tables

Create each table with the following structure:

#### Posts Table
- `id`: uuid (primary key, default: gen_random_uuid())
- `created_at`: timestamptz (not null, default: now())
- `updated_at`: timestamptz (not null, default: now())
- `content`: text (not null)
- `image_url`: text (not null)
- `hashtags`: text[] (not null, default: '{}')
- `prompt`: text (not null)
- `refined_prompt`: text (null)
- `tone`: text (not null)
- `visual_style`: text (not null)
- `user_id`: uuid (null)
- `approved`: boolean (not null, default: false)

#### Feedback Table
- `id`: uuid (primary key, default: gen_random_uuid())
- `created_at`: timestamptz (not null, default: now())
- `post_id`: uuid (not null, references posts.id)
- `feedback_text`: text (not null)
- `user_id`: uuid (null)

#### Users Table
- `id`: uuid (primary key, default: gen_random_uuid())
- `created_at`: timestamptz (not null, default: now())
- `email`: text (not null, unique)
- `name`: text (null)
- `role`: text (not null, default: 'user')

### Step 2: Set Up Foreign Key Relationships
- `feedback.post_id` → `posts.id`
- `feedback.user_id` → `users.id`
- `posts.user_id` → `users.id`

### Step 3: Import CSV Data

1. In your Supabase dashboard, navigate to the **Table Editor**
2. Select the table you want to import data into
3. Click the **Import** button (near the top right of the table)
4. Select the corresponding CSV file:
   - `users.csv` for the users table (import this first)
   - `posts.csv` for the posts table (import this second)
   - `feedback.csv` for the feedback table (import this last)
5. Configure the import settings:
   - Choose "CSV" as the format
   - Enable "Header row included in file"
   - Set "Delimiter" to comma (,)
6. Click "Import" to load the data

**Important**: Import the tables in this order: 
1. users
2. posts 
3. feedback

This is necessary because of the foreign key relationships.

## Import Order Matters

Because of the foreign key relationships, you must import the data in this order:

1. First import the `users` table data
2. Then import the `posts` table data
3. Finally import the `feedback` table data

This ensures that referenced records exist before importing records that reference them.

## Troubleshooting

If you encounter errors when importing:

- Check that the column names in your CSV exactly match the table column names
- Verify the UUIDs used in foreign key relationships exist in the referenced tables
- Ensure the data formats match the column types (especially for timestamps and arrays)
- For array fields (like hashtags), ensure they follow the format: "{value1,value2,value3}" 