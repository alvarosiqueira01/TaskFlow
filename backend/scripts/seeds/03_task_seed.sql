
INSERT INTO tasks (
    id,
    owner_id,
    category_id,
    title,
    description,
    status,
    priority,
    visibility,
    due_date,
    archived,
    completed_at
)
VALUES

-- BACKLOG

(
'20000000-0000-0000-0000-000000000001',
'cccccccc-3333-3333-3333-333333333333',
'10000000-0000-0000-0000-000000000001',
'Implement dark mode',
'Create application-wide dark theme with persisted user preference.',
'BACKLOG',
'LOW',
'PRIVATE',
NOW() + INTERVAL '20 days',
false,
NULL
),

(
'20000000-0000-0000-0000-000000000002',
'dddddddd-4444-4444-4444-444444444444',
'10000000-0000-0000-0000-000000000003',
'Provision CloudFront distribution',
'Configure CDN for streaming media.',
'BACKLOG',
'HIGH',
'SHARED',
NOW() + INTERVAL '30 days',
false,
NULL
),

(
'20000000-0000-0000-0000-000000000003',
'cccccccc-3333-3333-3333-333333333333',
'10000000-0000-0000-0000-000000000002',
'Implement password recovery',
'Create password reset flow using JWT tokens.',
'BACKLOG',
'CRITICAL',
'PRIVATE',
NOW() + INTERVAL '10 days',
false,
NULL
),

-- TODO

(
'20000000-0000-0000-0000-000000000004',
'bbbbbbbb-2222-2222-2222-222222222222',
'10000000-0000-0000-0000-000000000001',
'Create Kanban board UI',
'Implement drag-and-drop task board.',
'TODO',
'HIGH',
'SHARED',
NOW() + INTERVAL '8 days',
false,
NULL
),

(
'20000000-0000-0000-0000-000000000005',
'dddddddd-4444-4444-4444-444444444444',
'10000000-0000-0000-0000-000000000004',
'Write integration tests',
'Increase backend integration test coverage.',
'TODO',
'MEDIUM',
'PRIVATE',
NOW() + INTERVAL '6 days',
false,
NULL
),

(
'20000000-0000-0000-0000-000000000006',
'bbbbbbbb-2222-2222-2222-222222222222',
'10000000-0000-0000-0000-000000000005',
'Investigate duplicate notifications',
'Users are receiving duplicated notification events.',
'TODO',
'CRITICAL',
'SHARED',
NOW() + INTERVAL '3 days',
false,
NULL
),

-- IN PROGRESS

(
'20000000-0000-0000-0000-000000000007',
'cccccccc-3333-3333-3333-333333333333',
'10000000-0000-0000-0000-000000000002',
'Connect Vue frontend to Fastify API',
'Consume Task Service endpoints from Vue application.',
'IN_PROGRESS',
'HIGH',
'SHARED',
NOW() + INTERVAL '4 days',
false,
NULL
),

(
'20000000-0000-0000-0000-000000000008',
'dddddddd-4444-4444-4444-444444444444',
'10000000-0000-0000-0000-000000000003',
'Configure Terraform infrastructure',
'Provision Lambda, API Gateway and RDS.',
'IN_PROGRESS',
'CRITICAL',
'PRIVATE',
NOW() + INTERVAL '5 days',
false,
NULL
),

(
'20000000-0000-0000-0000-000000000009',
'cccccccc-3333-3333-3333-333333333333',
'10000000-0000-0000-0000-000000000001',
'Responsive mobile layout',
'Improve usability on mobile devices.',
'IN_PROGRESS',
'MEDIUM',
'SHARED',
NOW() + INTERVAL '7 days',
false,
NULL
),

-- REVIEW

(
'20000000-0000-0000-0000-000000000010',
'dddddddd-4444-4444-4444-444444444444',
'10000000-0000-0000-0000-000000000002',
'Implement JWT refresh token',
'Refresh access token without requiring login.',
'REVIEW',
'CRITICAL',
'PRIVATE',
NOW() + INTERVAL '2 days',
false,
NULL
),

(
'20000000-0000-0000-0000-000000000011',
'eeeeeeee-5555-5555-5555-555555555555',
'10000000-0000-0000-0000-000000000004',
'Regression testing',
'Validate latest release before production.',
'REVIEW',
'HIGH',
'SHARED',
NOW() + INTERVAL '2 days',
false,
NULL
),

(
'20000000-0000-0000-0000-000000000012',
'cccccccc-3333-3333-3333-333333333333',
'10000000-0000-0000-0000-000000000005',
'Fix login redirect bug',
'Authenticated users are redirected to login after refresh.',
'REVIEW',
'MEDIUM',
'PRIVATE',
NOW() + INTERVAL '1 day',
false,
NULL
),

