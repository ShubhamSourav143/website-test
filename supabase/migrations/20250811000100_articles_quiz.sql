-- Articles (Posts), Likes, Comments, Follows, and Quiz schema with RLS

-- Extend profiles with public_posts flag (default true) if not exists
alter table if exists profiles
  add column if not exists public_posts boolean not null default true;

-- Posts
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table posts enable row level security;

-- Public read if author's profile allows public posts, or if viewer is the author, or follower
create policy if not exists "Public or follower can read post"
  on posts for select to public
  using (
    exists (
      select 1 from profiles p where p.id = posts.author_id and p.public_posts = true
    )
    or auth.uid() = author_id
    or exists (
      select 1 from follows f where f.follower_id = auth.uid() and f.followed_id = posts.author_id
    )
  );

-- Only authenticated members can create posts for themselves
create policy if not exists "Members can create posts"
  on posts for insert to authenticated
  with check (
    auth.uid() = author_id
    and exists (select 1 from profiles p where p.id = auth.uid() and p.is_member = true)
  );

-- Only authors can update/delete their posts
create policy if not exists "Authors can update posts"
  on posts for update to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy if not exists "Authors can delete posts"
  on posts for delete to authenticated
  using (auth.uid() = author_id);

-- Follows
create table if not exists follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  followed_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, followed_id)
);

alter table follows enable row level security;

create policy if not exists "Authenticated users can manage their follows"
  on follows for all to authenticated
  using (auth.uid() = follower_id)
  with check (auth.uid() = follower_id);

-- Post Likes
create table if not exists post_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references posts(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, post_id)
);

alter table post_likes enable row level security;

create policy if not exists "Members can like posts"
  on post_likes for insert to authenticated
  with check (
    auth.uid() = user_id and exists (select 1 from profiles p where p.id = auth.uid() and p.is_member = true)
  );

create policy if not exists "Users can remove their likes"
  on post_likes for delete to authenticated
  using (auth.uid() = user_id);

create policy if not exists "Anyone can read likes"
  on post_likes for select to public
  using (true);

-- Comments
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

alter table comments enable row level security;

create policy if not exists "Members can comment"
  on comments for insert to authenticated
  with check (
    auth.uid() = author_id and exists (select 1 from profiles p where p.id = auth.uid() and p.is_member = true)
  );

create policy if not exists "Authors can manage their comments"
  on comments for update to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy if not exists "Authors can delete their comments"
  on comments for delete to authenticated
  using (auth.uid() = author_id);

create policy if not exists "Anyone can read comments"
  on comments for select to public
  using (true);

-- Quizzes
create table if not exists quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  is_member_only boolean not null default false,
  num_questions integer not null default 0,
  description text,
  created_at timestamptz default now()
);

alter table quizzes enable row level security;

create policy if not exists "Public can see public quizzes; members see all"
  on quizzes for select to public
  using (
    not is_member_only
    or exists (select 1 from profiles p where p.id = auth.uid() and p.is_member = true)
  );

-- Quiz Questions
create table if not exists quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  question_text text not null,
  options text[] not null default '{}',
  correct_answer text not null,
  created_at timestamptz default now()
);

alter table quiz_questions enable row level security;

create policy if not exists "Public can read quiz questions for allowed quizzes"
  on quiz_questions for select to public
  using (
    exists (
      select 1 from quizzes q
      where q.id = quiz_questions.quiz_id
        and (
          not q.is_member_only or exists (
            select 1 from profiles p where p.id = auth.uid() and p.is_member = true
          )
        )
    )
  );

-- Quiz Attempts
create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null,
  created_at timestamptz default now()
);

alter table quiz_attempts enable row level security;

create policy if not exists "Users can insert attempts (member-only guarded)"
  on quiz_attempts for insert to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from quizzes q
      where q.id = quiz_id
        and (
          not q.is_member_only
          or exists (select 1 from profiles p where p.id = auth.uid() and p.is_member = true)
        )
    )
  );

create policy if not exists "Users can read their own attempts"
  on quiz_attempts for select to authenticated
  using (auth.uid() = user_id);

-- Seed a sample public quiz with one random question
with new_quiz as (
  insert into quizzes (title, category, is_member_only, num_questions, description)
  values ('Animal Trivia #1', 'general', false, 1, 'A fun starter question')
  returning id
)
insert into quiz_questions (quiz_id, question_text, options, correct_answer)
select id,
  'Which animal is known as the "Ship of the Desert"?',
  array['Camel','Horse','Elephant','Dog']::text[],
  'Camel'
from new_quiz;


