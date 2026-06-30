-- New challenges: streaks, milestones, calendar/interview
insert into public.challenges (title, description, xp_reward, target)
values
  ('Apply Streak — Bronze', 'Apply 3 days in a row to build momentum.', 50, 3),
  ('Apply Streak — Silver', 'Apply 5 days in a row and stay consistent.', 85, 5),
  ('Apply Streak — Gold', 'Apply every day for a full week. Week Warrior unlocked.', 120, 7),
  ('First Step', 'Submit your very first application and start the journey.', 20, 1),
  ('Ten Strong', 'Reach 10 total applications in your pipeline.', 80, 10),
  ('Application Machine', 'Submit 25 total applications. You''re unstoppable.', 200, 25),
  ('Calendar Champion', 'Have 3 interviews scheduled on your calendar.', 90, 3),
  ('Interview Streak', 'Move 2 roles into interviewing status.', 70, 2)
on conflict do nothing;
