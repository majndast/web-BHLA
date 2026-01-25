-- =====================================================
-- BHLA Database Schema
-- Spusť tento SQL v Supabase SQL Editoru
-- (Dashboard → SQL Editor → New query → Paste → Run)
-- =====================================================

-- Tabulka: Týmy
CREATE TABLE IF NOT EXISTS teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#0B1F3B',
  founded INTEGER,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka: Hráči
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  number INTEGER,
  position TEXT CHECK (position IN ('brankář', 'obránce', 'útočník')),
  photo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka: Místa konání
CREATE TABLE IF NOT EXISTS venues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  lat DECIMAL(10, 7),
  lng DECIMAL(10, 7),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka: Zápasy
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  away_team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'finished', 'cancelled')) DEFAULT 'scheduled',
  home_score INTEGER,
  away_score INTEGER,
  period_1_home INTEGER,
  period_1_away INTEGER,
  period_2_home INTEGER,
  period_2_away INTEGER,
  period_3_home INTEGER,
  period_3_away INTEGER,
  overtime_home INTEGER,
  overtime_away INTEGER,
  shootout_home INTEGER,
  shootout_away INTEGER,
  has_overtime BOOLEAN DEFAULT false,
  has_shootout BOOLEAN DEFAULT false,
  home_shots INTEGER,
  away_shots INTEGER,
  home_penalties INTEGER,
  away_penalties INTEGER,
  notes TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabulka: Góly
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  scorer_id UUID REFERENCES players(id) ON DELETE SET NULL,
  assist1_id UUID REFERENCES players(id) ON DELETE SET NULL,
  assist2_id UUID REFERENCES players(id) ON DELETE SET NULL,
  period INTEGER CHECK (period >= 1 AND period <= 5), -- 4 = overtime, 5 = shootout
  time TEXT, -- formát "12:34"
  is_power_play BOOLEAN DEFAULT false,
  is_short_handed BOOLEAN DEFAULT false,
  is_empty_net BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka: Tresty
CREATE TABLE IF NOT EXISTS penalties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  period INTEGER CHECK (period >= 1 AND period <= 4),
  time TEXT,
  minutes INTEGER NOT NULL DEFAULT 2,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka: Statistiky brankářů v zápase
CREATE TABLE IF NOT EXISTS goalie_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  saves INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  shots_against INTEGER DEFAULT 0,
  minutes_played INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka: Novinky
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabulka: Galerie
CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  match_id UUID REFERENCES matches(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES gallery_albums(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka: Historie změn (pro zálohy)
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')) NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka: Administrátoři (role)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT CHECK (role IN ('admin', 'editor')) DEFAULT 'editor',
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE penalties ENABLE ROW LEVEL SECURITY;
ALTER TABLE goalie_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public can view players" ON players FOR SELECT USING (true);
CREATE POLICY "Public can view venues" ON venues FOR SELECT USING (true);
CREATE POLICY "Public can view published matches" ON matches FOR SELECT USING (is_published = true OR status = 'scheduled');
CREATE POLICY "Public can view goals" ON goals FOR SELECT USING (true);
CREATE POLICY "Public can view penalties" ON penalties FOR SELECT USING (true);
CREATE POLICY "Public can view goalie_stats" ON goalie_stats FOR SELECT USING (true);
CREATE POLICY "Public can view published news" ON news FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published albums" ON gallery_albums FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view gallery images" ON gallery_images FOR SELECT USING (true);

-- Admin full access (check if user is in admin_users table)
CREATE POLICY "Admins can do everything on teams" ON teams FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admins can do everything on players" ON players FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admins can do everything on venues" ON venues FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admins can do everything on matches" ON matches FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admins can do everything on goals" ON goals FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admins can do everything on penalties" ON penalties FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admins can do everything on goalie_stats" ON goalie_stats FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admins can do everything on news" ON news FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admins can do everything on gallery_albums" ON gallery_albums FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admins can do everything on gallery_images" ON gallery_images FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view audit_log" ON audit_log FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view admin_users" ON admin_users FOR SELECT
  USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- =====================================================
-- Trigger pro automatické updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- Trigger pro audit log (zálohy změn)
-- =====================================================

CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, action, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, user_id)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_data, user_id)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to important tables
CREATE TRIGGER audit_matches AFTER INSERT OR UPDATE OR DELETE ON matches
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();
CREATE TRIGGER audit_goals AFTER INSERT OR UPDATE OR DELETE ON goals
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();
CREATE TRIGGER audit_teams AFTER INSERT OR UPDATE OR DELETE ON teams
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();
CREATE TRIGGER audit_players AFTER INSERT OR UPDATE OR DELETE ON players
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- =====================================================
-- Vložení výchozích dat (místa konání)
-- =====================================================

INSERT INTO venues (name, address, lat, lng) VALUES
  ('Zimní stadion Soběslav', 'Wilsonova 628, 392 01 Soběslav', 49.2591, 14.7206),
  ('Zimní stadion Veselí nad Lužnicí', 'K Zastávce 800, 391 81 Veselí nad Lužnicí', 49.1836, 14.6975)
ON CONFLICT DO NOTHING;

-- =====================================================
-- HOTOVO! Nyní vytvoř uživatele v Authentication
-- a přidej ho do admin_users tabulky
-- =====================================================
