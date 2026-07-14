INSERT INTO roles (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'ADMINISTRATOR', 'System administrator'),
('22222222-2222-2222-2222-222222222222', 'PROJECT_MANAGER', 'Project manager'),
('33333333-3333-3333-3333-333333333333', 'USER', 'Regular user');

-- password: password123
-- Password is 'password123'
INSERT INTO users
(id, username, email, password_hash, full_name, avatar_url, is_active)
VALUES

(
'aaaaaaaa-1111-1111-1111-111111111111',
'admin.user',
'admin@taskmanager.local',
'$2b$10$B3i7011fVoEW90eQX4qaAexKLWBN3ZqJbfRZZDCu7rMPup4ppu3ha',
'Admin User',
'https://i.pravatar.cc/300?img=1',
true
),

(
'bbbbbbbb-2222-2222-2222-222222222222',
'sarah.pm',
'sarah@taskmanager.local',
'$2b$10$B3i7011fVoEW90eQX4qaAexKLWBN3ZqJbfRZZDCu7rMPup4ppu3ha',
'Sarah Johnson',
'https://i.pravatar.cc/300?img=5',
true
),

(
'cccccccc-3333-3333-3333-333333333333',
'john.dev',
'john@taskmanager.local',
'$2b$10$B3i7011fVoEW90eQX4qaAexKLWBN3ZqJbfRZZDCu7rMPup4ppu3ha',
'John Carter',
'https://i.pravatar.cc/300?img=8',
true
),

(
'dddddddd-4444-4444-4444-444444444444',
'emily.dev',
'emily@taskmanager.local',
'$2b$10$B3i7011fVoEW90eQX4qaAexKLWBN3ZqJbfRZZDCu7rMPup4ppu3ha',
'Emily Davis',
'https://i.pravatar.cc/300?img=9',
true
),

(
'eeeeeeee-5555-5555-5555-555555555555',
'michael.qa',
'michael@taskmanager.local',
'$2b$10$B3i7011fVoEW90eQX4qaAexKLWBN3ZqJbfRZZDCu7rMPup4ppu3ha',
'Michael Brown',
'https://i.pravatar.cc/300?img=12',
true
),

(
'ffffffff-6666-6666-6666-666666666666',
'inactive.user',
'inactive@taskmanager.local',
'$2b$10$B3i7011fVoEW90eQX4qaAexKLWBN3ZqJbfRZZDCu7rMPup4ppu3ha',
'Inactive User',
NULL,
false
);


INSERT INTO user_roles (user_id, role_id)
VALUES

('aaaaaaaa-1111-1111-1111-111111111111',
'11111111-1111-1111-1111-111111111111'),

('bbbbbbbb-2222-2222-2222-222222222222',
'22222222-2222-2222-2222-222222222222'),

('cccccccc-3333-3333-3333-333333333333',
'33333333-3333-3333-3333-333333333333'),

('dddddddd-4444-4444-4444-444444444444',
'33333333-3333-3333-3333-333333333333'),

('eeeeeeee-5555-5555-5555-555555555555',
'33333333-3333-3333-3333-333333333333');
