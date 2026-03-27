-- Create a function that calls the edge function
CREATE OR REPLACE FUNCTION public.handle_verified_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  response_status INTEGER;
  response_body TEXT;
BEGIN
  -- Only proceed if email is newly confirmed
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    -- Call the edge function using net.http
    SELECT status, content::text INTO response_status, response_body
    FROM net.http_post(
      url := 'https://' || current_setting('app.settings.project_ref') || '.supabase.co/functions/v1/send-welcome-email',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'email', NEW.email,
        'username', NEW.raw_user_meta_data->>'username',
        'userId', NEW.id
      )
    );
    
    RAISE LOG 'Welcome email trigger response: %', response_status;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_user_verified ON auth.users;
CREATE TRIGGER on_user_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_verified_user();