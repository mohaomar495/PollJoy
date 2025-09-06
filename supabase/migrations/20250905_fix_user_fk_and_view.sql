-- Create a view in the public schema that exposes auth.users
CREATE OR REPLACE VIEW public.users AS
SELECT * FROM auth.users;

-- (Optional) Drop the existing foreign key constraint on polls.user_id if you want to allow any UUID
-- Otherwise, keep the original constraint referencing auth.users(id)
-- DO $$
-- DECLARE
--     constraint_name text;
-- BEGIN
--     SELECT tc.constraint_name INTO constraint_name
--     FROM information_schema.table_constraints AS tc
--     JOIN information_schema.key_column_usage AS kcu
--       ON tc.constraint_name = kcu.constraint_name
--     WHERE tc.table_schema = 'public'
--       AND tc.table_name = 'polls'
--       AND tc.constraint_type = 'FOREIGN KEY'
--       AND kcu.column_name = 'user_id';
--
--     IF constraint_name IS NOT NULL THEN
--         EXECUTE format('ALTER TABLE public.polls DROP CONSTRAINT %I', constraint_name);
--     END IF;
-- END $$;