-- COMPLETED

(
'20000000-0000-0000-0000-000000000013',
'dddddddd-4444-4444-4444-444444444444',
'10000000-0000-0000-0000-000000000003',
'Generate pre-signed upload URLs',
'S3 uploads are now handled through signed URLs.',
'COMPLETED',
'HIGH',
'SHARED',
NOW() - INTERVAL '5 days',
false,
NOW() - INTERVAL '1 day'
),

(
'20000000-0000-0000-0000-000000000014',
'cccccccc-3333-3333-3333-333333333333',
'10000000-0000-0000-0000-000000000002',
'Create Auth API',
'Initial authentication service implementation.',
'COMPLETED',
'CRITICAL',
'PRIVATE',
NOW() - INTERVAL '8 days',
true,
NOW() - INTERVAL '4 days'
),

(
'20000000-0000-0000-0000-000000000015',
'eeeeeeee-5555-5555-5555-555555555555',
'10000000-0000-0000-0000-000000000004',
'CI/CD pipeline',
'Deploy services automatically using GitHub Actions.',
'COMPLETED',
'MEDIUM',
'SHARED',
NOW() - INTERVAL '3 days',
false,
NOW() - INTERVAL '2 days'
);


--------------------------------------------

INSERT INTO task_history
(id, task_id, user_id, action, field_name, old_value, new_value, created_at)
VALUES

-- ==================================================
-- Task 007 - Connect Vue frontend to Fastify API
-- ==================================================

(gen_random_uuid(),'20000000-0000-0000-0000-000000000007','cccccccc-3333-3333-3333-333333333333','CREATE',NULL,NULL,NULL,NOW()-INTERVAL '7 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000007','bbbbbbbb-2222-2222-2222-222222222222','UPDATE','status','BACKLOG','TODO',NOW()-INTERVAL '6 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000007','bbbbbbbb-2222-2222-2222-222222222222','ASSIGN','assignee',NULL,'Emily Davis',NOW()-INTERVAL '6 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000007','dddddddd-4444-4444-4444-444444444444','UPDATE','status','TODO','IN_PROGRESS',NOW()-INTERVAL '5 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000007','dddddddd-4444-4444-4444-444444444444','UPDATE','description','Initial draft','Added API integration details',NOW()-INTERVAL '4 days'),

-- ==================================================
-- Task 010
-- ==================================================

(gen_random_uuid(),'20000000-0000-0000-0000-000000000010','cccccccc-3333-3333-3333-333333333333','CREATE',NULL,NULL,NULL,NOW()-INTERVAL '5 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000010','bbbbbbbb-2222-2222-2222-222222222222','UPDATE','priority','HIGH','CRITICAL',NOW()-INTERVAL '5 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000010','cccccccc-3333-3333-3333-333333333333','UPDATE','status','TODO','IN_PROGRESS',NOW()-INTERVAL '4 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000010','cccccccc-3333-3333-3333-333333333333','UPDATE','status','IN_PROGRESS','REVIEW',NOW()-INTERVAL '2 days'),

-- ==================================================
-- Task 013
-- ==================================================

(gen_random_uuid(),'20000000-0000-0000-0000-000000000013','dddddddd-4444-4444-4444-444444444444','CREATE',NULL,NULL,NULL,NOW()-INTERVAL '8 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000013','aaaaaaaa-1111-1111-1111-111111111111','ASSIGN','assignee',NULL,'John Carter',NOW()-INTERVAL '8 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000013','dddddddd-4444-4444-4444-444444444444','UPDATE','status','TODO','IN_PROGRESS',NOW()-INTERVAL '7 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000013','dddddddd-4444-4444-4444-444444444444','UPDATE','status','IN_PROGRESS','REVIEW',NOW()-INTERVAL '6 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000013','bbbbbbbb-2222-2222-2222-222222222222','UPDATE','status','REVIEW','COMPLETED',NOW()-INTERVAL '1 day'),

-- ==================================================
-- Task 006
-- ==================================================

(gen_random_uuid(),'20000000-0000-0000-0000-000000000006','bbbbbbbb-2222-2222-2222-222222222222','CREATE',NULL,NULL,NULL,NOW()-INTERVAL '4 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000006','aaaaaaaa-1111-1111-1111-111111111111','ASSIGN','assignee',NULL,'Michael Brown',NOW()-INTERVAL '4 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000006','eeeeeeee-5555-5555-5555-555555555555','UPDATE','status','TODO','IN_PROGRESS',NOW()-INTERVAL '3 days'),

(gen_random_uuid(),'20000000-0000-0000-0000-000000000006','eeeeeeee-5555-5555-5555-555555555555','UPDATE','priority','HIGH','CRITICAL',NOW()-INTERVAL '2 days');



