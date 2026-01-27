
-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    company_name TEXT,
    industry TEXT,
    role TEXT DEFAULT 'Admin',
    plan TEXT DEFAULT 'Essentials',
    is_pro BOOLEAN DEFAULT false,
    framework_limit INTEGER DEFAULT 2,
    user_limit INTEGER DEFAULT 1,
    credits_total INTEGER DEFAULT 15,
    credits_remaining INTEGER DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. AUDIT PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.audit_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    frameworks TEXT[] DEFAULT '{}',
    readiness_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Draft',
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_projects ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view company profiles" ON public.profiles;
CREATE POLICY "Users can view company profiles" ON public.profiles FOR SELECT 
USING (company_name = (SELECT company_name FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can view own projects" ON public.audit_projects;
CREATE POLICY "Users can view own projects" ON public.audit_projects FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own projects" ON public.audit_projects;
CREATE POLICY "Users can create own projects" ON public.audit_projects FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON public.audit_projects;
CREATE POLICY "Users can update own projects" ON public.audit_projects FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON public.audit_projects;
CREATE POLICY "Users can delete own projects" ON public.audit_projects FOR DELETE USING (auth.uid() = user_id);

-- 5. TRIGGER FOR NEW USERS
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, plan, credits_remaining, framework_limit, user_limit, credits_total)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    'Essentials',
    15,
    2,
    1,
    15
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(public.profiles.first_name, EXCLUDED.first_name),
    last_name = COALESCE(public.profiles.last_name, EXCLUDED.last_name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
