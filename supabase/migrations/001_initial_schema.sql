-- ============================================================
-- DayFlow HR Intelligence — Supabase Migration
-- Migration: 001_initial_schema.sql
-- Run this in: Supabase Studio → SQL Editor → New Query
-- ============================================================

-- ============================================================
-- SECTION 1: DROP TABLES (safe re-run)
-- ============================================================
DROP TABLE IF EXISTS pending_approvals CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS important_dates CASCADE;
DROP TABLE IF EXISTS hr_attention_alerts CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS leave_impact CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS leave_balance CASCADE;
DROP TABLE IF EXISTS employees CASCADE;

-- ============================================================
-- SECTION 2: CREATE TABLES
-- ============================================================

-- 2.1 Employees
CREATE TABLE employees (
  id                  TEXT PRIMARY KEY,                          -- e.g. 'EMP-101'
  name                TEXT NOT NULL,
  initials            TEXT NOT NULL,
  email               TEXT NOT NULL UNIQUE,
  role                TEXT NOT NULL CHECK (role IN ('hr_manager', 'employee')),
  designation         TEXT NOT NULL,
  department          TEXT NOT NULL,
  joining_date        TEXT NOT NULL,
  phone               TEXT,
  location            TEXT,
  status              TEXT NOT NULL DEFAULT 'Present'
                        CHECK (status IN ('Present', 'On Leave', 'Absent', 'Half Day')),
  attendance_pct      NUMERIC(5,2) DEFAULT 100,
  -- Salary breakdown stored as individual columns for easy querying
  salary_basic        INTEGER DEFAULT 0,
  salary_hra          INTEGER DEFAULT 0,
  salary_special      INTEGER DEFAULT 0,
  salary_deductions   INTEGER DEFAULT 0,
  salary_net          INTEGER DEFAULT 0,
  -- Skills as a text array
  skills              TEXT[] DEFAULT '{}',
  workload_score      TEXT DEFAULT 'Normal'
                        CHECK (workload_score IN ('High', 'Medium', 'Normal')),
  avatar_gradient     TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Leave Balance (separate table so it can be updated independently)
CREATE TABLE leave_balance (
  id              SERIAL PRIMARY KEY,
  employee_id     TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  casual_used     INTEGER DEFAULT 0,
  casual_total    INTEGER DEFAULT 12,
  sick_used       INTEGER DEFAULT 0,
  sick_total      INTEGER DEFAULT 12,
  earned_used     INTEGER DEFAULT 0,
  earned_total    INTEGER DEFAULT 15,
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (employee_id)
);

-- 2.3 Leave Requests
CREATE TABLE leave_requests (
  id              TEXT PRIMARY KEY,                              -- e.g. 'LR-2026-089'
  employee_id     TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  employee_name   TEXT NOT NULL,
  role            TEXT NOT NULL,
  department      TEXT NOT NULL,
  leave_type      TEXT NOT NULL
                    CHECK (leave_type IN ('Casual Leave','Sick Leave','Earned Leave','Maternity Leave','Paternity Leave')),
  start_date      TEXT NOT NULL,
  end_date        TEXT NOT NULL,
  days_count      INTEGER NOT NULL,
  reason          TEXT,
  status          TEXT NOT NULL DEFAULT 'Pending'
                    CHECK (status IN ('Pending','Approved','Rejected','Request Changes')),
  submitted_at    TEXT NOT NULL DEFAULT 'Just now',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2.4 Leave Impact (one-to-one with leave_requests, stored as JSONB for flexibility)
CREATE TABLE leave_impact (
  id                        SERIAL PRIMARY KEY,
  leave_request_id          TEXT NOT NULL REFERENCES leave_requests(id) ON DELETE CASCADE,
  team_availability_pct     INTEGER NOT NULL,
  previous_availability_pct INTEGER NOT NULL,
  critical_skills_affected  INTEGER DEFAULT 0,
  active_projects_count     INTEGER DEFAULT 0,
  workload_impact           TEXT NOT NULL CHECK (workload_impact IN ('HIGH','MEDIUM','LOW')),
  team_members_on_leave     INTEGER DEFAULT 0,
  explanation               TEXT,
  affected_team_members     JSONB DEFAULT '[]',                  -- Array of {name, role, skills, currentWorkload}
  affected_projects         TEXT[] DEFAULT '{}',
  suggested_actions         TEXT[] DEFAULT '{}',
  UNIQUE (leave_request_id)
);

-- 2.5 Attendance Records
CREATE TABLE attendance_records (
  id              TEXT PRIMARY KEY,                              -- e.g. 'ATT-01'
  employee_id     TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  employee_name   TEXT NOT NULL,
  department      TEXT NOT NULL,
  date            TEXT NOT NULL,
  check_in        TEXT DEFAULT '-',
  check_out       TEXT DEFAULT '-',
  status          TEXT NOT NULL DEFAULT 'Present'
                    CHECK (status IN ('Present','Late','Absent','Half Day')),
  overtime_hours  NUMERIC(4,2) DEFAULT 0,
  late_arrival    BOOLEAN DEFAULT FALSE,
  anomaly_flag    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2.6 HR Attention Alerts
CREATE TABLE hr_attention_alerts (
  id                  TEXT PRIMARY KEY,                          -- e.g. 'ALT-101'
  priority            TEXT NOT NULL CHECK (priority IN ('HIGH','MEDIUM','LOW')),
  category            TEXT NOT NULL
                        CHECK (category IN ('Availability','Attendance Pattern','Leave Concentration','Overtime Spike','Burnout Risk')),
  title               TEXT NOT NULL,
  summary             TEXT,
  department          TEXT,
  impact_level        TEXT NOT NULL CHECK (impact_level IN ('HIGH','MEDIUM','LOW')),
  evidence_text       TEXT,
  recommended_action  TEXT,
  status              TEXT NOT NULL DEFAULT 'Active'
                        CHECK (status IN ('Active','Investigating','Resolved')),
  affected_count      INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 2.7 Important Dates
CREATE TABLE important_dates (
  id          TEXT PRIMARY KEY,                                  -- e.g. 'EVT-01'
  title       TEXT NOT NULL,
  date        TEXT NOT NULL,
  days_left   INTEGER NOT NULL,
  category    TEXT NOT NULL
                CHECK (category IN ('Company Events','Payroll','Performance Reviews','Benefits','Holidays','Compliance','Meetings')),
  description TEXT,
  priority    TEXT NOT NULL DEFAULT 'Normal'
                CHECK (priority IN ('High','Medium','Normal')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2.8 Announcements
CREATE TABLE announcements (
  id          TEXT PRIMARY KEY,                                  -- e.g. 'ANC-01'
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  posted_by   TEXT NOT NULL,
  time_ago    TEXT NOT NULL DEFAULT 'Just now',
  priority    TEXT NOT NULL DEFAULT 'Normal'
                CHECK (priority IN ('Important','Normal')),
  category    TEXT NOT NULL
                CHECK (category IN ('Policy','Holiday','Event','General')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2.9 Pending Approvals
CREATE TABLE pending_approvals (
  id                TEXT PRIMARY KEY,                            -- e.g. 'PA-01'
  type              TEXT NOT NULL
                      CHECK (type IN ('Leave Request','Overtime Claim','Document Request','Attendance Correction')),
  employee_name     TEXT NOT NULL,
  department        TEXT NOT NULL,
  details           TEXT,
  date              TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'Pending'
                      CHECK (status IN ('Pending','Approved','Rejected')),
  leave_request_id  TEXT REFERENCES leave_requests(id) ON DELETE SET NULL,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SECTION 3: INDEXES (for common query patterns)
-- ============================================================
CREATE INDEX idx_leave_requests_employee_id ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_attendance_records_employee_id ON attendance_records(employee_id);
CREATE INDEX idx_attendance_records_date ON attendance_records(date);
CREATE INDEX idx_pending_approvals_status ON pending_approvals(status);
CREATE INDEX idx_hr_attention_alerts_status ON hr_attention_alerts(status);

-- ============================================================
-- SECTION 4: UPDATED_AT TRIGGER (auto-update timestamp)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_employees
  BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_leave_requests
  BEFORE UPDATE ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_hr_attention_alerts
  BEFORE UPDATE ON hr_attention_alerts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_pending_approvals
  BEFORE UPDATE ON pending_approvals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SECTION 5: ROW LEVEL SECURITY (optional — disabled by default)
-- Uncomment the lines below to enable RLS for production use.
-- ============================================================
-- ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leave_balance ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE leave_impact ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE hr_attention_alerts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE important_dates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE pending_approvals ENABLE ROW LEVEL SECURITY;

-- Full-access policy (for anon key, no auth):
-- CREATE POLICY "allow_all" ON employees FOR ALL USING (true) WITH CHECK (true);
-- (Repeat for each table if you enable RLS without auth)

-- ============================================================
-- SECTION 6: SEED DATA (matches src/data/initialData.ts)
-- ============================================================

-- 6.1 Employees
INSERT INTO employees (id, name, initials, email, role, designation, department, joining_date, phone, location, status, attendance_pct, salary_basic, salary_hra, salary_special, salary_deductions, salary_net, skills, workload_score, avatar_gradient) VALUES
('EMP-101', 'Arjun Mehta',   'AM', 'arjun.mehta@dayflow.io',   'employee',   'Senior Backend Developer',  'Backend',         '15 Jan 2022', '+91 98765 43210', 'Bangalore HQ', 'Present',  94.2, 65000, 26000, 19000, 10000, 100000, ARRAY['Node.js','PostgreSQL','Microservices','Redis','Python'],     'High',   'linear-gradient(135deg, #375DFB, #6D5EF0)'),
('EMP-102', 'Priya Sharma',  'PS', 'priya.sharma@dayflow.io',  'hr_manager', 'Head of HR Operations',     'Human Resources', '01 Mar 2020', '+91 98123 45678', 'Bangalore HQ', 'Present',  98.5, 80000, 32000, 23000, 15000, 120000, ARRAY['Talent Ops','Conflict Resolution','Strategic HR','Compliance'],  'Medium', 'linear-gradient(135deg, #1AA6A0, #375DFB)'),
('EMP-103', 'Vikram Singh',  'VS', 'vikram.singh@dayflow.io',  'employee',   'Lead Backend Engineer',     'Backend',         '10 Feb 2021', '+91 99887 76655', 'Bangalore HQ', 'Present',  96.0, 75000, 30000, 25000, 12000, 118000, ARRAY['System Design','PostgreSQL','Golang','Docker'],               'High',   'linear-gradient(135deg, #D6A94A, #F0C878)'),
('EMP-104', 'Sneha Reddy',   'SR', 'sneha.reddy@dayflow.io',  'employee',   'Senior UI/UX Designer',     'Product Design',  '01 Jun 2022', '+91 97766 55443', 'Remote',         'Present',  92.0, 60000, 24000, 16000,  8000,  92000, ARRAY['Figma','User Research','Design Systems','Prototyping'],     'Medium', 'linear-gradient(135deg, #12875A, #1AA6A0)'),
('EMP-105', 'Meera Iyer',    'MI', 'meera.iyer@dayflow.io',   'employee',   'QA Automation Lead',        'QA',              '12 Aug 2021', '+91 96655 44332', 'Bangalore HQ', 'On Leave', 89.4, 58000, 23200, 14800,  7000,  89000, ARRAY['Playwright','Jest','Cypress','API Testing'],                  'Medium', 'linear-gradient(135deg, #6D5EF0, #9C90F8)'),
('EMP-106', 'Rohan Das',     'RD', 'rohan.das@dayflow.io',    'employee',   'DevOps & Cloud Engineer',   'DevOps',          '20 Sep 2022', '+91 95544 33221', 'Bangalore HQ', 'Absent',   86.8, 62000, 24800, 18200,  9000,  96000, ARRAY['AWS','Kubernetes','Terraform','CI/CD Pipelines'],            'High',   'linear-gradient(135deg, #C6403C, #E37F7B)');

-- 6.2 Leave Balance
INSERT INTO leave_balance (employee_id, casual_used, casual_total, sick_used, sick_total, earned_used, earned_total) VALUES
('EMP-101', 4, 12, 6, 12, 5, 15),
('EMP-102', 2, 12, 1, 12, 3, 15),
('EMP-103', 3, 12, 2, 12, 4, 15),
('EMP-104', 5, 12, 4, 12, 6, 15),
('EMP-105', 7, 12, 3, 12, 8, 15),
('EMP-106', 6, 12, 5, 12, 2, 15);

-- 6.3 Leave Requests
INSERT INTO leave_requests (id, employee_id, employee_name, role, department, leave_type, start_date, end_date, days_count, reason, status, submitted_at) VALUES
('LR-2026-089', 'EMP-101', 'Arjun Mehta', 'Senior Backend Developer', 'Backend',        'Casual Leave', '15 May 2026', '18 May 2026', 4, 'Family event and personal travel', 'Pending',  '2 hours ago'),
('LR-2026-090', 'EMP-104', 'Sneha Reddy', 'Senior UI/UX Designer',   'Product Design', 'Sick Leave',   '22 May 2026', '23 May 2026', 2, 'Medical checkup and rest',          'Pending',  '5 hours ago'),
('LR-2026-085', 'EMP-105', 'Meera Iyer',  'QA Automation Lead',       'QA',             'Earned Leave', '24 May 2026', '25 May 2026', 2, 'Personal time off',                 'Approved', '1 day ago');

-- 6.4 Leave Impact
INSERT INTO leave_impact (leave_request_id, team_availability_pct, previous_availability_pct, critical_skills_affected, active_projects_count, workload_impact, team_members_on_leave, explanation, affected_team_members, affected_projects, suggested_actions) VALUES
('LR-2026-089', 62, 78, 2, 3, 'HIGH', 2,
  'Approving this request may reduce backend team availability below the recommended threshold (70%). Two other backend developers are already scheduled on leave.',
  '[{"name":"Vikram Singh","role":"Lead Backend Engineer","skills":["System Design","PostgreSQL"],"currentWorkload":"Critical"},{"name":"Karan Verma","role":"Junior Dev","skills":["Node.js API"],"currentWorkload":"High"}]',
  ARRAY['Core Payment Gateway Integration (Deadline: May 22)','Auth & Token Security Migration','Database Sharding Sprint 4'],
  ARRAY['Reassign payment gateway testing tasks to Vikram Singh','Notify Payment Project Manager (Rahul Kapoor)','Assign backup resource for high-priority API bugs','Consider schedule adjustment or partial leave request']
),
('LR-2026-090', 75, 100, 1, 2, 'MEDIUM', 0,
  'Design team coverage remains acceptable at 75%. Design system review can be postponed by 1 day.',
  '[{"name":"Ananya Gupta","role":"UI Designer","skills":["Figma"],"currentWorkload":"Normal"}]',
  ARRAY['Design System 2.0 Tokens','Mobile App Check-in Flow'],
  ARRAY['Pause Figma design review meeting','Notify Product Manager']
),
('LR-2026-085', 80, 100, 1, 1, 'LOW', 0,
  'QA team capacity is sufficient with low impact on active release schedules.',
  '[]',
  ARRAY['QA Regression Testing Suite'],
  ARRAY['Automated test run scheduled in CI/CD']
);

-- 6.5 Attendance Records
INSERT INTO attendance_records (id, employee_id, employee_name, department, date, check_in, check_out, status, overtime_hours, late_arrival, anomaly_flag) VALUES
('ATT-01', 'EMP-101', 'Arjun Mehta',  'Backend',        '20 May 2026', '09:12 AM', '06:30 PM', 'Present', 0,    FALSE, NULL),
('ATT-02', 'EMP-103', 'Vikram Singh', 'Backend',        '20 May 2026', '09:05 AM', '07:15 PM', 'Present', 1.25, FALSE, NULL),
('ATT-03', 'EMP-104', 'Sneha Reddy',  'Product Design', '20 May 2026', '09:45 AM', '06:15 PM', 'Late',    0,    TRUE,  '3rd Late Arrival this month'),
('ATT-04', 'EMP-105', 'Meera Iyer',   'QA',             '20 May 2026', '-',        '-',        'Absent',  0,    FALSE, 'Unplanned Absence'),
('ATT-05', 'EMP-106', 'Rohan Das',    'DevOps',         '20 May 2026', '10:15 AM', '08:45 PM', 'Late',    2.5,  TRUE,  '4th Late Arrival in 2 weeks');

-- 6.6 HR Attention Alerts
INSERT INTO hr_attention_alerts (id, priority, category, title, summary, department, impact_level, evidence_text, recommended_action, status, affected_count) VALUES
('ALT-101', 'HIGH',   'Availability',         'Backend Team — Low Availability Risk',              'Only 62% availability next week due to overlapping leave requests.',            'Backend',            'HIGH',   '3 out of 8 backend engineers requested or are on approved leave between May 15 and May 18. Critical projects pending release.',                                                               'Review Arjun Mehta''s pending leave request and consult Backend Lead Vikram Singh regarding task reassignments.', 'Active', 3),
('ALT-102', 'MEDIUM', 'Attendance Pattern',   'Attendance Pattern Change — Late Arrival Frequency','35% increase in late arrivals over the last 4 weeks (6 employees late 4+ times).', 'Engineering & QA',   'MEDIUM', '6 employees (including 3 in Engineering) recorded late check-ins on 4 separate days in 2 weeks. Pattern concentrated on Mondays and Fridays.',                                    'Schedule a check-in with department managers to review commute or remote work flex-hours.',                        'Active', 6),
('ALT-103', 'MEDIUM', 'Leave Concentration',  'Multiple Leave Requests — Same Day',                '5 team members across Engineering and QA requesting leave on May 26.',          'Cross-Department',   'MEDIUM', '5 employees submitted leave requests for May 26 (post-holiday bridge day). Potential impact on client release support.',                                                                'Review on-call coverage for May 26 before approving remaining pending requests.',                                 'Active', 5),
('ALT-104', 'LOW',    'Overtime Spike',        'DevOps Overtime Spike Detected',                    'DevOps team logged 34 hours of overtime this week (+42% increase).',           'DevOps',             'LOW',    'Cloud infrastructure migration resulted in late-night deployments for 2 engineers.',                                                                                                          'Ensure compensatory off is granted to DevOps team after deployment completion.',                                  'Active', 2);

-- 6.7 Important Dates
INSERT INTO important_dates (id, title, date, days_left, category, description, priority) VALUES
('EVT-01', 'Company Foundation Day',           '24 May 2026', 3,  'Company Events',     'Annual day celebrations and team awards at Main Auditorium.',         'High'),
('EVT-02', 'Monthly Payroll Processing',       '31 May 2026', 10, 'Payroll',            'Final salary approval cutoff and direct deposit execution.',          'High'),
('EVT-03', 'Q1 Performance Review Cycle',      '10 June 2026', 20, 'Performance Reviews','Manager feedback forms and self-assessment portal opens.',           'Medium'),
('EVT-04', 'Group Health Insurance Premium Due','15 June 2026', 25, 'Benefits',          'Annual corporate health policy renewal documentation.',              'Normal');

-- 6.8 Announcements
INSERT INTO announcements (id, title, content, posted_by, time_ago, priority, category) VALUES
('ANC-01', 'Office Holiday Announcement — Republic Day',
  'The office will remain closed on Monday, 26 May 2026 on account of Republic Day. Emergency support rosters will apply.',
  'Priya Sharma (HR Team)', '2 hours ago', 'Important', 'Holiday'),
('ANC-02', 'Q1 Performance Review Timeline',
  'The Q1 Performance Review process will officially begin on 10 June. Please ensure all project goal logs are updated by 5 June.',
  'Priya Sharma (HR Team)', '5 hours ago', 'Normal', 'Policy'),
('ANC-03', 'New Hybrid Work Policy Updated',
  'Updated guidelines for work-from-home requests have been published under Documents. Maximum 2 remote days per week without prior manager approval.',
  'HR Operations', '2 days ago', 'Normal', 'Policy');

-- 6.9 Pending Approvals
INSERT INTO pending_approvals (id, type, employee_name, department, details, date, status, leave_request_id) VALUES
('PA-01', 'Leave Request',         'Arjun Mehta',  'Backend',        'Casual Leave — 4 Days (15 May – 18 May)',           '15 May 2026', 'Pending', 'LR-2026-089'),
('PA-02', 'Leave Request',         'Sneha Reddy',  'Product Design', 'Sick Leave — 2 Days (22 May – 23 May)',             '22 May 2026', 'Pending', 'LR-2026-090'),
('PA-03', 'Overtime Claim',        'Rohan Das',    'DevOps',         '14.5 Hours Cloud Migration Overtime',               '18 May 2026', 'Pending', NULL),
('PA-04', 'Attendance Correction', 'Vikram Singh', 'Backend',        'Missed Check-out due to VPN outage (14 May)',       '14 May 2026', 'Pending', NULL),
('PA-05', 'Document Request',      'Meera Iyer',   'QA',             'Employment Verification Letter for Visa',           '19 May 2026', 'Pending', NULL);

-- ============================================================
-- Done! 
-- Verify with: SELECT COUNT(*) FROM employees; -- should return 6
-- ============================================================
